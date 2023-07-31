// eslint-disable-next-line no-undef
const socket = io() // Start connection with socket server

socket.on('new_product', data => {
  console.log('Producto nuevo', data)

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
  console.log('Eliminado producto con id: ', id)
  const productRemoved = document.getElementById(`${id}`)
  productRemoved.parentElement.removeChild(productRemoved)
})
