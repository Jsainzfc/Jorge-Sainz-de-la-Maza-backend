import { cartModel } from '../../models/carts.model.js'
import { productModel } from '../../models/products.model.js'
import { NotEnoughStock } from '../../errors/index.js'

// Class for managins the cart Model in mongoose
class CartManager {
  async addCart () {
    const cart = await cartModel.create({ products: [] })
    return cart._id
  }

  async getCartProductsById (id) { // Returns the product (if found) with that id
    const { products } = await cartModel.findById(id).lean().populate('products.product')
    if (products) {
      return products
    }
    throw new Error('Cart not found')
  }

  async updateCart ({ id, productId, quantity }) { // Updates one product of the products in the file
    let data
    try {
      data = await cartModel.findById(id).populate('products.product')
    } catch (err) {
      throw new Error('Cart not found')
    }
    const { products } = data
    const productIndex = products.findIndex(item => item.product._id.toString() === productId)
    if (productIndex >= 0) {
      const newAmount = products[productIndex].quantity + quantity
      if (newAmount > products[productIndex].product.stock) {
        throw new NotEnoughStock('Insufficient stock')
      }
    } else {
      const { stock } = productModel.findById(productId)
      if (quantity > stock) {
        throw new NotEnoughStock('Insufficient stock')
      }
      products.push({ product: productId, quantity })
    }
    await cartModel.updateOne({ _id: id }, { products })
    return await cartModel.findById(id).lean()
  }

  async getTotal ({ id }) {
    let data
    try {
      data = await cartModel.findById(id).populate('products.product')
    } catch (err) {
      throw new Error('Cart not found')
    }
    const { products } = data
    return products.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0)
  }
}

export { CartManager }
