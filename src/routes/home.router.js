import { Router } from 'express'
import socketManager from '../websocket/index.js'
import { isAuth } from '../middlewares/auth-middleware.js'
import { getById, getTotal } from '../controllers/carts.controller.js'
import { get, getById as getProductById } from '../controllers/products.controller.js'
import ProductDTO from '../dao/DTOs/product.dto.js'

const router = Router()

router.get('/', isAuth, async (req, res) => {
  try {
    const { queryName, queryValue, limit, page, order } = req.query
    const response = await get({ queryName, queryValue, limit, page, order, user: req.user, baseURL: 'http://localhost:8080' })
    if (response.success) {
      res.render('home', {
        title: 'Home',
        products: response.payload,
        pagination: response.totalPages > 1,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
        prevLink: response.prevLink,
        nextLink: response.nextLink,
        user: response.user
      })
    } else {
      return res.status(response.status).json({ message: response.error })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/realtimeproducts', isAuth, async (req, res) => {
  // Initializes socket server
  req.io.once('connection', socketManager)
  try {
    const { queryName, queryValue, limit, page, order } = req.query
    const response = await get({ queryName, queryValue, limit, page, order, user: req.user, baseURL: 'http://localhost:8080/realtimeproducts' })
    if (!response.success) {
      return res.status(response.status).json({ message: response.error })
    } else {
      res.render('realtimeproducts', {
        title: 'Real Time Products',
        products: response.payload,
        pagination: response.totalPages > 1,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
        prevLink: response.prevLink,
        nextLink: response.nextLink,
        user: response.user
      })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/buyproducts', isAuth, async (req, res) => {
  try {
    const { queryName, queryValue, limit, page, order } = req.query
    const response = await get({ queryName, queryValue, limit, page, order, user: req.user, baseURL: 'http://localhost:8080/buyproducts' })
    if (response.success) {
      res.render('buyproducts', {
        title: 'Buy Products',
        products: response.payload,
        pagination: response.totalPages > 1,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
        prevLink: response.prevLink,
        nextLink: response.nextLink,
        user: response.user
      })
    } else {
      return res.status(response.status).json({ message: response.error })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/product/:pid', isAuth, async (req, res) => {
  let response
  try {
    response = await getProductById(req)
    if (response.success) {
      res.render('product', {
        title: `${response.payload.title}`,
        product: new ProductDTO(response.payload),
        user: req.user
      })
    } else {
      return res.status(response.status).json({ message: response.error })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/buyproduct/:pid', isAuth, async (req, res) => {
  try {
    const response = await getProductById(req)
    if (response.success) {
      res.render('buyproduct', {
        title: `${response.payload.title}`,
        product: new ProductDTO(response.payload),
        user: req.user
      })
    } else {
      return res.status(response.status).json({ message: response.error })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/cart/:cid', isAuth, async (req, res) => {
  // Initialises socket server
  req.io.once('connection', socketManager)
  try {
    const response = await getById(req)
    if (response.success) {
      const total = await getTotal({ id: req.params.cid })
      res.render('cart', {
        title: 'Cart',
        id: req.params.cid,
        products: response.payload,
        total,
        user: req.user
      })
    } else {
      return res.status(response.status).json(response)
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/chat', isAuth, async (req, res) => {
  // Initializes socket server
  req.io.once('connection', socketManager)
  res.render('chat', {
    title: 'Chat',
    user: req.user
  })
})

export default router
