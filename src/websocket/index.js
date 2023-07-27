const messages = [
  {
    type: 'message',
    user: 'Mauricio',
    datetime: '17:35',
    text: 'Este es un mensaje de prueba de Mauricio',
  },
  {
    type: 'message',
    user: 'Javier',
    datetime: '17:37',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
  },
  {
    type: 'user',
    user: 'Ramon',
    action: 'false'
  }
]
const userOnline = {}
const users = []

function socketManager(socket) {
  console.log(`user has connected: ${socket.id}`)

  socket.emit('initialise', {messages, users})

  socket.on('disconnect', () => { // When a user disconects, broadcast the disconection
    socket.broadcast.emit('user', {
      user: userOnline[socket.id],
      action: false
    })

    delete userOnline[socket.id]
  })

  socket.on('chat-message', (msg) => {
    messages.push(msg)
    socket.broadcast.emit('chat-message', msg)
  })

  socket.on('user', ({ user, action }) => {
    userOnline[socket.id] = user
    socket.broadcast.emit('user', { user, action })
  })
}

export default socketManager