import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
  code: String,
  createdAt: Date,
  purchaser: String,
  amount: Number
})

ticketSchema.plugin(mongoosePaginate)

const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export {ticketModel}
