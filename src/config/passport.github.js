import GitHubStrategy from 'passport-github2'
import { config } from './config.js'
import { create as createCart } from '../controllers/carts.controller.js'
import { getByEmail, create } from '../controllers/users.controller.js'

const CALLBACK_URL = 'http://localhost:8080/api/auth/github/callback'

// Callback when github strategy is used to log in
const auth = async (accessToken, refreshToken, profile, done) => {
  // accessToken y refreshToken are generated by github. Related with JWT

  try {
    const { _json: { email } } = profile

    if (!email) {
      console.log('User email is not public')
      return done(null, false)
    }

    let user = await getByEmail(email)

    if (!user) {
      const cart = await createCart()
      const _user = await create({
        firstname: '',
        lastname: '',
        email,
        password: '',
        role: 'user',
        age: '',
        cart,
        lastConnection: Date.now()
      })
      user = _user._doc
    }
    done(null, user)
  } catch (err) {
    console.error(err)
    done(err, false)
  }
}

const gitHubHandler = new GitHubStrategy(
  {
    clientID: config.github_client_id,
    clientSecret: config.github_client_secret,
    callbackURL: CALLBACK_URL
  },
  auth
)

export default gitHubHandler
