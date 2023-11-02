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

    const newUser = {
      firstname: user.firstname ?? existing.firstname,
      lastname: user.lastname ?? existing.lastname,
      email: user.email ?? existing.email,
      password: user.password ?? existing.password,
      role: user.role ?? existing.role,
      age: user.age ?? existing.age,
      cart: user.cart ?? existing.cart
    }

    await userModel.updateOne({ _id: id }, newUser)
  }

  async delete (id) {
    const existing = await this.getById(id)

    if (!existing) {
      return
    }

    /// operadores

    await userModel.deleteOne({ _id: id })
  }

  async deleteByEmail (email) {
    try {
      await userModel.deleteOne({ email })
    } catch (err) {
      throw new Error('Something went wrong')
    }
  }

  async resetPassword (id, password) {
    const user = await this.getById(id)
    if (!user) throw new ValidationError('User not found')
    user.password = password
    await userModel.updateOne({ _id: id }, user)
  }
}

export default UserManager
