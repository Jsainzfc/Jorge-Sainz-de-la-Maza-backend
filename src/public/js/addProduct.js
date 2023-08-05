const minus = document.querySelectorAll('.minusOne')
const plus = document.querySelectorAll('.plusOne')
const addToCart = document.querySelectorAll('.itemCount__add-to-cart')
let cartId

const initialiseCart = async () => {
  let id = sessionStorage.getItem('cartId')
  if (!id) {
    const response = await fetch('http://localhost:8080/api/carts/', {
      method: 'POST'
    })
    const data = await response.json()
    id = data.cart.id
  }
  cartId = id
  sessionStorage.setItem('cartId', cartId)
}

minus.forEach(minusButton => {
  minusButton.addEventListener('click', () => {
    const amount = minusButton.nextElementSibling
    let quantity = Number(amount.innerHTML)
    if (quantity > 1) {
      quantity--
      amount.innerHTML = `${quantity}`
    }
  })
})

plus.forEach(plusButton => {
  plusButton.addEventListener('click', () => {
    const id = plusButton.id
    const amount = document.querySelector(`.amount-${id}`)
    const stock = Number(document.querySelector(`.product-${id}`).dataset.stock)
    let quantity = Number(amount.innerHTML)
    if (quantity >= 1 && quantity < stock) {
      quantity++
      amount.innerHTML = `${quantity}`
    }
  })
})

addToCart.forEach(button => {
  button.addEventListener('click', async () => {
    const id = button.id
    const quantity = document.querySelector(`.amount-${id}`)
    try {
      const response = await fetch(`http://localhost:8080/api/carts/${cartId}/product/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({quantity: Number(quantity.innerHTML)})
      })
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Ok',
          text: 'Product added to cart',
          footer: `<a href='http://localhost:8080/cart/${cartId}'>See cart</a>`
        })
      } else {
        const {message} = await response.json()
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message
        })
      }
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      })
    }
  })
})

initialiseCart()
