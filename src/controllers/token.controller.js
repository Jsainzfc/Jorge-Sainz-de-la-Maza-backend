import { TokenManager } from '../dao/factory.js'

const tokenManager = new TokenManager()

const getByUserId = async (userId) => {
  return await tokenManager.getByUserId(userId)
}

const create = async (token) => {
  return await tokenManager.create(token)
}

const deleteOne = async (id) => {
  return await tokenManager.delete(id)
}

export { getByUserId, create, deleteOne }
