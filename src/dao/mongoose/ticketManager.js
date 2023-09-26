import { ticketModel } from '../../models/tickets.model.js'
import { MongooseError } from '../../errors/index.js'

// Class for managing the ticket Model in mongoose
class TicketManager {
  // Creates a new empty cart in the database
  // Might throw an instance of MongooseError if there is any problem creating the document in the database
  async create ({ ticket }) {
    try {
      const ticketcreated = await ticketModel.create(ticket)
      return ticketcreated._id
    } catch (err) {
      throw new MongooseError(err.message)
    }
  }
}

export { TicketManager }
