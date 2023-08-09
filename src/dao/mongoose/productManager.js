import mongoose from 'mongoose'
import { InvalidField, MongooseError, NotAllFields, ProductNotFound } from '../../errors/index.js'
import { productModel } from '../../models/products.model.js'

class ProductManager {
  // Returns true if code exists in the database already.
  // Might throw MongooseError if there is any issue reading products for validating code
  async #codeExists (code) {
    try {
      const products = await productModel.find({ code })
      return (products.length > 0)
    } catch (err) {
      throw new MongooseError('Error getting products with Mongoose')
    }
  }

  // Validate that all compulsory fields are correct and code is not existing already.
  // Throws instances of ValidationError if some problem is detected.
  // Might throw MongooseError if there is any issue reading products for validating code
  async #validateFields ({ code, title, description, price, stock, thumbnails, status }) {
    if (!(code && title && description && price && stock)) {
      throw new NotAllFields('Not all fields included.')
    }
    if (isNaN(price)) throw new InvalidField('Price must be a number')
    if (isNaN(stock)) throw new InvalidField('Stock must be a number')
    if (status && status !== 'true' && status !== 'false') throw new InvalidField('Status can only be true or false')
    if (thumbnails && !Array.isArray(thumbnails)) throw new InvalidField('Thumbnails should be an array')
    if (await this.#codeExists(code)) {
      throw new InvalidField('Code already exists.')
    }
  }

  // Creates a new product in the database.
  // Might throw instances of ValidationError if some problem is detected.
  // Might throw MongooseError if there is any issue reading products for validating code or adding the new product.
  async create ({ code, title, description, price, stock, thumbnails, status, categories }) {
    await this.#validateFields({ code, title, description, price, stock, thumbnails, status })
    try {
      const product = await productModel.create({
        code,
        title,
        description,
        price: Number(price),
        stock: Number(stock),
        thumbnails,
        status: Boolean(status),
        categories: categories ?? []
      })
      return product
    } catch (err) {
      throw new MongooseError('Error adding product to the database')
    }
  }

  // Returns an array with the products in the database.
  // Might throw an instance of Mongoose Error if there is any problem reading the products from the database.
  async find () {
    try {
      const products = await productModel.find().lean()
      return products
    } catch (err) {
      throw new MongooseError('Error getting products with Mongoose')
    }
  }

  // Returns the product in the database that matches id if exists or null if doesn't.
  // Might throw an instance of MongooseError if there is any problem reading the products from the database.
  // Might throw an instance of ValidationError if id is not valid
  async findById (id) {
    try {
      const product = await productModel.findById(id).lean()
      return product
    } catch (err) {
      if (err instanceof mongoose.Error.CastError) {
        throw new InvalidField(err.message)
      }
      throw new MongooseError('Error getting products with Mongoose')
    }
  }

  // Updates one product of the products in the file
  // Might throw instances of ValidationError if any new field is not correct
  // Might throw instances of MongooseError if there is any error updating the database
  // Might throw instance of ProductNotFound if product is not found in the database
  async updateOne (id, { code, title, description, price, stock, thumbnails, status, categories }) {
    const product = await productModel.findById(id)
    if (!product) throw new ProductNotFound('Product not found')

    const newProduct = {
      code: code ?? product.code,
      title: title ?? product.title,
      description: description ?? product.description,
      price: price ?? product.price,
      stock: stock ?? product.stock,
      thumbnails: thumbnails ?? product.thumbnails,
      status: status ?? product.status,
      categories: categories ?? product.categories
    }

    await this.#validateFields({
      code: newProduct.code,
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price,
      stock: newProduct.stock,
      thumbnails: newProduct.thumbnails,
      status: newProduct.status
    })

    try {
      await productModel.updateOne({ _id: id }, newProduct)
    } catch (err) {
      throw new ProductNotFound(err.message)
    }
  }

  // Updates one product of the products in the file
  // Might throw instances of MongooseError if there is any error updating the database
  // Might throw instance of ProductNotFound if product is not found in the database
  async deleteOne (id) {
    try {
      const { deletedCount } = await productModel.deleteOne({ _id: id })
      if (deletedCount !== 1) {
        throw new ProductNotFound('Product not found')
      }
    } catch (err) {
      throw new MongooseError(err.message)
    }
  }
}

export { ProductManager }
