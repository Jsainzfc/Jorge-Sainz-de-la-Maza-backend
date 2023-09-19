import { cartModel } from '../../models/carts.model.js'
import { productModel } from '../../models/products.model.js'
import { InvalidField, MongooseError, NotEnoughStock } from '../../errors/index.js'

// Class for managing the cart Model in mongoose
class CartManager {
  // Creates a new empty cart in the database
  // Might throw an instance of MongooseError if there is any problem creating the document in the database
  async create () {
    try {
      const cart = await cartModel.create({ products: [] })
      return cart._id
    } catch (err) {
      throw new MongooseError(err.message)
    }
  }

  #getProductIndex ({ products, productId }) {
    return products.findIndex(item => item.product._id.toString() === productId)
  }

  // Returns the products in the cart with id (if found) populated from the table products
  // Might throw an instance of ValidationError if id is not found
  // Might throw an instance of Mongoose Error if there is any problem calling mongoose
  async findById (id) {
    try {
      const { products } = await cartModel.findById(id).lean().populate('products.product')
      if (products) {
        return products
      } else {
        throw InvalidField('Cart not found.')
      }
    } catch (err) {
      throw new MongooseError(err.message)
    }
  }

  // Updates product with id productId in the cart with id and adding quantity
  // Might throw an instance of ValidationError if id is not found in the database
  // Might throw an instance of ValidationError if final quantity is larger than stock
  // Might throw an instance of MongooseError if there is any problem accessing the database
  async updateOne ({ id, productId, quantity }) {
    const products = await this.findById(id)
    const productIndex = this.#getProductIndex({ products, productId })
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
    return await this.findById(id)
  }

  // Return the total amount of the cart
  // Might throw an instance of ValidationError if cart is not found
  // Might throw an instance of MongooseError if there is any problem accessing the database
  async getTotal ({ id }) {
    const products = await this.findById(id)
    if (products.length === 0) {
      return 0
    } else {
      return products.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0)
    }
  }

  // Removes a product with id = productId if found from cart with id
  // Might throw an instance of ValidationError if either cart of product are not found
  // Might throw an instance of MongooseError if there is any problem accessing the database
  async removeProduct ({ cartId, productId }) {
    const products = await this.findById(cartId)
    const index = this.#getProductIndex({ products, productId })
    if (index >= 0) {
      products.splice(index, 1)
      try {
        await cartModel.updateOne({ _id: cartId }, { products })
        return products
      } catch (err) {
        throw new MongooseError(err.message)
      }
    } else {
      throw new InvalidField('Product not found in cart')
    }
  }

  // Updates the products of a cart with the one received
  // Might throw an instance of ValidationError if cart is not found
  async updateCartWithProducts ({ cartId, products }) {
    try {
      await cartModel.updateOne({ _id: cartId }, { products })
    } catch (err) {
      throw new InvalidField('Cart not found')
    }
  }
}

export default CartManager
