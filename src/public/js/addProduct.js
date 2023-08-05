import axios from 'axios'

const minus = document.querySelectorAll('.minusOne')
const plus = document.querySelectorAll('.plusOne')
const addToCart = document.querySelectorAll('.itemCount__add-to-cart')

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
    await axios.post('http://localhost:8080/api/carts/')
    console.log('Añadir al carrito ' + Number(quantity.innerHTML))
    quantity.innerHTML = '1'
  })
})
