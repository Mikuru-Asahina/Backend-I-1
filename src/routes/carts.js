const express = require('express')
const router = express.Router()
const path = require('path')
const {CartManager} = require('../managers/CartManager')

const cartPath = path.join(__dirname, '../data/carts.json')
const manager = new CartManager(cartPath)

router.post('/', async (req, res) => {
    try {
        const newCart = await manager.createCart();
        res.status(201).json({ message: 'Carrito creado', cart: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const cart = await manager.getCartById(cid)
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' })

        res.json({ products: cart.products })
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        const cart = await manager.addProductToCart(cid, pid)
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' })

        res.json({ message: `Producto ${pid} agregado al carrito ${cid}`, cart })
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
})

module.exports = router