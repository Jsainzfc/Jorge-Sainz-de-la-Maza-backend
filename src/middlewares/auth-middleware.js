function isAuth (req, res, next) {
  if (req.user) {
    next()
    return
  }
  req.logger.warning('User not logged accessing')
  res.redirect('/login')
}

export { isAuth }
