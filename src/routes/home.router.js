import { Router } from 'express'
import { ProductManager } from '../dao/mongoose/productManager.js'
import io from '../app.js'
import socketManager from '../websocket/index.js'
import { CartManager } from '../dao/mongoose/cartManager.js'
import { MongooseError } from '../errors/index.js'

const router = Router()
const productManager = new ProductManager()
const cartManager = new CartManager()

const findProductsAndBuildResponse = async (req) => {
  const { query, limit, page, order } = req.query
  try {
    const products = await productManager.find({ query, limit, page, order })
    const prevLink = products.hasPrevPage ? `http:localhost:8080/?page=${products.prevPage}` : ''
    const nextLink = products.hasNextPage ? `http:localhost:8080/?page=${products.nextPage}` : ''
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
    const response = await findProductsAndBuildResponse(req)
    res.render('home', {
      title: 'Home',
      products: response.docs
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/realtimeproducts', async (req, res) => {
  // Initializes socket server
  io.once('connection', socketManager)
  try {
    const response = await findProductsAndBuildResponse(req)
    res.render('realtimeproducts', {
      title: 'Real Time Products',
      products: response.docs
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/buyproducts', async (req, res) => {
  try {
    const response = await findProductsAndBuildResponse(req)
    res.render('buyproducts', {
      title: 'Buy Products',
      products: response.docs
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
  const products = await cartManager.getCartProductsById(req.params.cid)
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
