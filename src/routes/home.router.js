import { Router } from 'express'
import { ProductManager } from '../dao/mongoose/productManager.js'
import io from '../app.js'
import socketManager from '../websocket/index.js'

const router = Router()
const productManager = new ProductManager()

router.get('/', async (req, res) => {
  const products = await productManager.getProducts()

  res.render('home', {
    title: 'Home',
    products,
    style: 'home'
  })
})

router.get('/realtimeproducts', async (req, res) => {
  // Initializes socket server
  io.on('connection', socketManager)

  const products = await productManager.getProducts()
  res.render('realtimeproducts', {
    title: 'Real Time Products',
    products,
    style: 'home'
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