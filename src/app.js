import 'dotenv/config'
import http from 'http'
import { __dirname } from './utils.js'
import { join } from 'path'
import express from 'express'
import { engine } from 'express-handlebars'
import { api, home } from './routes/index.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import { init } from './config/passport.config.js'

const MONGOURI = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@coderhouse.wp11tre.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(MONGOURI) // Connect with the mongodb database

// Initialize express, http and web socket servers
const app = express()
const server = http.createServer(app)
const io = new Server(server)

// Set handlebars as template engine
app.engine('handlebars', engine())
app.set('views', join(__dirname, '/views'))
app.set('view engine', 'handlebars')

// Set express to read body and query params and set static files directory
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/static', express.static(join(__dirname + '/public')))

// Set cookie parser and sessions
app.use(cookieParser(process.env.COOKIESECRET))
app.use(session({
  secret: process.env.COOKIESECRET,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: MONGOURI,
    ttl: 60 * 60
  })
}))

// Set passport middlewares
init()
app.use(passport.initialize())
app.use(passport.session())

/// middleware global
app.use((req, res, next) => {
  if (req.session?.user) {
    req.user = {
      name: req.session.user.name,
      role: req.session.user.role,
      cart: req.session.user.cart
    }
  }
  next()
})

// Set routes
app.use('/api', (req, res, next) => {
  req.io = io
  next()
}, api)
app.use('/', (req, res, next) => {
  req.io = io
  next()
}, home)

server.listen(process.env.PORT, () => {
  console.log(`Express Server listening at http://localhost:${process.env.PORT}`)
})
