import fs from 'fs' // Module for managing files 
import { v4 as uuidv4 } from 'uuid' // Module for generating unique identifiers

class Cart {
    constructor() {
        this.id = uuidv4() // Id is automatically generated and unique
        this.products = []
    }
}

class CartManager { // Class describing the product object which is stored in the ProductManager
    constructor (path) {
      this.path = path
      if (!fs.existsSync(path)) {
        this.#writeFile([])
      }
    }

    #writeFile (carts) {
        fs.writeFileSync(this.path, JSON.stringify(carts))
    }

    async #getCarts() { // Returns the array of products
        const carts = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(carts)
    }

    async addCart () {
        const carts = await this.#getCarts()
        const cart = new Cart()
        carts.push(cart)
        this.#writeFile(carts)
        return cart.id
    }

    async getCartProductsById(id) { // Returns the product (if found) with that id
        const carts = await this.#getCarts()
        const cart = carts.find(item => item.id === id)
        if (cart) return cart.products
        throw new Error ('Cart not found')
    }

    async updateCart({id, productId}) { // Updates one product of the products in the file
        const carts = await this.#getCarts()
        const index = carts.findIndex(item => item.id === id)
        if (index < 0) throw new Error ('Cart not found')
        const productIndex = carts[index].products.findIndex(item => item.id === productId)
        if (productIndex >= 0) {
            const newProduct = {
                id: productId,
                quantity: carts[index].products[productIndex].quantity + 1,
            }
            carts[index].products[productIndex] = newProduct
        } else {
            const newProduct = {
                id: productId,
                quantity: 1
            }
            carts[index].products.push(newProduct)
        }
        this.#writeFile(carts)
        return
    }
}

export {CartManager}
  