import jwt from 'passport-jwt'
import { authToken } from '../utils/jwt.utils.js'

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const handler = async (token, done) => {
  console.log('4')
  try {
    if (!authToken(token)) {
      done(null, false, 'El token es inválido')
    } else {
      done(null, token)
    }
  } catch (err) {
    done(err)
  }
}

const extractor = (req) => {
  console.log('5')
  if (!req) return null
  if (!req.cookies) return null

  return req.cookies.jwtToken
}

const strategy = new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromExtractors([extractor]),
  secretOrKey: process.env.JWT_SECRET
}, handler)

export default strategy
