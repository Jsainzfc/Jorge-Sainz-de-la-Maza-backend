import mongoose from 'mongoose'

const productCollection = 'products'

const productSchema = new mongoose.Schema({
  title: String,
  code: {
    type: String,
    unique: true
  },
  description: String,
  price: Number,
  status: Boolean,
  thumbnails: [String],
  stock: Number
})

const productModel = mongoose.model(productCollection, productSchema)

export { productModel }
