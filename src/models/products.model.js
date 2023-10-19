import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products'

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true
  },
  code: {
    type: String,
    unique: true
  },
  description: String,
  price: Number,
  status: Boolean,
  thumbnails: [String],
  stock: Number,
  categories: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
      }],
    default: []
  },
  owner: String
})

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productCollection, productSchema)

export { productModel }
