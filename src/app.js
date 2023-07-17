import express from 'express'
import __dirname from './utils.js'
import { engine } from 'express-handlebars'
import {join} from 'path'
import http from 'http'
import {api, home} from './routes/index.js'
import { Server } from 'socket.io'

const app = express() // Initialize express app

// Initializes http servers
const server = http.createServer(app)
const io = new Server(server)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', join(__dirname, '/views'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/static', express.static(join(__dirname + '/public')))

app.use('/api', api)
app.use('/', home)

const PORT = 8080
server.listen(PORT, () => {
  console.log(`Express Server listening at http://localhost:${PORT}`)
})

export default io