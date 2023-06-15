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

  #lastId = 0 // Variable for storing the last available id (increments with every new product)

  #codeExists (code) { // True if there is already a product in the manager with the same code
    return this.products.findIndex(product => product.code === code) >= 0
  }

  #getIndex (id) { // Returns the index in the products array of the product with that id or -1 if not found
    return this.products.findIndex (product => product.id === id)
  }

  addProduct(code, title, description, price, stock, thumbnail) { // If correct creates a new Product and adds it to the array

    if (!(code && title && description && price && stock && thumbnail)) {
      console.error('Error! All of the fields must be included to create a new product.')
      return
    }

    if (this.#codeExists(code)) {
      console.error('Error! Product with the same code already exists, please add a unique code for the new product.')
      return
    }

    const product = new Product(this.#lastId, code, title, description, price, stock, thumbnail)
    this.products.push(product)
    this.#lastId++
  }

  getProducts() { // Returns the array of products
    return (this.products)
  }
  
  getProductById(id) { // Returns the product (if found) with that id
    const index = this.#getIndex(id)
    if (index >= 0) return this.products[index]
    console.error('Error! Product not found.') 
  }
}

const manager = new ProductManager()
console.log(manager.getProducts()) // Expect an empty array
manager.addProduct ('abc123', 'producto prueba', 'Este es un product prueba', 200, 25, 'Sin imagen')
console.log(manager.getProducts()) // Expect an array with one item
manager.addProduct ('abc123', 'producto prueba', 'Este es un product prueba', 200, 25, 'Sin imagen') // Expect a not unique error
console.log(manager.getProductById(0)) // Expect product abc123
console.log(manager.getProductById(1)) // Expect not found error
manager.addProduct('abc123', 'producto prueba', 'Este es un product prueba', 200, 25) // Expect not all fields error