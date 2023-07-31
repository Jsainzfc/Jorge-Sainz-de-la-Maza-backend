import { ProductManager } from '../managers/productManager.js'
import fs from 'fs' // Module for managing files
import __dirname from '../utils.js'
import path from 'path'

let id
let manager

const initializeTests = () => {
  if (fs.existsSync(path.join(__dirname, 'products.json'))) {
    fs.unlinkSync(path.join(__dirname, 'products.json'))
    // file removed
  }
  manager = new ProductManager(path.join(__dirname, 'products.json'))
}

const test1 = async () => {
  const products = await manager.getProducts()
  console.log('Test 1: Expect an empty array => ', products)
}

const test2 = async () => {
  const product = {
    code: 'abc123',
    title: 'producto prueba',
    description: 'Este es un product prueba',
    price: 20,
    stock: 25
  }
  const products = await manager.addProduct(product)
  console.log('Test 2: Expect an array with only one item => ', products)
  id = products[0].id
}

const test3 = async () => {
  try {
    await manager.addProduct({ code, title, description, price, stock })
  } catch (err) {
    console.log('Test 3: Expect a validation error (code not unique):')
    console.error(err)
  }
}

const test4 = async () => {
  const product = await manager.getProductById(id)
  console.log('Test 4: Expect product abc123 => ', product)
}

const test5 = async () => {
  try {
    await manager.getProductById(1)
  } catch (err) {
    console.log('Test 5: Expect not found error:')
    console.error(err)
  }
}

const test6 = async () => {
  try {
    await manager.addProduct({ code, title, description, price })
  } catch (err) {
    console.log('Test 6: Expect a validation error (not all fields found):')
    console.error(err)
  }
}

const test7 = async () => {
  const product = await manager.updateProduct(id, { code: 'newCode' })
  console.log('Test 7: Expect product with code changed:', product)
}

const test8 = async () => {
  try {
    const product = await manager.updateProduct(1, { code: 'newCode' })
  } catch (err) {
    console.log('Test 8: Expect not found error:')
    console.error(err)
  }
}

const test9 = async () => {
  const product = {
    code: 'producto 2',
    title: 'producto prueba 2',
    description: 'Este es un product prueba',
    price: 40,
    stock: 12
  }
  const products = await manager.addProduct(product)
  console.log('Test 9: Expect an array with 2 items => ', products)
  id2 = products[1].id
}

const test10 = async () => {
  try {
    const products = await manager.deleteProduct(2)
  } catch (err) {
    console.log('Test 10: Expect not found error:')
    console.error(err)
  }
}

const test11 = async () => {
  const products = await manager.deleteProduct(id)
  console.log('Test 11: Expect an array with only one item => ', products)
}

const test12 = async () => {
  const product = {
    code: 'producto 3',
    title: 'producto prueba 3',
    description: 'Este es un product prueba',
    price: 'aaa',
    stock: 12
  }
  try {
    const products = await manager.addProduct(product)
  } catch (err) {
    console.log('Test 12: Expect a validation error (price not a number)')
    console.error(err)
  }
}

const test13 = async () => {
  const product = {
    code: 'producto 3',
    title: 'producto prueba 3',
    description: 'Este es un product prueba',
    price: '5',
    stock: 'a2'
  }
  try {
    const products = await manager.addProduct(product)
  } catch (err) {
    console.log('Test 13: Expect a validation error (stock not a number)')
    console.error(err)
  }
}

const test14 = async () => {
  const product = {
    code: 'producto 3',
    title: 'producto prueba 3',
    description: 'Este es un product prueba',
    price: '5',
    stock: '2',
    thumbnails: 'imagenes'
  }
  try {
    const products = await manager.addProduct(product)
  } catch (err) {
    console.log('Test 14: Expect a validation error (thumbnails not an array)')
    console.error(err)
  }
}

const test15 = async () => {
  const product = {
    code: 'producto 3',
    title: 'producto prueba 3',
    description: 'Este es un product prueba',
    price: '5',
    stock: '2',
    status: 'n'
  }
  try {
    const products = await manager.addProduct(product)
  } catch (err) {
    console.log('Test 15: Expect a validation error (status not true or false)')
    console.error(err)
  }
}

const test16 = async () => {
  const product = {
    code: 'producto 3',
    title: 'producto prueba 3',
    description: 'Este es un product prueba',
    price: '5',
    stock: '2',
    status: 'false',
    thumbnails: [
      'imagen1',
      'imagen2'
    ]
  }
  const products = await manager.addProduct(product)
  console.log('Test 16: Expect an array with 2 items => ', products)
}

const testing = async () => {
  initializeTests()
  await test1()
  await test2()
  await test3()
  await test4()
  await test5()
  await test6()
  await test7()
  await test8()
  await test9()
  await test10()
  await test11()
  await test12()
  await test13()
  await test14()
  await test15()
  await test16()
}

export default testing
