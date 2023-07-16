import express from 'express'
import __dirname from './utils.js'
import { engine } from 'express-handlebars'
import {join} from 'path'
import {api, home} from './routes/index.js'
import { Server } from 'socket.io'

const app = express() // Initialize express app

// Initializes http and socket servers
const PORT = 8080
const httpServer = app.listen(PORT, () => console.log(`Server up and listening in port ${PORT}`))
const socketServer = new Server(httpServer)


app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', join(__dirname, '/views'))


app.use(express.json())
app.use(express.urlencoded({extended:true}))
// This line facilitates the server to read and manage long and complex urls.
app.use('/static', express.static(join(__dirname + '/public')))

app.use('/api', api)
app.use('/', home)

// Initializes socket server
socketServer.on('connection', socket => {
  console.log("Nuevo cliente conectado")

  // Listen events of type "message"
  socket.on('message', data => {
    console.log(data)
  })

  socket.emit()
})