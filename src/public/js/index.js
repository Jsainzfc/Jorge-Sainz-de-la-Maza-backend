const socket = io() // Starts connection with socket server
socket.emit('message', 'PROBANDO')