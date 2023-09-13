import { Router } from 'express'
import { addOne, get, getById } from '../../controllers/categories.controller'

const router = Router()

router.get('/', get)

router.post('/', addOne)

router.delete('/:id', getById)

export default router
