exports.handler = async (event) => {
  const DynamoDB = require('aws-sdk/clients/dynamodb')
  const dynamo = new DynamoDB.DocumentClient()

  try {
    const session = await getSession()
    const sessionParams = defineParamsToUpdateASession(session)
    await dynamoUpdate(sessionParams)

    const response = await isThereAnyAchievementUnlocked(session)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(response)
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: error.message })
    }
  }

  function getSession () {
    return new Promise((resolve, reject) => {
      dynamo.get({
        TableName: 'Session',
        Key: { sessionId: event.pathParameters.sessionId },
        AttributesToGet: ['achievements', 'barChart', 'cards', 'tasks'],
        Select: 'SPECIFIC_ATTRIBUTES'
      }, (error, data) => {
        if (error) reject(error)
        resolve(data.Item)
      })
    })
  }

  function defineParamsToUpdateASession (getSession) {
    const now = new Date()
    const body = JSON.parse(event.body)

    const session = Object.assign({}, getSession)

    if (body.hasOwnProperty('coins')) {
      session.cards.coinBalance += body.coins
      return {
        Key: { sessionId: event.pathParameters.sessionId },
        TableName: 'Session',
        ExpressionAttributeValues: { ':cards': session.cards },
        UpdateExpression: 'set cards = :cards'
      }
    }

    if (body.hasOwnProperty('task') && body.hasOwnProperty('score')) {
      session.cards.playedTimes++

      const index = session.barChart.labels.indexOf(now.toISOString().split('T')[0])
      if (index === -1) {
        session.barChart.labels.push(now.toISOString().split('T')[0])
        session.barChart.data.push(body.score)
      } else {
        session.barChart.data[index] += body.score
      }

      if (body.score > session.tasks[body.task].points) {
        session.tasks[body.task].points = body.score
      }

      return {
        Key: { sessionId: event.pathParameters.sessionId },
        TableName: 'Session',
        ExpressionAttributeValues: {
          ':cards': session.cards,
          ':barChart': session.barChart,
          ':tasks': session.tasks
        },
        UpdateExpression: 'set cards = :cards, barChart = :barChart, tasks = :tasks'
      }
    }

    throw new Error('Necessários parametros para atualização')
  }

  function dynamoUpdate (params) {
    return new Promise((resolve, reject) => {
      dynamo.update(params, (err, data) => {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  }

  async function isThereAnyAchievementUnlocked (session) {
    let achievementUnlock = false

    for (let i = 1; i < session.achievements.length; i++) {
      if (session.cards.playedTimes >= (5 * i) &&
        !session.achievements[i].acquired
      ) {
        session.achievements[i].acquired = true
        session.cards.coinBalance += 10
        achievementUnlock = true
      }
    }

    if (achievementUnlock) {
      await dynamoUpdate({
        Key: { sessionId: event.pathParameters.sessionId },
        TableName: 'Session',
        ExpressionAttributeValues: {
          ':achievements': session.achievements,
          ':cards': session.cards
        },
        UpdateExpression: 'set achievements = :achievements, cards = :cards'
      })

      return { achievementUnlock }
    }

    return {}
  }
}
