let url = `https://df0d3wv4t9.execute-api.us-east-1.amazonaws.com/prod/session/${sessionStorage.getItem('sessionId')}/achievements`

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

    for (let achievement of data.achievements) {
      $('#achievements').append(getAchievementModel(achievement))
    }
  })
  .catch(error => {
    alert(error.message)
  })

function getAchievementModel (achievement) {
  return {
    1: `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card${achievement.acquired ? '' : ' desabilitado'}">
            <div class="card-header">
              <h4>${achievement.title}</h4>
            </div>
            <div class="card-body">
              <div class="card-icon">
                  <i class="ion ion-ios-star"></i>
              </div>
            </div>
            <div class="card-footer">
              ${achievement.description}
            </div>
        </div>
      </div>
    `,
    2: `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card card-primary${achievement.acquired ? '' : ' desabilitado'}">
          <div class="card-header">
            <h4>${achievement.title}</h4>
          </div>
          <div class="card-body">
            <div class="card-icon bg-primary">
              <i class="ion ion-ios-star"></i>
            </div>
          </div>
          <div class="card-footer">
            ${achievement.description}
          </div>
        </div>
      </div>
    `,
    3: `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card card-info${achievement.acquired ? '' : ' desabilitado'}">
          <div class="card-header">
            <h4>${achievement.title}</h4>
          </div>
          <div class="card-body">
            <div class="card-icon bg-info">
              <i class="ion ion-ios-star"></i>
            </div>
          </div>
          <div class="card-footer">
            ${achievement.description}
          </div>
        </div>
      </div>
    `,
    4: `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card card-warning${achievement.acquired ? '' : ' desabilitado'}">
          <div class="card-header">
            <h4>${achievement.title}</h4>
          </div>
          <div class="card-body">
            <div class="card-icon bg-warning">
              <i class="ion ion-ios-star"></i>
            </div>
          </div>
          <div class="card-footer">
            ${achievement.description}
          </div>
        </div>
      </div>
    `
  }[achievement.rarity]
}
