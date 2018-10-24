let url = `https://df0d3wv4t9.execute-api.us-east-1.amazonaws.com/prod/session/session/${sessionStorage.getItem('sessionId')}/dashboard`

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`[${response.status}] /${crud.path}`)
    }
    return response.json()
  })
  .then(data => {
    if (data.error) throw new Error(data.error)
    console.log(data)
  })
  .catch(error => {
    alert(error.message)
  })
