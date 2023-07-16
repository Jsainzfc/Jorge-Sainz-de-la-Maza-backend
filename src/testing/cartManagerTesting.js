import { CartManager } from '../managers/cartManager.js'
import fs from 'fs' // Module for managing files 
import __dirname from '../utils.js';

let id
let manager

const initializeTests = () => {
  if (fs.existsSync(path.join(__dirname, 'carts.json'))) {
    fs.unlinkSync(path.join(__dirname, 'carts.json'))
    //file removed
  }
  manager = new CartManager(path.join(__dirname, 'carts.json'))
}

const test1 = async () => {
  id = await manager.addCart() 
  console.log('Test 1: Expect an id => ', id)
}

const test2 = async () => {
  const products = await manager.getCartProductsById(id)
  console.log('Test 2: Expect an empty array => ', products)
}

const test3 = async () => {
    try {
        const products = await manager.getCartProductsById(1)
    } catch (err) {
      console.log('Test 3: Expect not found:')
      console.error(err)
    }
  }

const test4 = async () => {
    const products = await manager.updateCart ({id, productId: '1'})
    console.log('Test 4: Expect array with 1 item and quantity = 1:', products)
}

const test5 = async () => {
    const products =  await manager.updateCart ({id, productId: '1'})
    console.log('Test 5: Expect array with 1 item and quantity = 2:', products)
}

const test6 = async () => {
    const products = await manager.updateCart ({id, productId: '2'})
    console.log('Test 6: Expect array with 2 items , first with quantity = 2, second with quantity = 1:', products)
}

const test7 = async () => {
  try {
    const products = await manager.updateCart ({id: '1', productId: '1'})
  } catch (err) {
    console.log('Test 5: Expect not found error:')
    console.error(err)
  }
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
}


export default testing