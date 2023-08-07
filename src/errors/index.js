class NotEnoughStock extends Error {
  constructor (message) {
    super(message)
    this.name = 'NotEnoughStock'
  }
}

export { NotEnoughStock }
