import { Router } from 'express'
import ProductRoutes from './api/products.router.js'
import CartRoutes from './api/carts.router.js'
import HomeRoutes from './home.router.js'
import CategoriesRoutes from './api/categories.router.js'
import AuthRoutes from './api/auth.router.js'
import LoginRoutes from './login.router.js'
import MockinProductsRoutes from './api/fake.products.router.js'
import MailRoutes from './mailing.router.js'
import UserRoutes from './api/users.router.js'

const api = Router()
api.use('/products', ProductRoutes)
api.use('/carts', CartRoutes)
api.use('/categories', CategoriesRoutes)
api.use('/auth', AuthRoutes)
api.use('/mockingproducts', MockinProductsRoutes)
api.use('/users', UserRoutes)

const home = Router()
home.use('/', HomeRoutes)
home.use('/', LoginRoutes)
home.use('/', MailRoutes)

export { api, home }
