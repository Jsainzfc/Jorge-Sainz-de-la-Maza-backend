import mongoose from 'mongoose'

const categoryCollection = 'categories'

// Each cart model consists of an array of product ids.
const categorySchema = new mongoose.Schema({
  name: String,
  description: String
})

// Middlware for running a populate for each product every time we query a find in this schema
categorySchema.pre('find', function () {
  this.populate('products.product')
})

const categoryModel = mongoose.model(categoryCollection, categorySchema)

export { categoryModel }
