import fs from 'fs' // Module for managing files 
import { productModel } from '../models/products.model.js';

class Product { // Class describing the product object which is stored in the ProductManager
  constructor ({code, title, description, price, stock, thumbnails, status}) {
    this.code = code
    this.title = title
    this.description = description
    this.price = price
    this.stock = stock
    this.thumbnails = thumbnails ?? []
    this.status = status ?? true
  }
}

class ProductManager {
  constructor (path) { // Initializes an empty array of products and the filesystem with the path given
    this.path = path
    if (!fs.existsSync(path)) {
      this.#writeFile([])
    }
  }

  #writeFile (products) {
    fs.writeFileSync(this.path, JSON.stringify(products))
  }

  #codeExists (products, code) { // True if there is already a product in the manager with the same code
    return products.findIndex(product => product.code === code) >= 0
  }

  #getIndex (products, id) { // Returns the index in the products array of the product with that id or -1 if not found
    return products.findIndex (product => product.id === id)
  }

  #validateFields ({products, code, title, description, price, stock, thumbnails, status}) { // Validates that compulsory fields exist, and the format is correct
    if (!(code && title && description && price && stock)) {
      throw new Error('Not all fields included.')
    }
    if (isNaN(price)) throw new Error ('Price must be a number')
    if (isNaN(stock)) throw new Error ('Stock must be a number')
    if (status && status !== "true" && status !== "false") throw new Error ('Status can only be true or false')
    if (thumbnails && !Array.isArray(thumbnails)) throw new Error ('Thumbnails should be an array')
    if (this.#codeExists(products, code)) {
      throw new Error('Code already exists.')
    }
  }

  async addProduct({code, title, description, price, stock, thumbnails, status}) { // If correct creates a new Product and adds it to the array
    const products = await this.getProducts()
    try {
      this.#validateFields({products, code, title, description, price, stock, thumbnails, status})
    } catch(err) {
      throw new Error (`Validation Error: ${err}`)
    }

    const product = await productModel.create({
      code, 
      title, 
      description, 
      price: Number(price), 
      stock: Number(stock), 
      thumbnails, 
      status: Boolean(status)
    })
    return product
  }

  async getProducts() { // Returns the array of products
    try {
      const products = await productModel.find()
      return products
    } catch(err) {
      throw new Error ('Cannot get products with mongoose.')
    }
  }
  
  async getProductById(id) { // Returns the product (if found) with that id
    const product = await productModel.findById(id)
    if (product) return product
    throw new Error ('Product not found')
  }

  async updateProduct(id, {code, title, description, price, stock, thumbnails, status}) { // Updates one product of the products in the file
    const product = await productModel.findById(id)
    if (!product) throw new Error ('Product not found')
    const newProduct = {
      ...Product,
      code : code ?? product.code,
      title : title ?? product.title,
      description : description ?? product.description,
      price : price ?? product.price,
      stock : stock ?? product.stock,
      thumbnails : thumbnails ?? product.thumbnails,
      status : status ?? product.status,
    }

    const result = await productModel.replaceOne({_id: id}, newProduct)
    return newProduct
  }

  async deleteProduct(id) {
    const products = await this.getProducts()
    const index = this.#getIndex(products, id)
    if (index < 0) throw new Error ('Product not found')
    products.splice(index, 1)
    this.#writeFile(products)
    return products
  }
}

export {ProductManager}
