class Product { // Objeto que guarda toda la información de los productos del carrito
  constructor (id, code, title, description, price, stock, thumbnail) {
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
  constructor () { //Initializes an empty array of products
    this.products = []
  }

  #lastId = 0

  #codeExists (code) { //
    return this.products.findIndex(product => product.code === code) >= 0
  }

  #getIndex (id) {
    return this.products.findIndex (product => product.id === id)
  }

  addProduct(code, title, description, price, stock, thumbnail) {
    if (this.#codeExists(code)) {
      console.error('Error! Product with the same code already exists, please add a unique code for the new product.')
      return
    }
    const product = new Product(this.#lastId, code, title, description, price, stock, thumbnail)
    this.products.push(product)
    this.#lastId++
  }

  getProducts() {
    return (this.products)
  }
  
  getProductById(id) {
    const index = this.#getIndex(id)
    if (index >= 0) return this.products[index]
    console.error('Error! Product not found.') 
  }
}

const manager = new ProductManager()
console.log(manager.getProducts())
manager.addProduct ('abc123', 'producto prueba', 'Este es un product prueba', 200, 25, 'Sin imagen')
console.log(manager.getProducts())
manager.addProduct ('abc123', 'producto prueba', 'Este es un product prueba', 200, 25, 'Sin imagen')
console.log(manager.getProductById(0))
console.log(manager.getProductById(1))