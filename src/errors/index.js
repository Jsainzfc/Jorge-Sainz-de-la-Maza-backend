class ValidationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ValidationError'
  }
}

class NotEnoughStock extends ValidationError {
  constructor (message) {
    super(message)
    this.name = 'NotEnoughStock'
  }
}

class NotAllFields extends ValidationError {
  constructor (message) {
    super(message)
    this.name = 'NotAllFields'
  }
}

class InvalidField extends ValidationError {
  constructor (message) {
    super(message)
    this.name = 'InvalidField'
  }
}

class MongooseError extends Error {
  constructor (message) {
    super(message)
    this.name = 'MongooseError'
  }
}

class ItemNotFound extends Error {
  constructor (message) {
    super(message)
    this.name = 'ItemNotFound'
  }
}

export { NotEnoughStock, NotAllFields, InvalidField, ValidationError, MongooseError, ItemNotFound }
