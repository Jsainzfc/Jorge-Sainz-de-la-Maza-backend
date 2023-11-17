import { Router } from 'express'
import { deleteById, deleteInactive, getUsers, updateToPremium, uploadDocuments } from '../../controllers/api.users.controller.js'
import { uploader } from '../../utils.js'

const router = Router()

router.get('/', getUsers)

router.get('/premium/:uid', updateToPremium)

router.post(
  '/premium/:uid/documents',
  uploader.fields([
    { name: 'profile-picture' },
    { name: 'product-picture' },
    { name: 'identification', maxCount: 1 },
    { name: 'address', maxCount: 1 },
    { name: 'account', maxCount: 1 }
  ]),
  uploadDocuments
)

router.delete('/', deleteInactive)

router.delete('/:id', deleteById)

export default router
