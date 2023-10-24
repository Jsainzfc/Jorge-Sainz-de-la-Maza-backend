import { Router } from 'express'
import passport from 'passport'
import { isAuth } from '../middlewares/auth-middleware.js'
import { passwordRecovery, getPasswordRecovery, getPasswordReset, passwordReset, logout, failedLogin, login, getLogin, signup, failedSignup, getSingUp } from '../controllers/login.controller.js'

const router = Router()

router.get('/signup', getSingUp)

router.post('/signup', passport.authenticate('signup', { failureRedirect: '/failedsignup' }), signup)

router.get('/failedsignup', failedSignup)

router.get('/login', getLogin)

router.post('/login', passport.authenticate('login', { failureRedirect: 'failedlogin' }), login)

router.get('/failedlogin', failedLogin)

router.get('/logout', isAuth, logout)

router.get('/password-recovery', getPasswordRecovery)

router.post('/password-recovery', passwordRecovery)

router.get('/passwordReset', getPasswordReset)

router.post('/passwordReset', passwordReset)

export default router
