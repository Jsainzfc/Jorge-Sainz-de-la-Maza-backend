import {Router} from 'express'
import { ProductManager } from '../managers/productManager.js'
import path  from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productManager = new ProductManager(path.join(__dirname, 'productsForTesting.json'))

const router = Router()

router.get('/', async (req, res) => { // Endpoint for retrieving all of the products in the file. It can be limited if included in the url a limit.
    let products = await productManager.getProducts()

    if (Number.isNaN(req.query.limit)) return res.status(400).send('Limit must be a number')
    const limit = Number(req.query.limit)
    if (products.length === 0) return res.status(204) // There are no products
    return res.json(limit > products.length ? products : products.slice(0, limit-1) )
})
  
router.get('/:pid', async (req, res) => { // Endpoint for retrieving the product with id pid.
    if (Number.isNaN(req.query.id)) return res.status(400).send('id must be a number')
    const id = Number(req.query.id)
    try {
        const product = await productManager.getProductById(id)
        return res.json(product) 
    } catch (err) {
        return res.status(404).send(err)
    }
})

router.post('/', async (req, res) => { // Endpoint for adding one product
    let products = await productManager.getProducts()
    const product = request.body
})

export default router