const express = require("express")
const {Server} = require("socket.io")
const {engine} = require("express-handlebars")

const mongoose = require("mongoose")
const { conectarDB } = require("./config/db.js");
const { config } = require("./config/config.js");

const PORT = config.PORT
const app = express()

// Routers
const productsRouter = require('./routes/products')
const cartsRouter = require('./routes/carts.js')
const viewsRouter = require('./routes/viewsRouter.js')

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Servir archivos estáticos (cliente WebSocket)
app.use(express.static("src/public"));

app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)
app.use(
  '/api/products', 
  (req, res, next) => {
    req.socket = serverSocket
    next()
  },
  productsRouter
)

// Handlebars
app.engine("hbs", engine({extname:"hbs"}))
app.set("view engine", "hbs")
app.set("views", "./src/views")

const serverHTTP = app.listen(PORT, () => {
    console.log(`Servidor online en puerto ${PORT}...¡¡¡`)
})

const serverSocket = new Server(serverHTTP)

// Comunicación WebSocket
serverSocket.on('connection', (socket) => {
  console.log(`Cliente conectado ✅, con id: ${socket.id} `) 
})

// Comunicacion con MongoDB Atlas
conectarDB (
  config.MONGO_URL,
  config.DB_NAME,
)