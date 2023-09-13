import { Router } from 'express'
import { addOne, deleteOne, get, getById, updateOne } from '../../controllers/products.controller.js'

const router = Router()

// Endpoint for retrieving all of the products in the database.
// It can be limited if included in the url a limit.
router.get('/', get)

// Endpoint for retrieving the product with id pid.
router.get('/:pid', getById)

// Endpoint for adding one product to the database
router.post('/', addOne)

// Endpoint for updating a product
router.put('/:pid', updateOne)

// Endpoint for deleting a product
router.delete('/:pid', deleteOne)

export default router
