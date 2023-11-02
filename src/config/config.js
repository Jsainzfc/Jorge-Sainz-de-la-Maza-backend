import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()
program.option('--mode <mode>', 'Environment', 'development')
program.parse()

dotenv.config({
  path: program.opts().mode === 'development'
    ? './.env.development'
    : program.opts().mode === 'testing'
      ? './.env.test'
      : './.env.production'
})

export const config = {
  mongodb: process.env.MONGODB,
  mongotestdb: process.env.MONGOTESTDB,
  port: process.env.PORT,
  cookiesecret: process.env.COOKIESECRET,
  adminmail: process.env.ADMINMAIL,
  adminpassword: process.env.ADMINPASSWORD,
  github_app_id: process.env.GITHUB_APP_ID,
  github_client_id: process.env.GITHUB_CLIENT_ID,
  github_client_secret: process.env.GITHUB_CLIENT_SECRET,
  jwt_secret: process.env.JWT_SECRET,
  persistance: process.env.PERSISTANCE,
  mode: program.opts().mode,
  mailpass: process.env.MAIL_PASS,
  clienturl: process.env.CLIENT_URL
}
