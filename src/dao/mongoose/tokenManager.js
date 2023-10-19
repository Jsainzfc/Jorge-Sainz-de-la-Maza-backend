import tokenModel from '../../models/token.model.js'

class TokenManager {
  async getByUserId (userId) {
    return await tokenModel.findOne({ userId })
  }

  async create (token) {
    return await tokenModel.create(token)
  }

  async delete (id) {
    const existing = await tokenModel.findById(id)

    if (!existing) {
      return
    }

    await tokenModel.deleteOne({ _id: id })
  }
}

export default TokenManager
