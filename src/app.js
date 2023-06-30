import express from 'express'
import { ProductManager } from './productManager.js'
import path  from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()

const productManager = new ProductManager(path.join(__dirname, 'productsForTesting.json'))

app.use(express.urlencoded({extended:true}))
// This line facilitates the server to read and manage long and complex urls.

app.get('/', (req, res) => {
  req.send(`Thanks for using this API. This endpoint is unused.
  You may go to /products to retrieve all of the products present in the database.
  You may use this endpoint also as /products?limit=x being x the maximum amount of products you want to retrieve.
  You can also use /produtcs/:pid being pid the id of the products you want to retrieve.`)
})

app.get('/products', async (req, res) => {
  let products = await productManager.getProducts()
  let {limit} = req.query
  try {
    limit = parseInt(limit)
  } catch {
    res.status(400).send('limit must be a number')
  }
  
  if (limit) {
    products = limit > products.length ? products : products.slice(0, limit-1) 
    // If limit is larger than the amount of items, return all of them
  }
  res.json(products)
})
// Endpoint for retrieving all of the products in the file. It can be limited if included in the url a limit.

app.get('/products/:pid', async (req, res) => {
  let id
  try {
    id = parseInt(req.params.pid)
  } catch {
    res.status(400).send('Id must be a number')
  }
  const product = await productManager.getProductById(id)
  product 
  ? res.json(product) 
  : res.status(404).send('Product not found.')
})
// Endpoint for retrieving the product with id pid.

app.listen(8080, () => console.log("Server up and listening in port 8080"))
// Starting the server