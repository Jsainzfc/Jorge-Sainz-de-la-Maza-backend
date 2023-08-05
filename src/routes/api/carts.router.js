import { Router } from 'express'
import { CartManager } from '../../dao/mongoose/cartManager.js'
import io from '../../app.js'

const cartManager = new CartManager()
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
  const quantity = req.body.quantity ?? 1
  if (isNaN(quantity)) {
    return res.status(400).send({message: 'Incorrect quantity'})
  }
  try {
    const { cid, pid } = req.params
    const products = await cartManager.updateCart({ id: cid, productId: pid, quantity })
    io.emit('cart_updated', { cid, products })
    return res.json({ message: 'Cart updated', cart: { id: cid, products } })
  } catch (err) {
    if (err.name === 'NotEnoughStock') {
      return res.status(400).send({message: err.message})
    }
    return res.status(404).send({message: err.message})
  }
})

export default router
