import { Router } from 'express'
import { ProductManager } from '../dao/mongoose/productManager.js'
import io from '../app.js'
import socketManager from '../websocket/index.js'
import { CartManager } from '../dao/mongoose/cartManager.js'

const router = Router()
const productManager = new ProductManager()
const cartManager = new CartManager()

router.get('/', async (req, res) => {
  const products = await productManager.getProducts()

  res.render('home', {
    title: 'Home',
    products
  })
})

router.get('/realtimeproducts', async (req, res) => {
  // Initializes socket server
  io.once('connection', socketManager)

  const products = await productManager.getProducts()

  res.render('realtimeproducts', {
    title: 'Real Time Products',
    products
  })
})

router.get('/cart/:cid', async (req, res) => {
  // Initialises socket server
  io.once('connection', socketManager)
  const products = await cartManager.getCartProductsById(req.params.cid)

  res.render('cart', {
    title: 'Cart',
    products
  })
})

router.get('/chat', async (req, res) => {
  // Initializes socket server
  io.once('connection', socketManager)

  res.render('chat', {
    title: 'Chat',
    style: 'chat'
  })
})

export default router
