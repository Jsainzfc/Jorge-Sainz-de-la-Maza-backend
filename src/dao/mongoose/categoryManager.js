import { categoryModel } from '../../models/categories.model.js'
import { MongooseError } from '../../errors/index.js'

class CategoryManager {
  async find () {
    try {
      const categories = await categoryModel.find().lean()
      return categories
    } catch (err) {
      throw new MongooseError('Error getting categories from database')
    }
  }
}

export { CategoryManager }
