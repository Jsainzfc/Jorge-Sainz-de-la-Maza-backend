import mongoose from 'mongoose'
import { InvalidField, MongooseError, NotAllFields, ItemNotFound, ValidationError } from '../../errors/index.js'
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
  async #validateFields ({ code, title, description, price, stock, thumbnails, status, update }) {
    if (!(code && title && description && price && stock)) {
      throw new NotAllFields('Not all fields included.')
    }
    if (isNaN(price)) throw new InvalidField('Price must be a number')
    if (isNaN(stock)) throw new InvalidField('Stock must be a number')
    if (status && status !== 'true' && status !== 'false') throw new InvalidField('Status can only be true or false')
    if (thumbnails && !Array.isArray(thumbnails)) throw new InvalidField('Thumbnails should be an array')
    if (!update && await this.#codeExists(code)) {
      throw new InvalidField('Code already exists.')
    }
  }

  // Creates a new product in the database.
  // Might throw instances of ValidationError if some value is not valid.
  // Might throw MongooseError if there is any issue reading products for validating code or adding the new product.
  async create ({ code, title, description, price, stock, thumbnails, status, categories }, user) {
    await this.#validateFields({ code, title, description, price, stock, thumbnails, status, update: false })
    try {
      const product = await productModel.create({
        code,
        title,
        description,
        price: Number(price),
        stock: Number(stock),
        thumbnails,
        status: Boolean(status),
        categories: categories ?? [],
        owner: user?.email ?? 'admin'
      })
      return product
    } catch (err) {
      throw new MongooseError('Error adding product to the database')
    }
  }

  #getOptions ({ limit, page, sort }) {
    let options = {
      lean: true,
      limit: limit ?? 10,
      page: page ?? 1
    }
    if (sort) {
      options = {
        ...options,
        sort: { price: sort ? 'asc' : 'desc' }
      }
    }
    return options
  }

  #getQuery ({ queryName, queryValue }) {
    if (!(queryName && queryValue)) {
      return {}
    }

    if (queryName === 'category') {
      return { queryName: queryValue }
    } else if (queryName === 'status') {
      return { queryName: Boolean(queryValue) }
    } else {
      throw new ValidationError('Query only allowed for category or status')
    }
  }

  // Returns an array with the products in the database.
  // Might throw an instance of Mongoose Error if there is any problem reading the products from the database.
  async find ({ limit, page, sort, queryName, queryValue }) {
    try {
      const products = await productModel
        .paginate(
          this.#getQuery({ queryName, queryValue }),
          this.#getOptions({ limit, page, sort }))
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

  // Updates one product of the database
  // Might throw instances of ValidationError if any new field is not correct
  // Might throw instances of MongooseError if there is any error updating the database
  // Might throw instance of ItemNotFound if product is not found in the database
  async updateOne (id, { code, title, description, price, stock, thumbnails, status, categories }, user) {
    const product = await productModel.findById(id)
    if (!product) throw new ItemNotFound('Product not found')

    if (user.role !== 'admin' | 'premium') throw new ValidationError('User not allowed')
    if (user.role === 'premium' && user.email !== product.owner) throw new ValidationError('User not allowed')

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
      status: newProduct.status,
      update: true
    })

    try {
      await productModel.updateOne({ _id: id }, newProduct)
    } catch (err) {
      throw new ItemNotFound(err.message)
    }
  }

  // Deletes one product from the database
  // Might throw instances of MongooseError if there is any error updating the database
  // Might throw instance of ProductNotFound if product is not found in the database
  async deleteOne (id, user) {
    try {
      const product = await productModel.findById(id)
      if (user.role !== 'admin' | 'premium') throw new ValidationError('User not allowed')
      if (user.role === 'premium' && user.email !== product.owner) throw new ValidationError('User not allowed')
      const { deletedCount } = await productModel.deleteOne({ _id: id })
      if (deletedCount !== 1) {
        throw new ItemNotFound('Product not found')
      }
    } catch (err) {
      throw new MongooseError(err.message)
    }
  }
}

export default ProductManager
