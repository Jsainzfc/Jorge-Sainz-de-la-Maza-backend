import { Router } from 'express'
import { get } from '../../controllers/fake.products.controller.js'

const router = Router()

router.get('/', get)

export default router
