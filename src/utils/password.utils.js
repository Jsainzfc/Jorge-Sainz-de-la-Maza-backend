import bcrypt from 'bcrypt'

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

// pwd1 is not hashed
const isValidPassword = (pwd1, pwd2) => {
  if (!pwd1 || !pwd2) {
    return false
  }
  return bcrypt.compareSync(pwd1, pwd2)
}

export { hashPassword, isValidPassword }
