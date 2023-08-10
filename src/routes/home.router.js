import { Router } from 'express'
import { ProductManager } from '../dao/mongoose/productManager.js'
import io from '../app.js'
import socketManager from '../websocket/index.js'
import { CartManager } from '../dao/mongoose/cartManager.js'
import { MongooseError } from '../errors/index.js'

const router = Router()
const productManager = new ProductManager()
const cartManager = new CartManager()

const getPageLink = ({ baseURL, queryName, queryValue, limit, order, page }) => {
  let finalURL = baseURL + '?'
  if (queryName) {
    finalURL = finalURL + `queryName=${queryName}&`
  }
  if (queryValue) {
    finalURL = finalURL + `queryValue=${queryValue}&`
  }
  if (limit) {
    finalURL = finalURL + `limit=${limit}&`
  }
  if (order) {
    finalURL = finalURL + `order=${order}&`
  }
  if (page) {
    finalURL = finalURL + `page=${page}`
  }
  return finalURL
}

const findProductsAndBuildResponse = async ({ req, baseURL }) => {
  const { queryName, queryValue, limit, page, order } = req.query
  try {
    const products = await productManager.find({ queryName, queryValue, limit, page, order })
    const prevLink = products.hasPrevPage
      ? `${getPageLink({ queryName, queryValue, limit, order, page: products.prevPage, baseURL })}`
      : ''
    const nextLink = products.hasNextPage
      ? `${getPageLink({ queryName, queryValue, limit, order, page: products.nextPage, baseURL })}`
      : ''

    const response = {
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink,
      nextLink
    }
    return response
  } catch (err) {
    throw new MongooseError(err.message)
  }
}

router.get('/', async (req, res) => {
  try {
    const response = await findProductsAndBuildResponse({ req, baseURL: 'http://localhost:8080' })
    res.render('home', {
      title: 'Home',
      products: response.payload,
      pagination: response.totalPages > 1,
      hasPrevPage: response.hasPrevPage,
      hasNextPage: response.hasNextPage,
      prevLink: response.prevLink,
      nextLink: response.nextLink
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/realtimeproducts', async (req, res) => {
  // Initializes socket server
  io.once('connection', socketManager)
  try {
    const response = await findProductsAndBuildResponse({ req, baseURL: 'http://localhost:8080/realtimeproducts' })
    res.render('realtimeproducts', {
      title: 'Real Time Products',
      products: response.payload,
      pagination: response.totalPages > 1,
      hasPrevPage: response.hasPrevPage,
      hasNextPage: response.hasNextPage,
      prevLink: response.prevLink,
      nextLink: response.nextLink
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/buyproducts', async (req, res) => {
  try {
    const response = await findProductsAndBuildResponse({ req, baseURL: 'http://localhost:8080/buyproducts' })
    res.render('buyproducts', {
      title: 'Buy Products',
      products: response.payload,
      pagination: response.totalPages > 1,
      hasPrevPage: response.hasPrevPage,
      hasNextPage: response.hasNextPage,
      prevLink: response.prevLink,
      nextLink: response.nextLink
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/product/:pid', async (req, res) => {
  const product = await productManager.findById(req.params.pid)
  res.render('product', {
    title: `${product.title}`,
    product
  })
})

router.get('/buyproduct/:pid', async (req, res) => {
  const product = await productManager.findById(req.params.pid)
  res.render('buyproduct', {
    title: `${product.title}`,
    product
  })
})

router.get('/cart/:cid', async (req, res) => {
  // Initialises socket server
  io.once('connection', socketManager)
  const products = await cartManager.findById(req.params.cid)
  const total = await cartManager.getTotal({ id: req.params.cid })
  res.render('cart', {
    title: 'Cart',
    id: req.params.cid,
    products,
    total
  })
})

router.get('/chat', async (req, res) => {
  // Initializes socket server
  io.once('connection', socketManager)
  res.render('chat', {
    title: 'Chat'
  })
})

export default router
