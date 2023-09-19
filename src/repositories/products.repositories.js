import { get, getById, addOne, updateOne, deleteOne } from '../controllers/products.controller.js'

export default class ProductRepository {
  constructor (dao) {
    this.dao = dao
  }

  get = async (req, res) => {
    const { queryName, queryValue, limit, page, order, user } = req.query
    const response = await get({ queryName, queryValue, limit, page, order, user, baseUrl: '' })
    return res.status(response.status).json(response)
  }

  getById = async (req, res) => {
    const response = await getById(req)
    return res.status(response.status).json(response)
  }

  addOne = async (req, res) => {
    const response = await addOne(req)
    return res.status(response.status).json(response)
  }

  updateOne = async (req, res) => {
    const response = await updateOne(req)
    return res.status(response.status).json(response)
  }

  deleteOne = async (req, res) => {
    const response = await deleteOne(req)
    return res.status(response.status).json(response)
  }
}
