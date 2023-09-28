import { Router } from 'express'
import passport from 'passport'
import { isAuth } from '../middlewares/auth-middleware.js'

const router = Router()

router.get('/signup', (_, res) => res.render('signup'))

router.post('/signup', passport.authenticate('signup', { failureRedirect: '/failedsignup' }), async (req, res) => {
  res.json({ message: 'User registered' })
})

router.get('/failedsignup', async (req, res) => {
  res.status(404).json({ message: 'User already exists' })
})

router.get('/login', (_, res) => res.render('login'))
router.post('/login', passport.authenticate('login', { failureRedirect: 'failedlogin' }), async (req, res) => {
  if (!req.user) return res.status(400).json({ message: 'Invalid Credentials' })
  req.session.user = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    role: req.user.role,
    email: req.user.email
  }
  res.json({ message: 'User logged', payload: req.user })
})
router.get('/failedlogin', (req, res) => {
  res.status(400).json({ message: 'Failed login' })
})

router.get('/logout', isAuth, (req, res) => {
  res.clearCookie('user')

  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/error')
    }
    req.user = null
    res.render('login')
  })
})

export default router
