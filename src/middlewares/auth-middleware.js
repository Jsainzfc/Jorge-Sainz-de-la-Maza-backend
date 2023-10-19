function isAuth (req, res, next) {
  if (req.session.user) {
    next()
    return
  }
  req.logger.warning('User not logged accessing')
  res.redirect('/login')
}

export { isAuth }
