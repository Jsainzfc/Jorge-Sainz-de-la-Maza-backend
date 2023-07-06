import fs from 'fs'
// Module for managing files 

class Product { // Class describing the product object which is stored in the ProductManager
  constructor ({id, code, title, description, price, stock, thumbnail}) {
    this.id = id
    this.code = code
    this.title = title
    this.description = description
    this.price = price
    this.stock = stock
    this.thumbnail = thumbnail
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

  #lastId = 0 // Variable for storing the last available id (increments with every new product)

  #codeExists (products, code) { // True if there is already a product in the manager with the same code
    return products.findIndex(product => product.code === code) >= 0
  }

  #getIndex (products, id) { // Returns the index in the products array of the product with that id or -1 if not found
    return products.findIndex (product => product.id === id)
  }

  async addProduct({code, title, description, price, stock, thumbnail}) { // If correct creates a new Product and adds it to the array

    if (!(code && title && description && price && stock && thumbnail)) {
      console.error('Error! All of the fields must be included to create a new product.')
      return
    }

    const products = await this.getProducts()

    if (this.#codeExists(products, code)) {
      console.error('Error! Product with the same code already exists, please add a unique code for the new product.')
      return
    }

    const product = new Product({id = this.#lastId, code, title, description, price, stock, thumbnail})
    products.push(product)
    this.#writeFile(products)
    this.#lastId++
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

  async updateProduct(id, changes) { // Updates one product of the products in the file
    const products = await this.getProducts()
    const index = this.#getIndex(products, id)
    let product = products[index]
    if (index >= 0) {
      changes.forEach(change => {
        try {
          product = this.#updateProperty(product, change.property, change.value)
        } catch(e) {
          console.error(e)
          return
        }      
      })
      products[index] = product
      this.#writeFile(products)
      return
    }
    console.error('Error! Product not found.') 
  }

  async deleteProduct(id) {
    const products = await this.getProducts()
    const index = this.#getIndex(products, id)   
    if (index >= 0) {
      products.splice(index, 1)
      this.#writeFile(products)
      return
    }
    console.error('Error! Product not found.') 
  }
}

export {ProductManager}
