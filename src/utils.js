import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import nodemailer from 'nodemailer'
import { config } from './config/config.js'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

export const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: 'jsainzfc@gmail.com',
    pass: config.mailpass
  }
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destination = '/public'
    const { fieldname } = file
    if (fieldname === 'profile-picture') {
      destination = destination + '/img/profiles'
    } else if (fieldname === 'product-picture') {
      destination = destination + '/img/products'
    } else if (fieldname === 'identification' || fieldname === 'address' || fieldname === 'account') {
      destination = destination + '/documents'
    } else {
      destination = destination + '/others'
    }
    cb(null, join(__dirname, destination))
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/:/g, '-')}`)
  }
})

export const uploader = multer({ storage })
