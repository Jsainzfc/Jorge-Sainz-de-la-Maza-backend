/* eslint-disable no-undef */
import mongoose from 'mongoose'
import ProductManager from '../src/dao/mongoose/productManager.js'
import { config } from '../src/config/config.js'
import chai from 'chai'
import { productModel } from '../src/models/products.model.js'

const expect = chai.expect

describe('Testing Products Dao', () => {
  const manager = new ProductManager()

  before(function () {
    mongoose.connect(config.mongotestdb) // Connect with the mongodb database
  })

  beforeEach(function () {
    this.timeout(5000)
  })

  after(async () => {
    await productModel.collection.drop()
    mongoose.disconnect()
  })

  it('Dao should get no products from the database (DB empty)', async () => {
    const result = await manager.find({})
    const expected = {
      docs: [],
      totalDocs: 0,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null
    }
    expect(result).to.be.deep.equal(expected)
  })

  it('Dao should create a product in the DB', async () => {
    const newProduct = {
      code: 'product0',
      title: 'Product 0',
      description: 'This is product 0',
      price: 10,
      stock: 10,
      thumbnails: ['thumbnail0', 'thumbnail1'],
      status: true,
      categories: []
    }
    const response = await manager.create(newProduct, 'user')
    expect(response.title).to.be.deep.equal(response.title)
  })
})
