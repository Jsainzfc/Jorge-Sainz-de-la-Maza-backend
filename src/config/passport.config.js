import passport from 'passport'
import local from 'passport-local'
import { hashPassword, isValidPassword } from '../utils/password.utils.js'
import github from './passport.github.js'
import strategy from './passport.jwt.js'
import { addOne } from '../controllers/carts.controller.js'
import { create, getByEmail, getById } from '../controllers/users.controller.js'

const LocalStrategy = local.Strategy

const signup = async (req, email, password, done) => {
  const inputUser = req.body

  if (inputUser.password !== inputUser.password2) {
    return done(null, false)
  }

  try {
    const user = await getByEmail(email)
    console.log(user)

    if (user) {
      req.logger.info('User already exists')
      return done(null, false)
    }

    const cart = await addOne()
    const newUser = await create({
      firstname: inputUser.firstName,
      lastname: inputUser.lastName,
      email: inputUser.email,
      password: hashPassword(inputUser.password),
      role: 'user',
      age: inputUser.age,
      cart: cart.payload
    })

    return done(null, {
      name: newUser.firstname,
      id: newUser._id,
      ...newUser._doc
    })
  } catch (err) {
    return done(err, false)
  }
}

const login = async (username, password, done) => {
  try {
    const user = await getByEmail(username)
    if (!user) {
      console.log("User doesn't exists")
      return done(null, false)
    }
    if (!isValidPassword(password, user.password)) return done(null, false)
    return done(null, user)
  } catch (err) {
    return done(err)
  }
}

const loginStrategy = new LocalStrategy({ usernameField: 'email' }, login)

const init = () => {
  passport.use('signup', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, signup))
  passport.use('login', loginStrategy)
  passport.use('jwt', strategy)

  passport.use('github', github)

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await getById(id)
    done(null, user)
  })
}

export { init, loginStrategy }
