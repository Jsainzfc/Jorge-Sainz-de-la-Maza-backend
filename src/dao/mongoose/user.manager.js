import { userModel } from '../../models/users.model.js'

class UserManager {
  async getAll () {
    return userModel.find({}).lean()
  }

  getById (id) {
    return userModel.findById(id).lean()
  }

  getByEmail (email) {
    return userModel.findOne({ email }).lean()
  }

  create (user) {
    return userModel.create(user)
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
}

export { UserManager }
