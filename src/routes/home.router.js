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

router.get('/buyproducts', async (req, res) => {
  const products = await productManager.getProducts()
  res.render('buyproducts', {
    title: 'Buy Products',
    products
  })
})

router.get('/product/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid)
  res.render('product', {
    title: `${product.title}`,
    product
  })
})

router.get('/buyproduct/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid)
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
  console.log(products, total)
  res.render('cart', {
    title: 'Cart',
    products,
    total
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
