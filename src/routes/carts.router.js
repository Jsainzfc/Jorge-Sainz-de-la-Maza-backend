import {Router} from 'express'
import path  from 'path'
import { fileURLToPath } from 'url';
import { CartManager } from '../managers/cartManager';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartManager = new CartManager (path.join(__dirname, '../database/carts.json'))

const router = Router()


router.get('/:cid', async (req, res) => {
    try {
        const products = await cartManager.getCartProductsById(req.query.id)
        return res.json(products)
    } catch(err) {
        return res.status(404).send(err)
    }
})

router.post('/', async (req, res) => {
    try {
        await cartManager.addCart()
        return res.send('Carrito creado correctamente')
    } catch(err) {
        return res.status(500).send('Algo ha salido mal')
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        await cartManager.updateCart(req.query.cid, req.query.pid)
    } catch(err) {
        return res.status(404).send(err)
    }
})

export default router