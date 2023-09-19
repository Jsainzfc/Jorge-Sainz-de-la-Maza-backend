import ProductMongoManager from './mongoose/productManager.js'
import UserMongoManager from './mongoose/user.manager.js'
import CartMongoManager from './mongoose/cartManager.js'
import CategoryMongoManager from './mongoose/categoryManager.js'
import CartFileManager from './fs/cartManager.js'
import ProductFileManager from './fs/productManager.js'
import { config } from '../config/config.js'

class ManagerFactory {
  static getManagerInstance (name) {
    switch (name) {
      case 'products':
        return config.persistance === 'mongo' ? ProductMongoManager : ProductFileManager
      case 'carts':
        return config.persistance === 'mongo' ? CartMongoManager : CartFileManager
      case 'categories':
        return CategoryMongoManager
      case 'users':
        return UserMongoManager
    }
  }
}

export const ProductManager = ManagerFactory.getManagerInstance('products')
export const CategoryManager = ManagerFactory.getManagerInstance('categories')
export const CartManager = ManagerFactory.getManagerInstance('carts')
export const UserManager = ManagerFactory.getManagerInstance('users')
