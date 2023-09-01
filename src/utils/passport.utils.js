import passport from 'passport'

export const passportCall = (strategy) => {
  console.log('1')
  return async (req, res, next) => {
    console.log('2', strategy)
    passport.authenticate(strategy, (err, user, info) => {
      console.log('3', err, user, info)
      if (err) return next(err)
      if (!user) {
        return res.status(401).send({ error: info.messages ? info.mesages : info.toString() })
      }
      req.user = user
      next()
    })
  }
}

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).send({ error: 'Unauthorized' })
    if (req.user.role !== role) return res.status(403).send({ error: 'No permission' })
    next()
  }
}
