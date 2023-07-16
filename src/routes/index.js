import  { Router } from 'express'
import ProductRoutes from './api/products.router.js'
import CartRoutes from './api/carts.router.js'
import HomeRoutes from './home.router.js'

const api = Router()
api.use('/products', ProductRoutes)
api.use('/users', CartRoutes)

const home = Router()
home.use('/', HomeRoutes)

export {api, home}