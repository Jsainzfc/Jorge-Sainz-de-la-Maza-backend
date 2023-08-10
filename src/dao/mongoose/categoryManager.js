import { categoryModel } from '../../models/categories.model.js'
import { InvalidField, ItemNotFound, MongooseError } from '../../errors/index.js'

class CategoryManager {
  // Returns all of the categories in the database
  // Might throw an instance of MongooseError if there is any problem accessing the database
  async find () {
    try {
      const categories = await categoryModel.find().lean()
      return categories
    } catch (err) {
      throw new MongooseError('Error getting categories from database')
    }
  }

  #validateFields ({ name }) {
    if (name.length === 0) {
      throw new InvalidField('Name cannot be empty')
    }
  }

  // Creates a new category in the database.
  // Might throw instances of ValidationError if name is empty.
  // Might throw MongooseError if there is any issue creating the document.
  async create ({ name, description }) {
    this.#validateFields({ name })
    try {
      const category = await categoryModel.create({ name, description })
      return category
    } catch (err) {
      throw new MongooseError('Error creating the category')
    }
  }

  // Deletes one category from the database
  // Might throw instances of MongooseError if there is any error updating the database
  // Might throw instance of ItemNotFound if product is not found in the database
  async deleteOne (id) {
    try {
      const { deletedCount } = await categoryModel.deleteOne({ _id: id })
      if (deletedCount !== 1) {
        throw new ItemNotFound('Product not found')
      }
    } catch (err) {
      throw new MongooseError(err.message)
    }
  }
}

export { CategoryManager }
