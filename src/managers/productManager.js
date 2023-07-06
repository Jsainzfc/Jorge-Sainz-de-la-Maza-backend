import fs from 'fs' // Module for managing files 
import { v4 as uuidv4 } from 'uuid' // Module for generating unique identifiers

class Product { // Class describing the product object which is stored in the ProductManager
  constructor ({code, title, description, price, stock, thumbnails, status}) {
    this.id = uuidv4() // Id is automatically generated and unique
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

  async addProduct({code, title, description, price, stock, thumbnails, status}) { // If correct creates a new Product and adds it to the array

    if (!(code && title && description && price && stock)) {
      throw new Error('Not all fields included.')
    }

    const products = await this.getProducts()

    if (this.#codeExists(products, code)) {
      throw new Error('Code already exists.')
    }

    const product = new Product({code, title, description, price, stock, thumbnails, status})
    products.push(product)
    this.#writeFile(products)
  }

  async getProducts() { // Returns the array of products
    const products = await fs.promises.readFile(this.path, 'utf-8')
    return JSON.parse(products)
  }
  
  async getProductById(id) { // Returns the product (if found) with that id
    const products = await this.getProducts()
    const product = products.find(item => item.id === id)
    if (product) return product
    throw new Error ('Product not found')
  }

  #updateProperty(product, field, fieldValue) { // Updates one product of the products in the file.
    if (product.hasOwnProperty(field)) {
      if (field === 'id') {
        throw new Error('Id cannot be modified.')
      }
      product[field] = fieldValue
      return product
    }
    throw new Error(`Field ${field} does not exist in product.`)
  }

  async updateProduct(id, {code, title, description, price, stock, thumbnails, status}) { // Updates one product of the products in the file
    const products = await this.getProducts()
    let product = products.find(item => item.id === id)
    if (!product) throw new Error ('Product not found')
    product = {
      id : product.id, // Id cannot be modified or removed
      code : code ?? product.code,
      title : title ?? product.title,
      description : description ?? product.description,
      price : price ?? product.price,
      stock : stock ?? product.stock,
      thumbnails : thumbnails ?? product.thumbnails,
      status : status ?? product.status,
    }
    const index = this.#getIndex (products, id)
    products[index] = product
    this.#writeFile(products)
    return
  }

  async deleteProduct(id) {
    const products = await this.getProducts()
    const index = this.#getIndex(products, id)
    if (index < 0) throw new Error ('Product not found')
    products.splice(index, 1)
    this.#writeFile(products)
    return
  }
}

export {ProductManager}
