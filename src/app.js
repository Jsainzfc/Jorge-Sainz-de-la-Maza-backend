import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'

const app = express() // Initialize express app

app.use(express.json())
app.use(express.urlencoded({extended:true}))
// This line facilitates the server to read and manage long and complex urls.

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(8080, () => console.log(`Server up and listening in port 8080`))
// Starting the server