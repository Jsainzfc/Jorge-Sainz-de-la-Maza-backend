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
  try {
    const { cid, pid } = req.params
    const products = await cartManager.updateCart({ id: cid, productId: pid, quantity: 1 })
    io.emit('cart_updated', { cid, products })
    return res.json({ message: 'Cart updated', cart: { id: cid, products } })
  } catch (err) {
    return res.status(404).send(err.message)
  }
})

router.delete('/:cid/products/:pid', async (req, res) => {
  console.log('Deleted item')
  try {
    const newProducts = await cartManager.removeProduct({ cartId: req.params.cid, productId: req.params.pid })
    const newTotal = await cartManager.getTotal({ id: req.params.id })
    return res.status(200).send({ message: 'Cart updated', products: newProducts, total: newTotal })
  } catch (err) {
    console.log(err)
    return res.status(400).send({ message: err.message })
  }
})

router.put('/:cid', async (req, res) => {
  const products = req.body.products ?? []
  if (products.length > 0) {
    cartManager.updateCartWithProducts({ cartId: req.params.id, products })
  } else {
    return res.status(400).send({ message: 'Bad request: endpoint require products to be added in the body of the request.' })
  }
})

router.put('/:cid/product/:pid', async (req, res) => {
  const quantity = req.body.quantity ?? 1
  if (isNaN(quantity)) {
    return res.status(400).send({ message: 'Incorrect quantity' })
  }
  try {
    const { cid, pid } = req.params
    const products = await cartManager.updateCart({ id: cid, productId: pid, quantity })
    io.emit('cart_updated', { cid, products })
    return res.json({ message: 'Cart updated', cart: { id: cid, products } })
  } catch (err) {
    if (err.name === 'NotEnoughStock') {
      return res.status(400).send({ message: err.message })
    }
    return res.status(404).send({ message: err.message })
  }
})

router.delete('/:cid', async (req, res) => {
  try {
    await cartManager.removeProducts({ cartId: req.params.cid })
    return res.status(200).send({ message: 'Carts product removed', products: [] })
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
})

export default router
