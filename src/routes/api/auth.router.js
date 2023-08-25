import { Router } from 'express'
import passport from 'passport'
import { UserManager } from '../../dao/mongoose/user.manager.js'
import { generateToken } from '../../utils/jwt.utils.js'
import { isValidPassword } from '../../utils/password.utils.js'

const userManager = new UserManager()
const router = Router()

// Passport runs github login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {})

// Callback for storing session once user is logged via github
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    req.session.user = req.user

    req.session.save((err) => {
      if (!err) {
        return res.redirect('/')
      }
      res.redirect('/login')
    })
  })

// creamos una ruta para authenticar usuarios de API
// mandamos un post request a /api/login
// para obtener un token que usaremos en las demas llamadas al api
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  console.log(email, password)

  try {
    const user = await userManager.getByEmail(email)

    console.log(password, user)

    if (!user || !isValidPassword(password, user?.password)) {
      console.log('no coincide password')
      return res.status(401).send({
        status: 'failure',
        error: 'Failed login'
      })
    }

    const token = generateToken(user)

    return res.cookie('jwtToken', token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true
    }).send({
      status: 'success',
      message: token
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: 'failure',
      error
    })
  }
})

// /api/auth/user
router.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.user)

  res.sendStatus(200)
})

export default router
