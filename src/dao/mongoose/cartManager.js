import { cartModel } from '../../models/carts.model.js'

class CartManager { // Class describing the product object which is stored in the ProductManager
    constructor () {}

    async addCart () {
        const cart = await cartModel.create({products: []})
        return cart._id
    }

    async getCartProductsById(id) { // Returns the product (if found) with that id
        const {products} = await cartModel.findById(id)
        if (products) {
            return products
        }
        throw new Error ('Cart not found')
    }

    async updateCart({id, productId}) { // Updates one product of the products in the file
        const {products} = await cartModel.findById(id)
        if (!products) {
            throw new Error ('Cart not found')
        }

        const productIndex = products.findIndex(item => item.id === productId)
        if (productIndex >= 0) {
            products[productIndex].quantity = products[productIndex].quantity + 1
        } else {
            products.push({id: productId, quantity: 1})
        }
        const result = await productModel.updateOne({_id: id}, {products})
        return products
    }
}

export {CartManager}
  