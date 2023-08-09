import { Router } from 'express'
import { ProductManager } from '../../dao/mongoose/productManager.js'
import io from '../../app.js'
import { ProductNotFound, ValidationError } from '../../errors/index.js'

const productManager = new ProductManager()
const router = Router()

// Endpoint for retrieving all of the products in the database.
// It can be limited if included in the url a limit.
router.get('/', async (req, res) => {
  let products = await productManager.find()
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

// Endpoint for retrieving the product with id pid.
router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.findById(req.params.pid)
    if (product) {
      return res.json({ message: 'Product found', product })
    } else {
      return res.status(404).json({ message: 'Product not found' })
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ message: err.message })
    }
    return res.status(500).json({ message: err.message })
  }
})

// Endpoint for adding one product to the database
router.post('/', async (req, res) => {
  const product = req.body
  try {
    const newProduct = await productManager.create(product)
    io.emit('new_product', newProduct)
    return res.status(201).json({ message: 'Product added', product: newProduct })
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ message: err.message })
    }
    return res.status(500).json({ message: err.message })
  }
})

router.put('/:pid', async (req, res) => { // Endpoint for updating a product
  const product = req.body
  try {
    await productManager.updateOne(req.params.pid, product)
    io.emit('product_updated', { id: req.params.pid, product })
    return res.json({ message: 'Product updated' })
  } catch (err) {
    if (err instanceof ProductNotFound) {
      return res.status(404).json({ message: err.message })
    }
    return res.status(500).json({ message: err.message })
  }
})

router.delete('/:pid', async (req, res) => {
  try {
    await productManager.deleteOne(req.params.pid)
    io.emit('product_deleted', req.params.pid)
    return res.status(204).json({ message: `Product width id ${req.params.pid} removed correctly` })
  } catch (err) {
    if (err instanceof ProductNotFound) {
      return res.status(404).json({ message: err.message })
    }
    return res.status(500).json({ message: err.message })
  }
})

export default router
