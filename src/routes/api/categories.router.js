import { Router } from 'express'
import { CategoryManager } from '../../dao/mongoose/categoryManager.js'
import { ValidationError } from '../../errors/index.js'

const categoryManager = new CategoryManager()
const router = Router()

router.get('/', async (req, res) => {
  try {
    const categories = await categoryManager.find()
    return res.status(200).json({ message: 'Correct', categories })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

router.post('/', async (req, res) => {
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
})

router.delete('/:id', async (req, res) => {
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
})

export default router
