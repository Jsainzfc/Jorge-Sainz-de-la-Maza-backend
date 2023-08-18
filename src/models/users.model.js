import { Schema, model } from 'mongoose'

const schema = new Schema({
  firstname: String,
  lastname: { type: String, index: true },
  email: { type: String, index: true },
  password: String,
  role: { type: String, default: 'Customer' },
  age: { type: Number },
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'carts'
  }
})

const userModel = model('users', schema)

export { userModel }
