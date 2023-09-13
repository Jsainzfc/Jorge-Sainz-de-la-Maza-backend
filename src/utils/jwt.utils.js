import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

const SECRET = config.jwt_secret

const generateToken = (user) => {
  return jwt.sign(user, SECRET, {
    expiresIn: '24h'
  })
}

const authToken = (token) => {
  try {
    jwt.verify(token, SECRET)
    return true
  } catch (e) {
    return false
  }
}

export { generateToken, authToken }
