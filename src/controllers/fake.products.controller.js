import { faker } from '@faker-js/faker/locale/es'
import ProductDTO from '../dao/DTOs/product.dto.js'

const getFakeArray = (callback, min, max) => {
  const array = []
  for (let i = 0; i < faker.number.int({ min, max }); i++) {
    array.push(callback())
  }
}

const generateProduct = () => {
  const product = new ProductDTO({
    title: faker.commerce.productName(),
    code: faker.commerce.isbn(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    status: faker.datatype.boolean(),
    thumbnails: getFakeArray(faker.image.url, 1, 6),
    stock: faker.number.int({ min: 0, max: 12 }),
    categories: getFakeArray(faker.commerce.product, 1, 2)
  })
  return product
}

const get = (req, res) => {
  const products = []
  try {
    for (let i = 0; i < 100; i++) {
      products.push(generateProduct())
    }
    res.status(200).json({ payload: products, message: '' })
  } catch (err) {
    res.status(500).json({ payload: [], message: err.message })
  }
}

export { get }
