import { Router } from 'express'
import passport from 'passport'
import { isAuth } from '../middlewares/auth-middleware.js'
import nodemailer from 'nodemailer'
import { config } from '../config/config.js'
import { getByEmail, getById, resetPassword } from '../controllers/users.controller.js'
import { getByUserId, create, deleteOne } from '../controllers/token.controller.js'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { hashPassword, isValidPassword } from '../utils/password.utils.js'

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: 'jsainzfc@gmail.com',
    pass: config.mailpass
  }
})

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

router.get('/password-recovery', (req, res) => {
  res.render('passwordrecovery', {
    title: 'Recover your password'
  })
})

router.post('/password-recovery', async (req, res) => {
  const email = req.body.email
  if (!email) {
    return res.status(400).json({ message: 'Email must be included' })
  }

  try {
    const user = await getByEmail(email)
    const token = await getByUserId(user._id)
    if (token) await deleteOne(token._id)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hash = await bcrypt.hash(resetToken, Number(10))
    const newToken = {
      userId: user._id,
      token: hash,
      createdAd: Date.now()
    }
    await create(newToken)
    const link = `${config.clienturl}/passwordReset?token=${resetToken}&id=${user._id}`

    try {
      await transport.sendMail({
        from: 'Jorge Sainz <jsainzfc@gmail.com>',
        to: `${email}`,
        subject: 'Pass recovery',
        html: `
          <div>
            <h1>Pass Recovery</h1>
            <a href="${link}">Click here</a>
          </div>
        `,
        attachments: []
      })
    } catch (err) {
      req.logger.error(err.message)
      req.logger.error('Error sending recovery email')
    }
  } catch (err) {
    req.logger.error(err.message)
    req.logger.error('user not found when recovering password')
  }
  return res.status(200).send('If user exists, a recovery email has been sent')
})

const tokenValid = async (token, passwordResetToken) => {
  if (!passwordResetToken) {
    return false
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token)
  if (!isValid) {
    return false
  }
}

router.get('/passwordReset', async (req, res) => {
  const { token, id } = req.query
  if (!token || !id) {
    res.render('passwordrecovery', {
      title: 'Recover your password',
      error: 'Link erroneous or expired'
    })
  }
  try {
    const passwordResetToken = await getByUserId(id)
    if (!tokenValid(token, passwordResetToken)) {
      res.render('passwordrecovery', {
        title: 'Recover your password',
        error: 'Link erroneous or expired'
      })
    }
    res.render('passwordreset', {
      title: 'Reset your password',
      token,
      id
    })
  } catch (err) {
    res.render('passwordrecovery', {
      title: 'Recover your password',
      error: 'Link erroneous or expired'
    })
  }
})

router.post('/passwordReset', async (req, res) => {
  const { token, id } = req.query
  const { password } = req.body
  console.log(token, id, password)
  if (!token || !id || !password) {
    res.render('passwordrecovery', {
      title: 'Recover your password',
      error: 'Link erroneous or expired'
    })
  }
  try {
    const passwordResetToken = await getByUserId(id)
    if (!tokenValid(token, passwordResetToken)) {
      res.render('passwordrecovery', {
        title: 'Recover your password',
        error: 'Link erroneous or expired'
      })
    }
    const user = getById(id)
    const newPass = hashPassword(password)
    if (isValidPassword(newPass, user.password)) {
      res.render('passwordreset', {
        title: 'Reset your password',
        token,
        id,
        error: 'Password must be different'
      })
    }
    await resetPassword(id, newPass)
    res.status(200).json({ message: 'Password updated' })
  } catch (e) {
    req.logger.error(e.message)
    res.render('passwordrecovery', {
      title: 'Recover your password',
      error: 'Error reseting password'
    })
  }
})

export default router
