import mongoose from 'mongoose'

const cartCollection = 'carts'

// Each cart model consists of an array of product ids.
const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products'
        },
        quantity: Number
      }
    ],
    default: []
  }
})

// Middlware for running a populate for each product every time we query a find in this schema
cartSchema.pre('find', function () {
  this.populate('products.product')
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export { cartModel }
