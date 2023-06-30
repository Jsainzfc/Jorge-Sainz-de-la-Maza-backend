import path from 'path'
import { fileURLToPath } from 'url';
import { ProductManager } from './productManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testing = async () => {
  const manager = new ProductManager(path.join(__dirname, 'products.json'))
  let products = await manager.getProducts() 
  console.log('Test 1: Expect an empty array => ', products)
  await manager.addProduct ('abc123', 'producto prueba', 'Este es un product prueba', 200, 25, 'Sin imagen')
  products = await manager.getProducts()
  console.log('Test 2: Expect an array with only one item => ', products)
  await manager.addProduct ('abc123', 'producto prueba', 'Este es un product prueba', 200, 25, 'Sin imagen') // Expect a not unique error
  let product = await manager.getProductById(0)
  console.log('Test 3: Expect product abc123 => ', product)
  product = await manager.getProductById(1) // Expect not found error
  console.log('Test 4: Expect undefined => ', product)
  await manager.addProduct('abc123', 'producto prueba', 'Este es un product prueba', 200, 25) // Expect not all fields error
  await manager.updateProduct(0, [{property: 'code', value: 'newCode'}])
  product = await (manager.getProductById(0))
  console.log('Test 5: Expect product with code changed:', product)
  await manager.updateProduct(1, [{property: 'code', value: 'newCode'}]) // Expect not found error
  await manager.updateProduct(0, [{property: 'code', value: 'newCode'}]) // Expect field not existing error
  await manager.updateProduct(0, [{property: 'id', value: '14'}]) // Expect id cannot be modified error
  await manager.addProduct ('code2', 'producto prueba', 'Este es un product prueba', 200, 25, 'Sin imagen')
  products = await manager.getProducts()
  console.log('Test 6: Expect an array with 2 items => ', products)
  await manager.deleteProduct(2) // Expect product not found error
  products = await manager.getProducts()
  console.log('Test 7: Expect an array with 2 items => ', products)
  await manager.deleteProduct(1)
  products = await manager.getProducts()
  console.log('Test 8: Expect an array with only one item => ', products)
}

const createFileForTesting = async () => {
  const manager = new ProductManager(path.join(__dirname, 'productsForTesting.json'))
  await manager.addProduct('abc123', 'producto prueba', 'Este es un product prueba', 200, 25, 'Sin imagen')
  await manager.addProduct('shoes', 'zapatos', 'zapatos', 200, 25, 'Sin imagen')
  await manager.addProduct('shirt', 'camiseta', 'camiseta', 200, 25, 'Sin imagen')
  await manager.addProduct('trousers', 'pantalones', 'pantalones', 200, 25, 'Sin imagen')
  await manager.addProduct('watch', 'reloj', 'reloj', 200, 25, 'Sin imagen')
  await manager.addProduct('hat', 'sombrero', 'sombrero', 200, 25, 'Sin imagen')
  await manager.addProduct('code1', 'producto prueba', 'Este es un product prueba', 200, 25, 'Sin imagen')
  await manager.addProduct('code2', 'zapatos', 'zapatos', 200, 25, 'Sin imagen')
  await manager.addProduct('code3', 'camiseta', 'camiseta', 200, 25, 'Sin imagen')
  await manager.addProduct('code4', 'pantalones', 'pantalones', 200, 25, 'Sin imagen')
  await manager.addProduct('code5', 'reloj', 'reloj', 200, 25, 'Sin imagen')
  await manager.addProduct('code6', 'sombrero', 'sombrero', 200, 25, 'Sin imagen')
}

testing()