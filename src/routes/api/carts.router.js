import { Router } from 'express'
import __dirname from '../../utils.js'
import { CartManager } from '../../dao/mongoose/cartManager.js'
import { join } from 'path'

const cartManager = new CartManager(join(__dirname, '/database/carts.json'))
const router = Router()

router.get('/:cid', async (req, res) => {
  try {
    const products = await cartManager.getCartProductsById(req.params.cid)
    return res.json({ message: 'Cart found', products })
  } catch (err) {
    return res.status(404).json({ message: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const id = await cartManager.addCart()
    const products = await cartManager.getCartProductsById(id)
    return res.json({ message: 'Cart created', cart: { id, products } })
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid } = req.params
    const products = await cartManager.updateCart({ id: cid, productId: req.params.pid })
    return res.json({ message: 'Cart updated', cart: { id: cid, products } })
  } catch (err) {
    return res.status(404).send(err.message)
  }
})

export default router
