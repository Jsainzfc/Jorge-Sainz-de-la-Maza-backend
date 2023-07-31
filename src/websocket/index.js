import { messageModel } from '../models/messages.model.js'

const userOnline = {}
const users = []

const socketManager = async (socket) => {
  console.log(`user has connected: ${socket.id}`)

  const messages = await messageModel.find()

  socket.emit('initialise', { messages, users })

  socket.on('disconnect', () => { // When a user disconects, broadcast the disconection
    socket.broadcast.emit('user', {
      user: userOnline[socket.id],
      action: false
    })
    socket.broadcast.emit('userOut', { token: socket.id })
    delete userOnline[socket.id]
    console.log(`user has disconnected: ${socket.id}`)
  })

  socket.on('chat-message', (msg) => {
    messageModel.create({
      user: userOnline[socket.id],
      message: msg
    })
    socket.broadcast.emit('chat-message', msg)
  })

  socket.on('user', ({ user, action }) => {
    users.push({ user, token: socket.id })
    userOnline[socket.id] = user
    socket.broadcast.emit('user', { user, action })
    socket.broadcast.emit('userIn', { user, token: socket.id })
  })
}

export default socketManager
