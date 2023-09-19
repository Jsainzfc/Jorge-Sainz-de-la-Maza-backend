import { UserManager } from '../dao/factory.js'

const userManager = new UserManager()

const getAll = async () => {
  return userManager.getAll()
}

const getById = async (id) => {
  return userManager.getById()
}

const getByEmail = async (email) => {
  return userManager.getByEmail(email)
}

const create = async (user) => {
  return userManager.create(user)
}

const save = async (id, user) => {
  return userManager.save(id, user)
}

const remove = async (id) => {
  userManager.delete(id)
}

export { getAll, getById, getByEmail, create, save, remove }
