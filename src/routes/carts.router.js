import {Router} from 'express'
import __dirname from '../utils.js';
import { CartManager } from '../managers/cartManager.js';

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
        const products = await cartManager.getCartProductsById(id)
        return res.json({id, products})
    } catch(err) {
        return res.status(500).send('Algo ha salido mal')
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const {cid} = req.params
        const products = await cartManager.updateCart({id : cid, productId: req.params.pid})
        return res.json({id: cid, products})
    } catch(err) {
        return res.status(404).send(err.message)
    }
})

export default router