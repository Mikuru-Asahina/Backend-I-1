const express = require("express")
const PORT = 8080
const app = express()

const productsRouter = require('./routes/products')
const cartsRouter = require('./routes/carts.js')

app.use(express.json())
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(PORT, () => {
    console.log(`Server online en puerto ${PORT}...¡¡¡`)
})