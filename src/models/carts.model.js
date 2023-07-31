import mongoose from "mongoose";

const cartCollection = 'carts'

// Each cart model consists of an array of product ids.
const cartSchema = new mongoose.Schema({
  products: [{id: String, quantity: Number}],
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export {cartModel}