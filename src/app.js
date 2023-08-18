import express from 'express'
import __dirname from './utils.js'
import { engine } from 'express-handlebars'
import { join } from 'path'
import http from 'http'
import { api, home } from './routes/index.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'

const MONGOURI = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@coderhouse.wp11tre.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(MONGOURI)

const app = express() // Initialize express app

// Initializes http servers
const server = http.createServer(app)
const io = new Server(server)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', join(__dirname, '/views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIESECRET))
app.use('/static', express.static(join(__dirname + '/public')))

app.use(session({
  secret: process.env.COOKIESECRET,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: MONGOURI,
    ttl: 60 * 60
  })
}))

/// middleware global
app.use((req, res, next) => {
  if (req.session?.user) {
    req.user = {
      name: req.session.user.name,
      role: 'admin',
      cart: req.session.user.cart
    }
  }
  next()
})

app.use('/api', api)
app.use('/', home)

server.listen(process.env.PORT, () => {
  console.log(`Express Server listening at http://localhost:${process.env.PORT}`)
})

export default io
