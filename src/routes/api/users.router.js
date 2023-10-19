import { Router } from 'express'
import { updateToPremium } from '../../controllers/api.users.controller.js'

const router = Router()

// Passport runs github login
router.get('/premium/:uid', updateToPremium)

export default router
