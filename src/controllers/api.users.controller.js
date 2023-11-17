import { UserManager } from '../dao/factory.js'
import { transport } from '../utils.js'
import { getAll, getAllData } from './users.controller.js'

const userManager = new UserManager()

const documentsFound = (documents) => {
  return (
    documents.findIndex(element => element.type === 'identification') > -1 &&
    documents.findIndex(element => element.type === 'account') > -1 &&
    documents.findIndex(element => element.type === 'address') > -1
  )
}

const updateToPremium = async (req, res) => {
  try {
    const user = await userManager.getById(req.params.uid)
    if (user.role === 'admin' | 'premium') return res.status(200).send({ message: 'ok' })
    if (!documentsFound(user.documents)) return res.status(400).send({ message: 'all documents have not been uploaded' })
    const newUser = { ...user, role: 'premium' }
    await userManager.save(req.params.uid, newUser)
    return res.status(200).send({ message: 'User updated' })
  } catch (e) {
    req.logger.error(e.message)
    return res.status(500).send({ message: 'Error updating user' })
  }
}

const deleteInactive = async (req, res) => {
  const TWODAYS = 2 * 24 * 60 * 60 * 1000
  try {
    const users = await getAll()
    if (users.length > 0) {
      for (const user in users) {
        if ((Date.now().valueOf() - user.lastConnection.valueOf()) > TWODAYS) {
          await transport.sendMail({
            from: 'Jorge Sainz <jsainzfc@gmail.com>',
            to: `${user.email}`,
            subject: 'Pass recovery',
            html: `
              <div>
                <h1>Account deleted</h1>
                <p>We are sorry to informed you but your account has been deleted because of being inactive</p>
              </div>
            `,
            attachments: []
          })
          await userManager.delete(user._id)
        }
      }
    }
    return res.json({ message: 'Users cleaned' })
  } catch (err) {
    return res.status(500)
  }
}

const uploadDocuments = async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: 'File could not be uploaded' })
  }
  const documents = await userManager.getDocuments(req.params.uid)
  for (const file in req.files) {
    req.files[file].forEach(({ fieldname, filename, path }) => {
      if (fieldname === 'identification' || fieldname === 'address' || fieldname === 'account') {
        const index = documents.findIndex(element => element.type === fieldname)
        if (index > -1) {
          documents[index] = { name: filename, type: fieldname, path }
        } else {
          documents.push({ name: filename, type: fieldname, path })
        }
      } else {
        documents.push({ name: filename, type: fieldname, path })
      }
    })
  }

  try {
    await userManager.updateDocuments(req.params.uid, documents)
    return res.render('uploadDocuments', {
      title: 'Upload your documents',
      id: req.session.user.id,
      success: true,
      message: 'Files uploaded'
    })
  } catch (err) {
    return res.render('uploadDocuments', {
      title: 'Upload your documents',
      id: req.session.user.id,
      success: false,
      message: err.message
    })
  }
}

const getUsers = async (_, res) => {
  try {
    const users = await getAllData()
    return res.status(200).json({ payload: users })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

const deleteById = async (req, res) => {
  const { id } = req.params
  try {
    await userManager.delete(id)
    res.status(204).json({ message: 'User removed' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export { updateToPremium, deleteInactive, uploadDocuments, getUsers, deleteById }
