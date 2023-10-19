import { Router } from 'express'
import socketManager from '../websocket/index.js'
import { isAuth } from '../middlewares/auth-middleware.js'
import { getById, getTotal } from '../controllers/carts.controller.js'
import { get, getById as getProductById } from '../controllers/products.controller.js'
import ProductDTO from '../dao/DTOs/product.dto.js'
import { create } from '../controllers/tickets.controller.js'

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

router.get('/checkout/:cid', isAuth, async (req, res) => {
  try {
    const response = await create(req)
    if (response.success) {
      res.render('thanks', {
        title: 'Thanks for your purchase',
        ticket: response.payload,
        user: req.user
      })
    } else {
      return res.status(response.status).json(response)
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.get('/manage', isAuth, async (req, res) => {
  if (req.session.user.role !== 'admin' | 'premium') {
    req.logger.warning('Not admin trying to access')
    return res.redirect('/login')
  }
  try {
    const response = await get({ user: req.user, baseURL: 'http://localhost:8080/manage' })
    if (response.success) {
      return res.render('manageproducts', {
        title: 'Manage Products',
        products: response.payload,
        pagination: response.totalPages > 1,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
        prevLink: response.prevLink,
        nextLink: response.nextLink,
        user: response.user
      })
    } else {
      req.logger.error(response.error)
      return res.status(response.status).json({ message: response.error })
    }
  } catch (err) {
    req.logger.error(err.message)
    return res.status(500).json({ message: err.message })
  }
})

router.get('/editproduct/:pid', isAuth, async (req, res) => {
  if (req.session.user.role !== 'admin' | 'premium') {
    req.logger.warning('Not admin trying to access')
    return res.redirect('/login')
  }
  try {
    const response = await getProductById(req)
    if (response.success) {
      return res.render('editproduct', {
        title: 'Edit Product',
        productId: response.payload._id,
        productTitle: response.payload.title,
        description: response.payload.description,
        code: response.payload.code,
        price: response.payload.price,
        status: response.payload.status,
        thumbnails: response.payload.thumbnails,
        stock: response.payload.stock,
        email: req.session.user.email,
        role: req.session.user.role
      })
    } else {
      req.logger.error(response.error)
      return res.status(response.status).json({ message: response.error })
    }
  } catch (err) {
    req.logger.error(err.message)
    return res.status(500).json({ message: err.message })
  }
})

router.get('/addProduct', async (req, res) => {
  if (req.session.user.role !== 'admin' | 'premium') {
    req.logger.warning('Not admin trying to access')
    return res.redirect('/login')
  }
  return res.render('addproduct', {
    title: 'Add Product',
    email: req.session.user.email,
    role: req.session.user.role
  })
})

router.get('/loggerTest', (req, res) => {
  req.logger.fatal('This is a fatal log')
  req.logger.error('This is a error log')
  req.logger.warning('This is a warning log')
  req.logger.info('This is a info log')
  req.logger.debug('This is a debug log')
  req.logger.http('This is a http log')
  res.send('This is a route for testing the logger')
})

export default router
