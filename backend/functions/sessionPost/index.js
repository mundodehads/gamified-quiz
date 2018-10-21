exports.handler = async (event) => {
  const crypto = require('crypto')
  const DynamoDB = require('aws-sdk/clients/dynamodb')
  const dynamo = new DynamoDB.DocumentClient()

  try {
    const sessionParams = defineParamsToPutASession()
    await dynamoPut(sessionParams)

    return {
      statusCode: 200,
      body: JSON.stringify({
        sessionId: sessionParams.Item.sessionId
      })
    }
  } catch (error) {
    console.log(error.name)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message })
    }
  }

  function defineParamsToPutASession () {
    const now = new Date()

    return {
      TableName: 'Session',
      Item: {
        sessionId: generateUUID(),
        name: event.body.name,
        createdAt: now.toISOString(),
        practiceTimes: 0,
        cards: {
          playedTimes: 0,
          achievementsAcquired: 0,
          coinBalance: 0
        },
        barChart: {
          labels: [now.toISOString().split('T')[0]],
          data: [0]
        },
        achievements: [
          { title: 'PRATICOU 5 VEZES', description: 'Conquista para quem completou 5 exercícios', acquired: false, rarity: 1 },
          { title: 'PRATICOU 10 VEZES', description: 'Conquista para quem completou 10 exercícios', acquired: false, rarity: 2 },
          { title: 'PRATICOU 15 VEZES', description: 'Conquista para quem completou 15 exercícios', acquired: false, rarity: 3 },
          { title: 'PRATICOU 20 VEZES', description: 'Conquista para quem completou 20 exercícios', acquired: false, rarity: 4 }
        ],
        taks: [
          {
            category: 'PROPOSIÇÕES',
            title: 'Lista de exercícios 1 para treinar proposições',
            points: 0,
            maxPoints: 100,
            questions: [
              {
                question: 'Das frases abaixo, a única que representa uma proposição é:',
                possibleAnswers: [
                  'Que frio!',
                  'Você foi à aula ontem?',
                  'Ele trabalhou durante todo o evento ontem.',
                  'Carlos é um menino alto.'
                ],
                answer: 3,
                points: 10
              }
            ]
          }
        ]
      }
    }
  }

  function dynamoPut (params) {
    return new Promise((resolve, reject) => {
      dynamo.put(params, (err, data) => {
        if (err) return reject(err)
        console.log('dynamoPut', data)
        return resolve(data)
      })
    })
  }

  function generateUUID () {
    const bytes = crypto.randomBytes(16)
    bytes[6] = (bytes[6] & 15) | 64
    bytes[8] = (bytes[8] & 63) | 128

    const byteToHex = []
    for (var x = 0; x < 256; x++) {
      byteToHex.push((x + 256).toString(16).substr(1))
    }

    return ([
      byteToHex[bytes[0]], byteToHex[bytes[1]], byteToHex[bytes[2]],
      byteToHex[bytes[3]],
      '-',
      byteToHex[bytes[4]], byteToHex[bytes[5]],
      '-',
      byteToHex[bytes[6]], byteToHex[bytes[7]],
      '-',
      byteToHex[bytes[8]], byteToHex[bytes[9]],
      '-',
      byteToHex[bytes[10]], byteToHex[bytes[11]], byteToHex[bytes[12]],
      byteToHex[bytes[13]], byteToHex[bytes[14]], byteToHex[bytes[15]]
    ]).join('')
  }
}
