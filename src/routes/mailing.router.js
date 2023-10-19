import { Router } from 'express'
import nodemailer from 'nodemailer'
import { config } from '../config/config.js'

const router = Router()

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: 'jsainzfc@gmail.com',
    pass: config.mailpass
  }
})

router.get('/mail', async (req, res) => {
  const result = await transport.sendMail({
    from: 'Jorge Sainz <jsainzfc@gmail.com>',
    to: 'bodybluebloody@gmail.com',
    subject: 'Pass recovery',
    html: `
    <div>
      <h1>Pass Recovery</h1>
    </div>
    `,
    attachments: []
  })
  res.send(result)
})

export default router
