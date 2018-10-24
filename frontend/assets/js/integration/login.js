sessionStorage.clear()

function login () {
  const formArray = $('#loginForm').serializeArray()
  const formData = {}
  for (let data of formArray) {
    formData[data.name] = data.value
  }

  const url = BASE_PATH + '/session'

  fetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(formData)
  })
    .then(response => {
      console.log(response)
      if (!response.ok) {
        throw new Error(`[${response.status}] ${url}`)
      }

      return response.json()
    })
    .then(data => {
      if (data.error) throw new Error(data.error)

      sessionStorage.setItem('sessionId', data.sessionId)
      window.location.replace('/dashboard.html')
    })
    .catch(error => {
      alert(error.message)
    })
}
