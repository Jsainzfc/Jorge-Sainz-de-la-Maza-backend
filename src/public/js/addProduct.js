/* eslint-disable no-undef */
const cartId = document.querySelector('#cart_id').dataset.cart

document.querySelectorAll('.minusOne').forEach(minusButton => {
  minusButton.addEventListener('click', () => {
    const amount = minusButton.nextElementSibling
    let quantity = Number(amount.innerHTML)
    if (quantity > 1) {
      quantity--
      amount.innerHTML = `${quantity}`
    }
  })
})

document.querySelectorAll('.plusOne').forEach(plusButton => {
  plusButton.addEventListener('click', () => {
    const amount = document.querySelector(`.amount-${plusButton.id}`)
    const stock = Number(document.querySelector(`.product-${plusButton.id}`).dataset.stock)
    let quantity = Number(amount.innerHTML)
    if (quantity >= 1 && quantity < stock) {
      quantity++
      amount.innerHTML = `${quantity}`
    }
  })
})

document.querySelectorAll('.itemCount__add-to-cart').forEach(button => {
  button.addEventListener('click', async () => {
    const id = button.id
    const quantity = document.querySelector(`.amount-${id}`)
    try {
      const response = await fetch(`http://localhost:8080/api/carts/${cartId}/product/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: Number(quantity.innerHTML) })
      })
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Ok',
          text: 'Product added to cart',
          footer: `<a href='http://localhost:8080/cart/${cartId}'>See cart</a>`
        })
      } else {
        const { message } = await response.json()
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      })
    }
  })
})
