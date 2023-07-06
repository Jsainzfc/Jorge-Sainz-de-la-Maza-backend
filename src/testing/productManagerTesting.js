import path from 'path'
import { fileURLToPath } from 'url';
import { ProductManager } from '../managers/productManager.js'
import fs from 'fs' // Module for managing files 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let id, id_2
let manager

const initializeTests = () => {
  if (fs.existsSync(path.join(__dirname, 'products.json'))) {
    fs.unlinkSync(path.join(__dirname, 'products.json'))
    //file removed
  }
  manager = new ProductManager(path.join(__dirname, 'products.json'))
}

const test1 = async () => {
  const products = await manager.getProducts() 
  console.log('Test 1: Expect an empty array => ', products)
}

const test2 = async () => {
  const product = {
    code : 'abc123',
    title: 'producto prueba',
    description: 'Este es un product prueba',
    price: 20,
    stock: 25
  }
  await manager.addProduct (product)
  const products = await manager.getProducts()
  console.log('Test 2: Expect an array with only one item => ', products)
  id = products[0].id
}

const test3 = async () => {
  try {
    await manager.addProduct ({code, title, description, price, stock})
  } catch (err) {
    console.log('Test 3: Expect not unique error:')
    console.error(err)
  }
}

const test4 = async () => {
  const product = await manager.getProductById(id)
  console.log('Test 4: Expect product abc123 => ', product)
}

const test5 = async () => {
  try {
    const product = await manager.getProductById(1)
  } catch (err) {
    console.log('Test 5: Expect not found error:')
    console.error(err)
  }
}

const test6 = async () => {
  try {
    await manager.addProduct({code, title, description, price})
  } catch (err) {
    console.log('Test 6: Expect not all fields found error:')
    console.error(err)
  }
}

const test7 = async () => {
  await manager.updateProduct(id, {code: 'newCode'})
  const product = await (manager.getProductById(id))
  console.log('Test 7: Expect product with code changed:', product)
}

const test8 = async () => {
  try {
    await manager.updateProduct(1, {code: 'newCode'})
  } catch (err) {
    console.log('Test 8: Expect not found error:')
    console.error(err)
  }
}

const test9 = async () => {
  const product = {
    code : 'producto 2',
    title: 'producto prueba 2',
    description: 'Este es un product prueba',
    price: 40,
    stock: 12
  }
  await manager.addProduct (product)
  const products = await manager.getProducts()
  console.log('Test 9: Expect an array with 2 items => ', products)
  id_2 = products[1].id
}

const test10 = async () => {
  try {
    await manager.deleteProduct(2)
  } catch (err) {
    console.log('Test 10: Expect not found error:')
    console.error(err)
  }
}

const test11 = async () => {
  await manager.deleteProduct(id)
  const products = await manager.getProducts()
  console.log('Test 11: Expect an array with only one item => ', products)
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
}


testing()