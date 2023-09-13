import { Router } from 'express'
import passport from 'passport'
import { githubLogin, login } from '../../controllers/auth.controller.js'

const router = Router()

// Passport runs github login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {})

// Callback for storing session once user is logged via github
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), githubLogin)

// creamos una ruta para authenticar usuarios de API
router.post('/login', login)

router.get('/current', (req, res) => {
  res.send({ status: 'Success', payload: req.user })
})

export default router
