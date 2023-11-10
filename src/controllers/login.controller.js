import { getByEmail, getById, resetPassword, updateLastConnection } from '../controllers/users.controller.js'
import { getByUserId, create, deleteOne } from '../controllers/token.controller.js'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import { config } from '../config/config.js'
import { hashPassword, isValidPassword } from '../utils/password.utils.js'

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: 'jsainzfc@gmail.com',
    pass: config.mailpass
  }
})

const logout = (req, res) => {
  updateLastConnection(req.session.user.id)
  res.clearCookie('user')

  req.session.destroy((err) => {
    req.logger.error(err)
    req.session.user = null
    res.render('login')
  })
}

const passwordRecovery = async (req, res) => {
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
  return res.render('login', {
    title: 'Log in',
    error: 'If user exists, recovery link has been sent'
  })
}

const getPasswordRecovery = (req, res) => {
  res.render('passwordrecovery', {
    title: 'Recover your password'
  })
}

const tokenValid = async (token, passwordResetToken) => {
  if (!passwordResetToken) {
    return false
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token)
  if (!isValid) {
    return false
  }
}

const getPasswordReset = async (req, res) => {
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
}

const passwordReset = async (req, res) => {
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
    if (isValidPassword(password, user.password)) {
      res.render('passwordreset', {
        title: 'Reset your password',
        token,
        id,
        error: 'Password must be different'
      })
    }
    await resetPassword(id, hashPassword(password))
    return res.render('login', {
      title: 'Log in',
      error: 'Password updated'
    })
  } catch (e) {
    req.logger.error(e.message)
    res.render('passwordrecovery', {
      title: 'Recover your password',
      error: 'Error reseting password'
    })
  }
}

const failedLogin = (req, res) => {
  res.status(400).json({ message: 'Failed login' })
}

const login = async (req, res) => {
  if (!req.user) return res.status(400).json({ message: 'Invalid Credentials' })
  req.session.user = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    role: req.user.role,
    email: req.user.email,
    id: req.user._id.toString()
  }
  updateLastConnection(req.session.user.id)
  res.redirect('/')
}

const getLogin = (req, res) => {
  if (!req.session.user) return res.render('login')
  return res.redirect('/')
}

const signup = async (req, res) => {
  res.json({ message: 'User registered' })
}

const failedSignup = async (req, res) => {
  res.status(404).json({ message: 'User already exists' })
}

const getSingUp = (_, res) => res.render('signup')

export { logout, passwordRecovery, getPasswordRecovery, getPasswordReset, passwordReset, failedLogin, login, getLogin, signup, failedSignup, getSingUp }
