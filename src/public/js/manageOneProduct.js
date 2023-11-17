/* eslint-disable no-undef */

const form = document.querySelector('form')

form.addEventListener('submit', async (event) => {
  console.log(form.dataset)
  const { email, role, productid } = form.dataset
  event.preventDefault()
  const title = form.querySelector('#title').value
  const description = form.querySelector('#description').value
  const code = form.querySelector('#code').value
  const price = form.querySelector('#price').value
  const status = form.querySelector('#status').value
  const thumbnails = form.querySelectorAll('#thumbnails input')
  const thumbs = []
  thumbnails.forEach(thumb => {
    thumbs.push(thumb.value)
  })
  const stock = form.querySelector('#stock').value
  let response
  try {
    if (form.classList.contains('edit')) {
      response = await fetch(`${window.location.origin}/api/products/${productid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: {
            title,
            description,
            code,
            price,
            status,
            thumbnails: thumbs,
            stock
          },
          user: {
            email,
            role
          }
        })
      })
    } else {
      response = await fetch(`${window.location.origin}/api/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: {
            title,
            description,
            code,
            price,
            status,
            thumbnails: thumbs,
            stock
          },
          user: {
            email,
            role
          }
        })
      })
    }
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Ok',
        text: 'Product updated'
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
