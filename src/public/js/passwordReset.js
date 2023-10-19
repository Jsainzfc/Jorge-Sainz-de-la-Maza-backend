const reset = document.querySelector('.password-reset')

const { token, id } = reset.dataset

const form = reset.querySelector('form')

form.addEventListener('submit', async () => {
  const password = form.querySelector('#password')
  const passwordRepeat = form.querySelector('#passwordRepeat')
  if (password.value !== passwordRepeat.value) {
    passwordRepeat.setCustomValidity('Passwords must match')
  } else {
    const response = await fetch(`http://localhost:8080/passwordReset?token=${token}&id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: password.value })
    })

    if (response.ok) {
    // eslint-disable-next-line no-undef
      Swal.fire({
        icon: 'success',
        title: 'Ok',
        text: 'Password change successful',
        footer: '<a href=\'http://localhost:8080/login\'>Go back to login</a>'
      })
    } else {
      const { message } = await response.json()
      // eslint-disable-next-line no-undef
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
      })
    }
  }
})
