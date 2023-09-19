export default class UserDTO {
  constructor (user) {
    this.name = user.firstname + user.lastname
    this.email = user.email
    this.role = user.role
    this.age = user.age
  }
}
