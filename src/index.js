require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
require('express-async-errors')


const app = express()
require('./database')

const morgan = require('morgan')
app.use(morgan('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


const routes = require('./routes')
app.use('/auth', routes)

app.use(require('./config/errorHandler'))

app.listen(process.env.PORT, ()=> {
    console.log(`Server started at port ${process.env.PORT}`)
})