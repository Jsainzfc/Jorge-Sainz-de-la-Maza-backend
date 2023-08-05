// eslint-disable-next-line no-undef
const socket = io()
const messagesEl = document.querySelector('#messages')
const inputElement = document.querySelector('.send input')
let username = null
const usersEl = document.querySelector('.chat__users--logged')

messagesEl.innerHTML = ''

// Function that appends a new message element to the HTML
const appendMessageElement = ({ user, date, msg }) => {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<span class="user">${user === username ? 'You' : user} [${date.toLocaleTimeString('en-US')}]</span> <span class="text">${msg}</span>`
  messagesEl.appendChild(div)
}

// Function that appends a new user (dis)connection element to the HTML
const appendUserActionElement = (user, joined) => {
  const div = document.createElement('div')
  div.classList.add('message')
  div.classList.add('joined')

  const action = joined ? 'in' : 'out'

  div.innerHTML = `<span class="text">${user === username ? 'You' : user} logged ${action}</span>`

  messagesEl.appendChild(div)
}

// Function for adding a user to the logged users list
const appendOnlineUser = (user, token) => {
  const li = document.createElement('li')
  li.setAttribute('id', token)
  li.innerText = `${user} ${user === username ? '(You)' : ''}`
  usersEl.appendChild(li)
}

// Function for removing a user from the logged users list
const removeOnlineUser = (token) => {
  const li = document.getElementById(`${token}`)
  usersEl.removeChild(li)
}

let currentMessages = [] // History of messages
let onlineUsers = []

// Initialise socket event. Initialises users and messages
socket.on('initialise', ({ messages, users }) => {
  currentMessages = messages
  onlineUsers = users
})

// Identification
// eslint-disable-next-line no-undef
Swal.fire({
  title: 'Input a username',
  input: 'text',
  inputAttributes: {
    autocapitalize: 'off'
  },
  confirmButtonText: 'Send',
  preConfirm: (username) => {
    // agregar logica
    if (!username) {
      // eslint-disable-next-line no-undef
      Swal.showValidationMessage(
        'User cannot be blank'
      )
      return
    }

    return username
  },
  allowOutsideClick: false
})
  .then(({ value }) => {
    username = value
    socket.emit('user', { user: username, action: true })
    appendOnlineUser(username)

    // Initialise messages in HTML
    for (const message of currentMessages) {
      const datetime = new Date(message.date)
      appendMessageElement({ user: message.user, msg: message.message, date: datetime })
    }

    // Initialise users in HTML
    for (const { user, token } of onlineUsers) {
      appendOnlineUser(user, token)
    }

    socket.on('chat-message', ({ user, date, text }) => {
      const datetime = new Date(date)
      appendMessageElement({ user, date: datetime, msg: text })
    })

    socket.on('user', ({ user, action }) => {
      appendUserActionElement(user, action)
    })

    socket.on('userIn', ({ user, token }) => {
      appendOnlineUser(user, token)
    })

    socket.on('userOut', ({ token }) => {
      removeOnlineUser(token)
    })

    inputElement.addEventListener('keyup', ({ key, target }) => {
      if (key !== 'Enter') {
        return
      }

      const { value } = target
      if (!value) { // Empty messages are not sent
        return
      }

      const date = new Date()
      const msg = { user: username, date, text: value }

      socket.emit('chat-message', msg)
      target.value = ''
      appendMessageElement({ user: username, date, msg: value })
    })
  }
  )
