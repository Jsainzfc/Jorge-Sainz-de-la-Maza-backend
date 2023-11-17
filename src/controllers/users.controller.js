import { UserManager } from '../dao/factory.js'

const userManager = new UserManager()

const getAll = async () => {
  return await userManager.getAll()
}

const getAllData = async () => {
  const users = await getAll()
  const usersData = users.map(({ firstname, email, role, _id }) => {
    return { firstname, email, role, id: _id }
  })
  return usersData
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

export { getAll, getAllData, getById, getByEmail, create, save, remove, resetPassword, updateLastConnection }
