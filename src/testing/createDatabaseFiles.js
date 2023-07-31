import { ProductManager } from '../managers/productManager.js'
import fs from 'fs' // Module for managing files
import __dirname from '../utils.js'
import path from 'path'

const createFileForTesting = async () => {
  const description = 'Este es un product prueba'
  const price = 20
  const stock = 25

  if (fs.existsSync(path.join(__dirname, '../database/products.json'))) {
    fs.unlinkSync(path.join(__dirname, '../database/products.json'))
    // file removed
  }
  const manager = new ProductManager(path.join(__dirname, '../database/products.json'))
  for (let i = 0; i < 10; i++) {
    await manager.addProduct({ code: `code_${i}`, title: `title_${i}`, description, price, stock })
  }
}

createFileForTesting()
