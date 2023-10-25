import { Router } from 'express'
import { addOne, addProduct, addProducts, deleteOne, getById, removeProduct, updateProduct } from '../../controllers/api.carts.controller.js'

const router = Router()

router.get('/:cid', getById)

router.post('/', addOne)

router.post('/:cid/product/:pid', addProduct)

router.delete('/:cid/product/:pid', removeProduct)

router.put('/:cid', addProducts)

router.put('/:cid/product/:pid', updateProduct)

router.delete('/:cid', deleteOne)

export default router
