import { CartManager } from '../../dao/mongoose/cartManager.js'
import { InvalidField, NotEnoughStock, ValidationError } from '../../errors/index.js'

const cartManager = new CartManager()

const getById = async (req, res) => {
  try {
    const products = await cartManager.findById(req.params.cid)
    return res.json({ message: 'Cart found', products })
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(404).json({ message: err.message })
    }
    return res.status(500).json({ message: err.message })
  }
}

const addOne = async (req, res) => {
  try {
    const id = await cartManager.create()
    return res.json({ message: 'Cart created', cart: { id } })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const addProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const products = await cartManager.updateOne({ id: cid, productId: pid, quantity: 1 })
    req.io.emit('cart_updated', { cid, products })
    return res.json({ message: 'Cart updated', cart: { id: cid, products } })
  } catch (err) {
    if (err instanceof NotEnoughStock) {
      return res.status(400).send({ message: err.message })
    } else if (err instanceof InvalidField) {
      return res.status(404).send({ message: err.message })
    }
    return res.status(500).send({ message: err.message })
  }
}

const removeProduct = async (req, res) => {
  try {
    const newProducts = await cartManager.removeProduct({ cartId: req.params.cid, productId: req.params.pid })
    const newTotal = await cartManager.getTotal({ id: req.params.id })
    return res.status(200).send({ message: 'Cart updated', products: newProducts, total: newTotal })
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(404).send({ message: err.message })
    }
    return res.status(500).send({ message: err.message })
  }
}

const addProducts = async (req, res) => {
  const products = req.body.products ?? []
  if (products.length > 0) {
    try {
      await cartManager.updateCartWithProducts({ cartId: req.params.id, products })
      return res.status(200).send({ message: 'Cart updated.', products })
    } catch (err) {
      return res.status(404).send({ message: err.message })
    }
  } else {
    return res.status(400).send({ message: 'Bad request: endpoint require products to be added in the body of the request.' })
  }
}

const updateProduct = async (req, res) => {
  const quantity = req.body.quantity ?? 1
  if (isNaN(quantity)) {
    return res.status(400).send({ message: 'Incorrect quantity' })
  }
  try {
    const { cid, pid } = req.params
    const products = await cartManager.updateOne({ id: cid, productId: pid, quantity })
    req.io.emit('cart_updated', { cid, products })
    return res.json({ message: 'Cart updated', cart: { id: cid, products } })
  } catch (err) {
    if (err.name === 'NotEnoughStock') {
      return res.status(400).send({ message: err.message })
    }
    return res.status(404).send({ message: err.message })
  }
}

const deleteOne = async (req, res) => {
  try {
    await cartManager.updateCartWithProducts({ cartId: req.params.cid, products: [] })
    return res.status(200).send({ message: 'Carts product removed', products: [] })
  } catch (err) {
    return res.status(404).send({ message: err.message })
  }
}

export { getById, addOne, addProduct, removeProduct, addProducts, updateProduct, deleteOne }
