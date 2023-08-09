import { Router } from 'express'
import ProductRoutes from './api/products.router.js'
import CartRoutes from './api/carts.router.js'
import HomeRoutes from './home.router.js'
import CategoriesRoutes from './api/categories.router.js'

const api = Router()
api.use('/products', ProductRoutes)
api.use('/carts', CartRoutes)
api.use('/categories', CategoriesRoutes)

const home = Router()
home.use('/', HomeRoutes)

export { api, home }
