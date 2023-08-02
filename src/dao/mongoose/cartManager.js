import { cartModel } from '../../models/carts.model.js'
import { productModel } from '../../models/products.model.js'

// Class for managins the cart Model in mongoose
class CartManager {
  async addCart () {
    const cart = await cartModel.create({ products: [] })
    return cart._id
  }

  async #getRealProductsArray ({ products }) {
    const newProducts = []
    for (const product of products) {
      const newProduct = await productModel.findById(product.id).lean()
      if (!newProduct) {
        throw new Error('Product in the cart does not exist in the database')
      }
      newProducts.push({ ...product, title: newProduct.title, price: newProduct.price })
    }
    return newProducts
  }

  async getCartProductsById (id) { // Returns the product (if found) with that id
    const { products } = await cartModel.findById(id).lean()
    if (products) {
      return this.#getRealProductsArray({ products })
    }
    throw new Error('Cart not found')
  }

  async updateCart ({ id, productId }) { // Updates one product of the products in the file
    const { products } = await cartModel.findById(id).lean()
    if (!products) {
      throw new Error('Cart not found')
    }

    const productIndex = products.findIndex(item => item.id === productId)
    if (productIndex >= 0) {
      products[productIndex].quantity = products[productIndex].quantity + 1
    } else {
      products.push({ id: productId, quantity: 1 })
    }
    await cartModel.updateOne({ _id: id }, { products })
    return this.#getRealProductsArray({ products })
  }
}

export { CartManager }
