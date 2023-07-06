import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'

const app = express() // Initialize express app

app.use(express.json())
app.use(express.urlencoded({extended:true}))
// This line facilitates the server to read and manage long and complex urls.

app.get('/', (req, res) => {
  res.send(`Thanks for using this API. This endpoint is unused.
  You may go to /products to retrieve all of the products present in the database.
  You may use this endpoint also as /products?limit=x being x the maximum amount of products you want to retrieve.
  You can also use /produtcs/:pid being pid the id of the products you want to retrieve.`)
})

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(8080, () => console.log(`Server up and listening in port 8080`))
// Starting the server