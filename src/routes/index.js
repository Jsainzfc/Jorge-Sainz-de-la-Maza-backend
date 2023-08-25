import { Router } from 'express'
import ProductRoutes from './api/products.router.js'
import CartRoutes from './api/carts.router.js'
import HomeRoutes from './home.router.js'
import CategoriesRoutes from './api/categories.router.js'
import AuthRoutes from './api/auth.router.js'
import LoginRoutes from './login.router.js'

const api = Router()
api.use('/products', ProductRoutes)
api.use('/carts', CartRoutes)
api.use('/categories', CategoriesRoutes)
api.use('/auth', AuthRoutes)

const home = Router()
home.use('/', HomeRoutes)
home.use('/', LoginRoutes)

export { api, home }
