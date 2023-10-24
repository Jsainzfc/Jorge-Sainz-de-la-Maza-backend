import { Router } from 'express'
import passport from 'passport'
import { isAuth } from '../middlewares/auth-middleware.js'
import { passwordRecovery, getPasswordRecovery, getPasswordReset, passwordReset, logout, failedLogin, login, getLogin } from '../controllers/login.controller.js'

const router = Router()

router.get('/signup', (_, res) => res.render('signup'))

router.post('/signup', passport.authenticate('signup', { failureRedirect: '/failedsignup' }), async (req, res) => {
  res.json({ message: 'User registered' })
})

router.get('/failedsignup', async (req, res) => {
  res.status(404).json({ message: 'User already exists' })
})

router.get('/login', getLogin)

router.post('/login', passport.authenticate('login', { failureRedirect: 'failedlogin' }), login)

router.get('/failedlogin', failedLogin)

router.get('/logout', isAuth, logout)

router.get('/password-recovery', getPasswordRecovery)

router.post('/password-recovery', passwordRecovery)

router.get('/passwordReset', getPasswordReset)

router.post('/passwordReset', passwordReset)

export default router
