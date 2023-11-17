const forms = document.querySelectorAll('form')

forms.forEach(form => {
  const id = form.dataset.id
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      const list = document.querySelector('ul')
      const userToRemove = document.querySelector(`.id-${id}`)
      list.removeChild(userToRemove)
    }
  })
})
