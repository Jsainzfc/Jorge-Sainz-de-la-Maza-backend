import {Router} from 'express'
import { ProductManager } from './productManager.js'
import path  from 'path'
import { fileURLToPath } from 'url';

const router = Router()

app.get('/', async (req, res) => {
    console.log('Carts')
})

export default router