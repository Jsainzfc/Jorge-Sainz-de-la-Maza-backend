import {Router} from 'express'
import { ProductManager } from './productManager.js'
import path  from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productManager = new ProductManager(path.join(__dirname, 'productsForTesting.json'))

const router = Router()

app.get('/', async (req, res) => { // Endpoint for retrieving all of the products in the file. It can be limited if included in the url a limit.
    let products = await productManager.getProducts()
    try { // Check if limit (if included) is a number, else return a 400 error
        if (isNaN(req.query.limit)) {
        throw new Error('Limit must be a number')
        }
    } catch (err){
        return res.status(400).send(err.message)
    }
    const limit = Number(req.query.limit)

    if (products.length === 0) return res.status(204)

    if (limit) {
        products = limit > products.length ? products : products.slice(0, limit-1) 
        // If limit is larger than the amount of items, return all of them
    }
    return res.json(products)
})
  
app.get('/:pid', async (req, res) => { // Endpoint for retrieving the product with id pid.
    try { // Check if id is a number, else return a 400 error
        if (isNaN(req.query.id)) {
        throw new Error('Id must be a number')
        }
    } catch (err){
        return res.status(400).send(err.message)
    }
    const id = Number(req.query.id)

    let product
    try {
        product = await productManager.getProductById(id)
        return res.json(product) 
    } catch (err) {
        return res.status(404).send('Product not found.')
    }
})

app.post('/', async (req, res) => { // Endpoint for adding one product
    let products = await productManager.getProducts()
    const product = request.body
})

export default router