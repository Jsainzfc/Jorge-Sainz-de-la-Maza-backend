import { ValidationError } from '../../errors/index.js'
import { userModel } from '../../models/users.model.js'

class UserManager {
  async getAll () {
    return await userModel.find({}).lean()
  }

  async getById (id) {
    return await userModel.findById(id).lean()
  }

  async getByEmail (email) {
    return await userModel.findOne({ email }).lean()
  }

  async create (user) {
    return await userModel.create(user)
  }

  async save (id, user) {
    const existing = await this.getById(id)

    if (!existing) {
      return
    }

    const {
      email,
      firstname,
      lastname,
      age
    } = user

    existing.email = email
    existing.firstname = firstname
    existing.lastname = lastname
    existing.age = age

    await existing.updateOne({ _id: id }, existing)
  }

  async delete (id) {
    const existing = await this.getById(id)

    if (!existing) {
      return
    }

    /// operadores

    await userModel.deleteOne({ _id: id })
  }

  async resetPassword (id, password) {
    const user = await this.getById(id)
    if (!user) throw new ValidationError('User not found')
    user.password = password
    await userModel.updateOne({ _id: id }, user)
  }
}

export default UserManager
