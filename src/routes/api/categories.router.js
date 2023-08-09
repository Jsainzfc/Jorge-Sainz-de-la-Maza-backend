import { Router } from 'express'
import { CategoryManager } from '../../dao/mongoose/categoryManager.js'

const categoryManager = new CategoryManager()
const router = Router()

router.get('/', async (req, res) => { // Endpoint for retrieving all of the products in the file. It can be limited if included in the url a limit.
  try {
    const categories = await categoryManager.find()
    console.log(categories)
  } catch (err) {
    console.error(err)
  }
})

export default router
