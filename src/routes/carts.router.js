import {Router} from 'express'
import path  from 'path'
import { fileURLToPath } from 'url';
import { CartManager } from '../managers/cartManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartManager = new CartManager (path.join(__dirname, '../database/carts.json'))

const router = Router()

router.get('/:cid', async (req, res) => {
    try {
        const products = await cartManager.getCartProductsById(req.params.cid)
        return res.json(products)
    } catch(err) {
        return res.status(404).send(err.message)
    }
})

router.post('/', async (req, res) => {
    try {
        const id = await cartManager.addCart()
        return res.json(id)
    } catch(err) {
        return res.status(500).send('Algo ha salido mal')
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const products = await cartManager.updateCart({id : req.params.cid, productId: req.params.pid})
        return res.json(products)
    } catch(err) {
        return res.status(404).send(err.message)
    }
})

export default router