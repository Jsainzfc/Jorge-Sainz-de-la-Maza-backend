import express from 'express'
import { testing, ProductManager } from './productManager.js'

const app = express()

app.get('/', (req, res) => {
  res.send("Testing endpoint.")
})

app.listen(8080, () => console.log("Server up and listening in port 8080"))