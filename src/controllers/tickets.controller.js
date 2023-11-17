import { TicketManager, ProductManager, CartManager } from '../dao/factory.js'
import { getById as getCartById } from './carts.controller.js'
import { getStock } from './products.controller.js'

import { v4 } from 'uuid' // Module for generating unique identifiers

const productManager = new ProductManager()
const cartManager = new CartManager()
const ticketManager = new TicketManager()

const getTotal = ({ products }) => {
  return products.reduce((acc, curr) => acc + (curr.amount * curr.price), 0)
}

const create = async (req) => {
  let response
  try {
    response = await getCartById(req)
    if (response.success) {
      const products = response.payload
      const finalProducts = []
      for (let i = 0; i < products.length; i++) {
        const item = products[i]
        response = await getStock(item.product._id)
        if (response.success) {
          const amount = response.payload < item.quantity ? response.payload : item.quantity
          finalProducts.push({
            id: item.product._id,
            amount,
            price: item.product.price
          })
          if (item.quantity - amount === 0) {
            products.splice(i, 1)
          }
          const updatedProduct = { ...item.product, stock: item.product.stock - item.quantity }
          await productManager.updateOne(item.product._id, updatedProduct, { role: 'admin' }) // We fake an update from an admin user as this is only updating because of a buy
        }
      }
      console.log(finalProducts)
      if (finalProducts.length === 0) {
        response = {
          success: false,
          status: 400,
          payload: {},
          error: 'Not enough stock'
        }
      }
      cartManager.updateCartWithProducts({ cartId: req.params.cid, products })
      const ticket = {
        code: v4(),
        createdAt: Date(),
        purchaser: req.session.user.email,
        amount: getTotal({ products: finalProducts })
      }
      const id = await ticketManager.create({ ticket })
      response = {
        success: true,
        status: 200,
        payload: { id, ticket },
        error: ''
      }
    }
  } catch (err) {
    req.logger.error(err.message)
    response = {
      success: false,
      status: 500,
      payload: {},
      error: 'Something went wrong'
    }
  }
  return response
}

export { create }
