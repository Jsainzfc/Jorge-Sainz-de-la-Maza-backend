import mongoose from 'mongoose'

const messagesCollection = 'messages'

const messageSchema = new mongoose.Schema({
  user: String,
  date: Date,
  message: String
})

export const messageModel = mongoose.model(messagesCollection, messageSchema)
