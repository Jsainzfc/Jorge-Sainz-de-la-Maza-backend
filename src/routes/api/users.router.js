import { Router } from 'express'
import { deleteByEmail, updateToPremium } from '../../controllers/api.users.controller.js'

const router = Router()

// Passport runs github login
router.get('/premium/:uid', updateToPremium)

router.delete('/', deleteByEmail)

export default router
