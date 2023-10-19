/* eslint-disable no-undef */
const products = document.querySelectorAll('.product')

products.forEach((product) => {
  const id = product.dataset.id
  const remove = product.querySelector('.remove')

  remove.addEventListener('click', async () => {
    try {
      const response = await fetch(`${window.location.origin}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        product.parentElement.removeChild(product)
        Swal.fire({
          icon: 'success',
          title: 'Ok',
          text: 'Product removed'
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
