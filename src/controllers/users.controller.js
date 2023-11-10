import { UserManager } from '../dao/factory.js'

const userManager = new UserManager()

const getAll = async () => {
  return await userManager.getAll()
}

const getById = async (id) => {
  return await userManager.getById()
}

const getByEmail = async (email) => {
  return await userManager.getByEmail(email)
}

const create = async (user) => {
  return await userManager.create(user)
}

const save = async (id, user) => {
  return await userManager.save(id, user)
}

const remove = async (id) => {
  await userManager.delete(id)
}

const resetPassword = async (id, password) => {
  return await userManager.resetPassword(id, password)
}

const updateLastConnection = async (id) => {
  await userManager.updateLastConnection(id)
}

export { getAll, getById, getByEmail, create, save, remove, resetPassword, updateLastConnection }
