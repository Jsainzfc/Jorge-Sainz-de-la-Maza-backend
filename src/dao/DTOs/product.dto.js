export default class ProductDTO {
  constructor (product) {
    this.id = product._id
    this.title = product.title
    this.description = product.description
    this.price = product.price
    this.thumbnails = product.thumbnails
    this.stock = product.stock
  }
}
