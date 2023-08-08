// eslint-disable-next-line no-undef
const socket = io() // Start connection with socket server

socket.on('new_product', data => {
  const newItem =
  ` <li id='${data.id}'>
        <p><b>Título:</b> ${data.title}</p>
        <p><b>Descripción:</b> ${data.description}</p>
        <p><b>Precio:</b> ${data.price}€</p>
        <p><b>Stock:</b> ${data.stock}</p>
    </li>
  `

  const listOfProducts = document.querySelector('.products-list')
  listOfProducts.innerHTML = listOfProducts.innerHTML + newItem
})

socket.on('product_deleted', id => {
  const productRemoved = document.getElementById(`${id}`)
  productRemoved.parentElement.removeChild(productRemoved)
})

socket.on('product_updated', ({ id, product }) => {
  const productUpdated = document.getElementById(`${id}`)
  const newItem =
  `
        <p><b>Título:</b> ${product.title}</p>
        <p><b>Descripción:</b> ${product.description}</p>
        <p><b>Precio:</b> ${product.price}€</p>
        <p><b>Stock:</b> ${product.stock}</p>

  `
  productUpdated.innerHTML = newItem
})

socket.on('cart_updated', ({ cid, products }) => {
  const cartItems = document.querySelector('.cart__items')
  let cartItemsHTML = ''
  for (const product of products) {
    const newItem = `
      <li id="${product.id}">
          <p><b>Product:</b> ${product.title}</p>
          <p><b>Quantity:</b> ${product.quantity}</p>
          <p><b>Price:</b> ${product.price}</p>
      </li>`
    cartItemsHTML = cartItemsHTML + newItem
  }
  cartItems.innerHTML = cartItemsHTML
})
