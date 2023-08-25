import jwt from 'jsonwebtoken'
import 'dotenv/config'

const SECRET = process.env.JWT_SECRET

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
