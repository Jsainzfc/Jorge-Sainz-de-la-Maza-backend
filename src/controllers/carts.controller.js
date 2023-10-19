import { InvalidField, NotEnoughStock, ValidationError } from '../errors/index.js'
import { CartManager, ProductManager } from '../dao/factory.js'

const cartManager = new CartManager()
const productManager = new ProductManager()

const getById = async (req) => {
  let response
  try {
    const products = await cartManager.findById(req.params.cid)
    response = {
      success: true,
      status: 200,
      payload: products,
      error: ''
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      response = {
        success: false,
        status: 404,
        payload: {},
        error: err.message
      }
    }
    response = {
      success: false,
      status: 500,
      payload: {},
      error: err.message
    }
  }
  return response
}

const create = async () => {
  try {
    const id = await cartManager.create()
    return id
  } catch (err) {
    throw new Error('Error creating cart')
  }
}

const addOne = async () => {
  let response
  try {
    const id = await create()
    response = {
      success: true,
      status: 200,
      payload: id,
      error: ''
    }
  } catch (err) {
    response = {
      success: false,
      status: 500,
      payload: '',
      error: err.message
    }
  }
  return response
}

const addProduct = async (req) => {
  let response
  try {
    const { cid, pid } = req.params
    if (req.session.user.role === 'premium') {
      const product = productManager.findById(cid)
      if (product.owner === req.session.user.email) {
        response = {
          success: false,
          status: 401,
          payload: {},
          error: 'Cannot add to cart your own product'
        }
      }
    }
    const products = await cartManager.updateOne({ id: cid, productId: pid, quantity: 1 })
    req.io.emit('cart_updated', { cid, products })
    response = {
      success: true,
      status: 200,
      payload: { id: cid, products },
      error: ''
    }
  } catch (err) {
    if (err instanceof NotEnoughStock) {
      response = {
        success: false,
        status: 400,
        payload: { },
        error: err.message
      }
    } else if (err instanceof InvalidField) {
      response = {
        success: false,
        status: 404,
        payload: { },
        error: err.message
      }
    }
    response = {
      success: false,
      status: 500,
      payload: { },
      error: err.message
    }
  }
  return response
}

const removeProduct = async (req) => {
  let response
  try {
    const newProducts = await cartManager.removeProduct({ cartId: req.params.cid, productId: req.params.pid })
    const newTotal = await cartManager.getTotal({ id: req.params.cid })
    response = {
      success: true,
      status: 200,
      payload: {
        products: newProducts,
        total: newTotal
      },
      error: ''
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      response = {
        success: false,
        status: 404,
        payload: {},
        error: err.message
      }
    }
    response = {
      success: false,
      status: 500,
      payload: {},
      error: err.message
    }
  }
  return response
}

const addProducts = async (req) => {
  let response
  const products = req.body.products ?? []
  if (products.length > 0) {
    try {
      await cartManager.updateCartWithProducts({ cartId: req.params.id, products })
      response = {
        success: true,
        status: 200,
        payload: products,
        error: ''
      }
    } catch (err) {
      response = {
        success: false,
        status: 404,
        payload: [],
        error: err.message
      }
    }
  } else {
    response = {
      success: false,
      status: 400,
      payload: [],
      error: 'Bad request: endpoint require products to be added in the body of the request.'
    }
  }
  return response
}

const updateProduct = async (req) => {
  let response
  const quantity = req.body.quantity ?? 1
  if (isNaN(quantity)) {
    response = {
      success: false,
      status: 400,
      payload: [],
      error: 'Incorrect quantity'
    }
  }
  try {
    const { cid, pid } = req.params
    const products = await cartManager.updateOne({ id: cid, productId: pid, quantity })
    req.io.emit('cart_updated', { cid, products })
    response = {
      success: true,
      status: 200,
      payload: { id: cid, products },
      error: ''
    }
  } catch (err) {
    if (err.name === 'NotEnoughStock') {
      response = {
        success: false,
        status: 400,
        payload: [],
        error: err.message
      }
    }
    response = {
      success: false,
      status: 400,
      payload: [],
      error: err.message
    }
  }
  return response
}

const deleteOne = async (req) => {
  let response
  try {
    await cartManager.updateCartWithProducts({ cartId: req.params.cid, products: [] })
    response = {
      success: true,
      status: 200,
      payload: [],
      error: ''
    }
  } catch (err) {
    response = {
      success: false,
      status: 404,
      payload: [],
      error: err.message
    }
  }
  return response
}

const getTotal = async ({ id }) => {
  return await cartManager.getTotal({ id })
}

export { getById, addOne, addProduct, removeProduct, addProducts, updateProduct, deleteOne, getTotal, create }
