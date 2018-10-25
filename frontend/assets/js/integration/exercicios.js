let url = `https://df0d3wv4t9.execute-api.us-east-1.amazonaws.com/prod/session/${sessionStorage.getItem('sessionId')}/tasks`
let tasks = []
let cards = {}

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`[${response.status}] /${url}`)
    }
    return response.json()
  })
  .then(data => {
    if (data.error) throw new Error(data.error)

    $('#nameUser').append(data.name)
    $('#nameLogout').append(data.name)

    cards = data.cards
    tasks.push(...data.tasks)

    for (let i = 0; i < data.tasks.length; i++) {
      $('#tasks').append(`
        <div class="col-12 col-sm-6 col-lg-3">
          <a class="ex1" onClick="openModal('${i}');">
            <div class="card card-dark">
              <div class="card-header">
                <h4>${data.tasks[i].category}</h4>
                <small>Maior Pontuação ${data.tasks[i].points}/${data.tasks[i].maxPoints}</small>
              </div>
              <div class="card-bodyex">
                <div class="card-icon bg-dark">
                  <i class="ion ion-ios-list-outline"></i>
                </div>
              </div>
              <div class="card-footer">
                ${data.tasks[i].title}
              </div>
            </div>
          </a>
        </div>
      `)
    }
  })
  .catch(error => {
    alert(error.message)
  })

function openModal (index) {
  $('#taskModalHead').empty().append(`
    <h5 class="modal-title" id="taskModalLabel">${tasks[index].title}</h5>
    <div onClick="tip();" class="pull-right" id="btnDica">
      <i class="ion ios-bulb-outline"></i> Dica</div>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick="closeModal()">
      <span aria-hidden="true">&times;</span>
    </button>
  `)
  $('#taskModalDica').empty().append(tasks[index].tip)

  $('#taskModalBody').empty()
  const questions = tasks[index].questions
  for (let i = 0; i < questions.length; i++) {
    $('#taskModalBody').append(`
      <form class="questao${i === 0 ? '' : ' escondido'}" id="q${i}" data-question="${i}">
        <div class="pergunta">
          ${questions[i].question}
        </div>
        <ul class="top-20 sem-estilo">
          <li class="col-10 alternativa">
            <div class="radio" name="q0" value="0">
              <label>
                <input type="radio" name="o0" value="0" checked="">
                <span class="cr">
                  <i class="cr-icon fa fa-circle"></i>
                </span>
                ${questions[i].possibleAnswers[0]}
              </label>
            </div>
          </li>
          <li class="col-10 alternativa">
            <div class="radio" name="q1" value="1">
              <label>
                <input type="radio" name="o0" value="1" checked="">
                <span class="cr">
                    <i class="cr-icon fa fa-circle"></i>
                </span>
                ${questions[i].possibleAnswers[1]}
              </label>
            </div>
          </li>
          <li class="col-10 alternativa">
            <div class="radio" name="q2" value="2">
              <label>
                <input type="radio" name="o0" value="2" checked="">
                <span class="cr">
                    <i class="cr-icon fa fa-circle"></i>
                </span>
                ${questions[i].possibleAnswers[2]}
              </label>
            </div>
          </li>
          <li class="col-10 alternativa">
            <div class="radio" name="q3" value="3">
              <label>
                <input type="radio" name="o0" value="3" checked="">
                <span class="cr">
                    <i class="cr-icon fa fa-circle"></i>
                </span>
                ${questions[i].possibleAnswers[3]}
              </label>
            </div>
          </li>
        </ul>
        <div class="btn btn-orange" onClick="${i === (questions.length - 1) ? `end('${index}');">Enviar` : 'next();">Proximo'}</div>
      </form>
    `)
  }

  $('#taskModal').modal('show')
}

function closeModal () {
  $("#taskModal").modal("hide");
}

let isTipUsed = false
function tip () {
  if (!isTipUsed &&
    cards.coinBalance >= 10 &&
    confirm('Habilitar a dica irá lhe custar 10 MOEDAS, deseja continuar?')
  ){
    isTipUsed = true
    
    const url = `https://df0d3wv4t9.execute-api.us-east-1.amazonaws.com/prod/session/${sessionStorage.getItem('sessionId')}`
    fetch(url, {
      method: 'put',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        coins: -10
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`[${response.status}] /${url}`)
        }
        return response.json()
      })
      .then(data => {
        if (data.error) throw new Error(data.error)

        cards.coinBalance -= 10
        $("#taskModalDica").removeClass('escondido')
      })
      .catch(error => {
        alert(error.message)
      })
  }
}

let count = 0
function next () {
  $('#q' + count).addClass('escondido')
  count++
  $('#q' + count).removeClass('escondido')
}

function end (index) {
  const task = tasks[index]
  let score = 0
  for (let i = 0; i < task.questions.length; i++) {
    const formArray = $(`#q${i}`).serializeArray()
    for (let data of formArray) {
      if (task.questions[i].answer === +data.value) {
        score += task.questions[i].points
      }
    }
  }

  const url = `https://df0d3wv4t9.execute-api.us-east-1.amazonaws.com/prod/session/${sessionStorage.getItem('sessionId')}`
  fetch(url, {
    method: 'put',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      task: +index,
      score: score
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`[${response.status}] /${url}`)
      }
      return response.json()
    })
    .then(data => {
      if (data.error) throw new Error(data.error)
      if (data.achievementUnlock) alert('Você desbloqueou uma nova conquista!')

      window.location.replace('/exercicios.html')
    })
    .catch(error => {
      alert(error.message)
    })
}
