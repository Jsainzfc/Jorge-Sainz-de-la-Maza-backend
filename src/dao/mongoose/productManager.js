import { productModel } from '../../models/products.model.js'

class ProductManager {
  async #codeExists (code) { // True if there is already a product in the manager with the same code
    const products = await productModel.find({ code })
    return products.length > 0
  }

  #validateFields ({ code, title, description, price, stock, thumbnails, status }) { // Validates that compulsory fields exist, and the format is correct
    if (!(code && title && description && price && stock)) {
      throw new Error('Not all fields included.')
    }
    if (isNaN(price)) throw new Error('Price must be a number')
    if (isNaN(stock)) throw new Error('Stock must be a number')
    if (status && status !== 'true' && status !== 'false') throw new Error('Status can only be true or false')
    if (thumbnails && !Array.isArray(thumbnails)) throw new Error('Thumbnails should be an array')
    if (this.#codeExists(code)) {
      throw new Error('Code already exists.')
    }
  }

  async addProduct ({ code, title, description, price, stock, thumbnails, status }) { // If correct creates a new Product and adds it to the array
    try {
      this.#validateFields({ code, title, description, price, stock, thumbnails, status })
    } catch (err) {
      throw new Error(`Validation Error: ${err}`)
    }

    const product = await productModel.create({
      code,
      title,
      description,
      price: Number(price),
      stock: Number(stock),
      thumbnails,
      status: Boolean(status)
    })
    return product
  }

  async getProducts () { // Returns the array of products
    try {
      const products = await productModel.find()
      return products
    } catch (err) {
      throw new Error('Cannot get products with mongoose.')
    }
  }

  async getProductById (id) { // Returns the product (if found) with that id
    const product = await productModel.findById(id)
    if (product) return product
    throw new Error('Product not found')
  }

  async updateProduct (id, { code, title, description, price, stock, thumbnails, status }) { // Updates one product of the products in the file
    const product = await productModel.findById(id)
    if (!product) throw new Error('Product not found')
    const newProduct = {
      ...product,
      code: code ?? product.code,
      title: title ?? product.title,
      description: description ?? product.description,
      price: price ?? product.price,
      stock: stock ?? product.stock,
      thumbnails: thumbnails ?? product.thumbnails,
      status: status ?? product.status
    }

    await productModel.replaceOne({ _id: id }, newProduct)
    return newProduct
  }

  async deleteProduct (id) {
    const { deletedCount } = await productModel.deleteOne({ _id: id })
    if (deletedCount !== 1) {
      throw new Error('Product not found')
    }
  }
}

export { ProductManager }
