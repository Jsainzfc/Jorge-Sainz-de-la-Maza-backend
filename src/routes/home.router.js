import { Router } from 'express'
import { ProductManager } from '../managers/productManager.js'
import __dirname from '../utils.js';
import { join } from 'path'

const router = Router()
const productManager = new ProductManager(join(__dirname, '/database/products.json'))

router.get('/', async (req, res) => {
  const products = await productManager.getProducts()

  res.render('home', {
    title: 'Home',
    products,
    style: 'home'
  })
})

// router.get('/carrito', (req, res) => {
//   // res.sendFile(path.join(__dirname, '../public/carrito.html'))
//   res.render('carrito', {
//     numItems: 2,
//     title: 'Carrito'
//   })
// })

export default router