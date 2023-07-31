import { Router } from 'express'
import { ProductManager } from '../../dao/mongoose/productManager.js'
import io from '../../app.js'

const productManager = new ProductManager()
const router = Router()

router.get('/', async (req, res) => { // Endpoint for retrieving all of the products in the file. It can be limited if included in the url a limit.
  let products = await productManager.getProducts()
  if (req.query.limit) {
    if (isNaN(req.query.limit)) {
      return res.status(400).json({ message: 'Limit must be a number' })
    }
    const limit = Number(req.query.limit)
    products = limit === 0 || limit > products.length ? products : products.slice(0, limit)
  }
  if (products.length === 0) {
    return res.status(204).json({ message: 'No products found' }) // There are no products
  }
  return res.json({ message: 'Successful', products })
})

router.get('/:pid', async (req, res) => { // Endpoint for retrieving the product with id pid.
  try {
    const product = await productManager.getProductById(req.params.pid)
    return res.json({ message: 'Product found', product })
  } catch (err) {
    return res.status(404).json({ message: err.message })
  }
})

router.post('/', async (req, res) => { // Endpoint for adding one product
  const product = req.body
  try {
    const newProduct = await productManager.addProduct(product)
    io.emit('new_product', newProduct)
    return res.status(201).json({ message: 'Product added', product: newProduct })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

router.put('/:pid', async (req, res) => { // Endpoint for updating a product
  const product = req.body
  try {
    await productManager.updateProduct(req.params.pid, product)
    return res.json({ message: 'Product updated' })
  } catch (err) {
    return res.status(404).json({ message: err.message })
  }
})

router.delete('/:pid', async (req, res) => {
  try {
    await productManager.deleteProduct(req.params.pid)
    io.emit('product_deleted', req.params.pid)
    return res.status(204).json({ message: `Product width id ${req.params.pid} removed correctly` })
  } catch (err) {
    return res.status(404).json({ message: err.message })
  }
})

export default router
