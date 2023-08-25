import jwt from 'passport-jwt'
import { authToken } from '../utils/jwt.utils.js'

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const handler = (token, done) => {
  try {
    if (!authToken) {
      done(null, false)
    } else {
      done(null, token)
    }
  } catch (err) {
    done(err)
  }
}

const extractor = (req) => {
  if (!req) return null
  if (!req.cookies) return null

  return req.cookies.jwtToken
}

const strategy = new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromExtractors([extractor]),
  secretOrKey: 'verysecretpassword'
}, handler)

export default strategy
