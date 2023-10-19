import { UserManager } from '../dao/factory.js'

const userManager = new UserManager()

const updateToPremium = async (req, res) => {
  try {
    const user = await userManager.getById(req.params.uid)
    if (user.role === 'admin' | 'premium') return res.status(200).send({ message: 'ok' })
    const newUser = { ...user, role: 'premium' }
    await userManager.save(req.params.uid, newUser)
    return res.status(200).send({ message: 'User updated' })
  } catch (e) {
    req.logger.error(e.message)
    return res.status(500).send({ message: 'Error updating user' })
  }
}

export { updateToPremium }
