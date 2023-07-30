import { Router } from 'express'
import { ProductManager } from '../../managers/productManager.js'
import __dirname from '../../utils.js'
import { join } from 'path'
import io from '../../app.js'

const productManager = new ProductManager(join(__dirname, '/database/products.json'))
const router = Router()

router.get('/', async (req, res) => { // Endpoint for retrieving all of the products in the file. It can be limited if included in the url a limit.
    let products = await productManager.getProducts()
    if (req.query.limit) {
        if (isNaN(req.query.limit)) return res.status(400).send('Limit must be a number')
        const limit = Number(req.query.limit)
        products = limit === 0 || limit > products.length ? products : products.slice(0, limit)
    }
    if (products.length === 0) return res.status(204) // There are no products
    return res.json(products)
})
  
router.get('/:pid', async (req, res) => { // Endpoint for retrieving the product with id pid.
    try {
        const product = await productManager.getProductById(req.params.pid)
        return res.json({message: 'Product found', product}) 
    } catch (err) {

        return res.status(404).send(err.message)
    }
})

router.post('/', async (req, res) => { // Endpoint for adding one product
    const product = req.body
    try {
        const newProduct = await productManager.addProduct(product)
        io.emit('new_product', newProduct)
        return res.status(201).json({message: 'Product added', product: newProduct})
    } catch (err) {
        return res.status(400).send(err.message)
    }
})

router.put('/:pid', async (req, res) => { // Endpoint for updating a product
    const product = req.body
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, product)
        return res.json({message: 'Product added', product: updatedProduct})
    } catch (err) {
        return res.status(404).send(err.message)
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const products = await productManager.deleteProduct(req.params.pid)
        io.emit('product_deleted', req.params.pid)
        return res.status(204).json({message: `Product width id ${req.params.pid} removed correctly`})
    } catch(err) {
        return res.status(404).send(err.message)
    }
})

export default router