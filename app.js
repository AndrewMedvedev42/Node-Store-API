require("dotenv").config()
require("express-async-errors")
const port = 5000
const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

app.use(express.json())

app.use('/api/v1/products', productsRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const start = async () => {
    try {
        await connectDB(process.env.DATABASE_URI)
        app.listen(port, console.log(`Listening port ${port}`))
    } catch (error) {
        console.log(error);
    }
}
start()