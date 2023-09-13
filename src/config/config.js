import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()
program.option('--mode <mode>', 'Environment', 'development')
program.parse()

dotenv.config({
  path: program.opts().mode === 'development' ? './.env.development' : './.env.production'
})

export const config = {
  mongouser: process.env.MONGOUSER,
  mongopassword: process.env.MONGOPASSWORD,
  port: process.env.PORT,
  cookiesecret: process.env.COOKIESECRET,
  adminmail: process.env.ADMINMAIL,
  adminpassword: process.env.ADMINPASSWORD,
  github_app_id: process.env.GITHUB_APP_ID,
  github_client_id: process.env.GITHUB_CLIENT_ID,
  github_client_secret: process.env.GITHUB_CLIENT_SECRET,
  jwt_secret: process.env.JWT_SECRET
}
