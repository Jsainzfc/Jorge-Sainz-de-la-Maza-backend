const trashIcons = document.querySelectorAll('.trash')
const cartId = document.querySelector('.cart').dataset.cart
const itemList = document.querySelector('.cart__items')

trashIcons.forEach(trash => {
  trash.addEventListener('click', async () => {
    const id = trash.dataset.id
    try {
      const response = await fetch(`http://localhost:8080/api/carts/${cartId}/product/${id}`, {
        method: 'DELETE'
      })
      const { products, total } = await response.json()
      const item = document.querySelector(`.item-${id}`)
      itemList.removeChild(item)
      document.querySelector('.cart__total').innerHTML = `Total: ${total ?? 0}€`
      if (products.length === 0) {
        const emptyItem = document.createElement('li')
        emptyItem.innerHTML = '<li><h2>Cart is empty</h2></li>'
        itemList.appendChild(emptyItem)
      }
    } catch (err) {
      console.error(err.message)
    }
  })
})

document.querySelector('.empty').addEventListener('click', async () => {
  try {
    await fetch(`http://localhost:8080/api/carts/${cartId}`, {
      method: 'DELETE'
    })
    itemList.innerHTML = `
      <li><h2>Cart is empty</h2></li>
      <li class="cart__total">Total: 0€</li>
      <button class="empty">Empty Cart</button>
    `
  } catch (err) {
    console.error(err.message)
  }
})
