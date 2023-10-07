import winston from 'winston'
import { config } from '../config/config.js'

const options = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    http: 'blue',
    debug: 'white'
  }
}

const devLogger = winston.createLogger({
  levels: options.levels,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ colors: options.colors }),
        winston.format.simple()
      )
    })
  ]
})

const prodLogger = winston.createLogger({
  levels: options.levels,
  transports: [
    new winston.transports.Console({
      level: 'http',
      format: winston.format.combine(
        winston.format.colorize({ colors: options.colors }),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: './errors.log',
      level: 'warning',
      format: winston.format.combine(
        winston.format.colorize({ colors: options.colors }),
        winston.format.simple()
      )
    })
  ]
})

export const addLogger = (req, res, next) => {
  req.logger = config.mode === 'development' ? devLogger : prodLogger
  req.logger.http(`${req.method} in ${req.url} - ${new Date().toLocaleTimeString()}`)
  next()
}
