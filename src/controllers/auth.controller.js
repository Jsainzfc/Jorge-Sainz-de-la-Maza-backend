import { generateToken } from '../../utils/jwt.utils.js'
import { isValidPassword } from '../../utils/password.utils.js'
import { UserManager } from '../../dao/mongoose/user.manager.js'

const userManager = new UserManager()

const login = async (req, res) => {
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
}

const githubLogin = async (req, res) => {
  req.session.user = req.user

  req.session.save((err) => {
    if (!err) {
      return res.redirect('/')
    }
    res.redirect('/login')
  })
}

export { login, githubLogin }
