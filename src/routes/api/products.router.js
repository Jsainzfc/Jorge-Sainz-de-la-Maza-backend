import { Router } from 'express'
import { productsService } from '../../repositories/index.js'

const router = Router()

// Endpoint for retrieving all of the products in the database.
// It can be limited if included in the url a limit.
router.get('/', productsService.get)

// Endpoint for retrieving the product with id pid.
router.get('/:pid', productsService.getById)

// Endpoint for adding one product to the database
router.post('/', productsService.addOne)

// Endpoint for updating a product
router.put('/:pid', productsService.updateOne)

// Endpoint for deleting a product
router.delete('/:pid', productsService.deleteOne)

export default router
