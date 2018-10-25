let url = `https://df0d3wv4t9.execute-api.us-east-1.amazonaws.com/prod/session/${sessionStorage.getItem('sessionId')}/dashboard`

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`[${response.status}] /${crud.path}`)
    }
    return response.json()
  })
  .then(data => {
    if (data.error) throw new Error(data.error)

    $('#nameUser').append(data.name)
    $('#nameLogout').append(data.name)
    $('#achievementsAcquired').append(`${data.cards.achievementsAcquired}`)
    $('#playedTimes').append(`${data.cards.playedTimes}`)
    $('#coinBalance').append(`${data.cards.coinBalance}`)

    const context = document.getElementById("myChart").getContext('2d');

    const chartData = [0].concat(data.barChart.data)

    const firstLabelDate = new Date(data.barChart.labels[0])
    firstLabelDate.setDate(firstLabelDate.getDate() - 1)
    const chartLabels = [firstLabelDate.toISOString().substr(0, 10)].concat(data.barChart.labels)

    new Chart(context, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Pontuação máxima diária',
          data: chartData,
          borderWidth: 2,
          backgroundColor: 'rgb(87,75,144)',
          borderColor: 'rgb(87,75,144)',
          borderWidth: 2.5,
          pointBackgroundColor: '#ffffff',
          pointRadius: 4
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 10
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
      }
    })
  })
  .catch(error => {
    alert(error.message)
  })
