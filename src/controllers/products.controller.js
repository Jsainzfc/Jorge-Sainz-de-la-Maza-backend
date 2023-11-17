import { ItemNotFound, ValidationError } from '../errors/index.js'
import { ProductManager, UserManager } from '../dao/factory.js'
import { transport } from '../utils.js'

const productManager = new ProductManager()
const userManager = new UserManager()

const getPageLink = ({ baseURL, queryName, queryValue, limit, order, page }) => {
  let finalURL = baseURL + '?'
  if (queryName) {
    finalURL = finalURL + `queryName=${queryName}&`
  }
  if (queryValue) {
    finalURL = finalURL + `queryValue=${queryValue}&`
  }
  if (limit) {
    finalURL = finalURL + `limit=${limit}&`
  }
  if (order) {
    finalURL = finalURL + `order=${order}&`
  }
  if (page) {
    finalURL = finalURL + `page=${page}`
  }
  return finalURL
}

const get = async ({ queryName, queryValue, limit, page, order, user, baseURL }) => {
  let response
  try {
    const products = await productManager.find({ queryName, queryValue, limit, page, order })
    const prevLink = products.hasPrevPage
      ? `${getPageLink({ queryName, queryValue, limit, order, page: products.prevPage, baseURL })}`
      : ''
    const nextLink = products.hasNextPage
      ? `${getPageLink({ queryName, queryValue, limit, order, page: products.nextPage, baseURL })}`
      : ''

    response = {
      success: true,
      status: 200,
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink,
      nextLink,
      user,
      error: ''
    }
  } catch (err) {
    response = {
      success: false,
      status: 500,
      payload: [],
      error: err.message
    }
  }
  return response
}

const getById = async (req) => {
  let response
  try {
    const product = await productManager.findById(req.params.pid)
    if (product) {
      response = {
        success: true,
        status: 200,
        payload: product,
        error: ''
      }
    } else {
      response = {
        success: false,
        status: 404,
        payload: {}
      }
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      response = {
        success: false,
        status: 400,
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

const addOne = async (req) => {
  let response
  const { product, user } = req.body
  try {
    const newProduct = await productManager.create(product, user)
    req.io.emit('new_product', newProduct)
    response = {
      success: true,
      status: 200,
      payload: newProduct,
      error: ''
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      response = {
        success: false,
        status: 400,
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

const updateOne = async (req) => {
  let response
  const product = req.body.product
  try {
    const user = await userManager.getByEmail(req.body.user)
    await productManager.updateOne(req.params.pid, product, user)
    req.io.emit('product_updated', { id: req.params.pid, product })
    response = {
      success: true,
      status: 200,
      payload: {},
      error: ''
    }
  } catch (err) {
    req.logger.error(err.message)
    if (err instanceof ItemNotFound) {
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

const deleteOne = async (req) => {
  let response
  try {
    const user = await userManager.getByEmail(req.body.user)
    const owner = await productManager.deleteOne(req.params.pid, user)
    const userOwner = await userManager.getByEmail(owner)
    if (userOwner.role === 'premium') {
      try {
        await transport.sendMail({
          from: 'Jorge Sainz <jsainzfc@gmail.com>',
          to: `${userOwner}`,
          subject: 'Product removed',
          html: `
            <div>
              <p>Your product with id ${req.params.pid} has been removed by ${req.body.user}</p>
            </div>
          `,
          attachments: []
        })
      } catch (err) {
        req.logger.error(err.message)
        req.logger.error('Error sending deletion email')
      }
    }
    req.io.emit('product_deleted', req.params.pid)
    response = {
      success: true,
      status: 204,
      payload: {},
      error: ''
    }
  } catch (err) {
    if (err instanceof ItemNotFound) {
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

const getStock = async (id) => {
  let response
  const product = await productManager.findById(id)
  if (product) {
    response = {
      success: true,
      status: 204,
      payload: product.stock,
      error: ''
    }
  } else {
    response = {
      success: false,
      status: 500,
      payload: {},
      error: 'Error'
    }
  }
  return response
}

export { get, getById, addOne, updateOne, deleteOne, getStock }
