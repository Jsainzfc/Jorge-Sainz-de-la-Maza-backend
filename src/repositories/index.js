import { ProductManager } from '../dao/factory.js'
import ProductRepository from './products.repositories.js'

export const productsService = new ProductRepository(new ProductManager())
