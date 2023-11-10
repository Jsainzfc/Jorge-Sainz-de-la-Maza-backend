import { UserManager } from '../dao/factory.js'

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

const deleteByEmail = async (req, res) => {
  const { email } = req.body
  try {
    await userManager.deleteByEmail(email)
    return res.status(200).json({ message: 'User deleted' })
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

export { updateToPremium, deleteByEmail, uploadDocuments }
