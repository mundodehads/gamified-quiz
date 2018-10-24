sessionStorage.clear()

function login () {
  const formArray = $('#loginForm').serializeArray()
  const formData = {}
  for (let data of formArray) {
    formData[data.name] = data.value
  }

  fetch('https://df0d3wv4t9.execute-api.us-east-1.amazonaws.com/prod/session', {
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
