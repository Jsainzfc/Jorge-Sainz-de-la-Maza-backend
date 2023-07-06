import {Router} from 'express'
import path  from 'path'
import { fileURLToPath } from 'url';

const router = Router()

router.get('/', async (req, res) => {
    console.log('Carts')
})

export default router