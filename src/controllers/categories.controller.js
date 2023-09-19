import { ValidationError } from '../errors/index.js'
import { CategoryManager } from '../dao/factory.js'

const categoryManager = new CategoryManager()

const get = async (req, res) => {
  try {
    const categories = await categoryManager.find()
    return res.status(200).json({ message: 'Correct', categories })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const addOne = async (req, res) => {
  const { name, description } = req.body
  try {
    const category = await categoryManager.create({ name, description })
    return res.status(200).json({ message: 'Correct', category })
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ message: err.message })
    }
    return res.status(500).json({ message: err.message })
  }
}

const getById = async (req, res) => {
  const id = req.params.id
  try {
    categoryManager.deleteOne(id)
    return res.status(201).json({ message: 'Category deleted' })
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(404).json({ message: err.message })
    }
    return res.status(500).json({ message: err.message })
  }
}

export { get, addOne, getById }
