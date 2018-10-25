exports.handler = async (event) => {
  const crypto = require('crypto')
  const DynamoDB = require('aws-sdk/clients/dynamodb')
  const dynamo = new DynamoDB.DocumentClient()

  try {
    const sessionParams = defineParamsToPutASession()
    await dynamoPut(sessionParams)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        sessionId: sessionParams.Item.sessionId
      })
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

  function defineParamsToPutASession () {
    const now = new Date()
    const body = JSON.parse(event.body)

    return {
      TableName: 'Session',
      Item: {
        sessionId: generateUUID(),
        name: body.name,
        createdAt: now.toISOString(),
        cards: {
          playedTimes: 0,
          achievementsAcquired: 0,
          coinBalance: 10
        },
        barChart: {
          labels: [now.toISOString().split('T')[0]],
          data: [0]
        },
        achievements: [
          { title: 'PRIMEIRO LOGIN', description: 'Conquista para quem entrou pela primeira vez', acquired: true, rarity: 1 },
          { title: 'PRATICOU 5 VEZES', description: 'Conquista para quem completou 5 exercícios', acquired: false, rarity: 1 },
          { title: 'PRATICOU 10 VEZES', description: 'Conquista para quem completou 10 exercícios', acquired: false, rarity: 2 },
          { title: 'PRATICOU 15 VEZES', description: 'Conquista para quem completou 15 exercícios', acquired: false, rarity: 3 },
          { title: 'PRATICOU 20 VEZES', description: 'Conquista para quem completou 20 exercícios', acquired: false, rarity: 4 }
        ],
        tasks: [
          {
            category: 'PROPOSIÇÕES',
            title: 'Lista de exercícios 1 para treinar proposições',
            points: 0,
            maxPoints: 100,
            tip: `
              <p>| <b>~</b> | &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp NÃO &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp |
                <br/>| <b>?</b> |&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp E &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>V</b> &nbsp|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp OU &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>?</b> | se e somente se |
              </p>
            `,
            questions: [
              {
                question: `
                  1. Sejam as proposições:
                  <br/>
                  <b>p: Yoshi gosta de fruta. q: Yoshi é um dinossauro.</b>
                  <p>Qual alternativa abaixo traduz para a linguagem simbólica:
                    <br/>
                    <b>“Yoshi gosta de fruta e não é um dinossauro”:</b>
                  </p>
                `,
                possibleAnswers: [
                  'p ? ~q',
                  'p ? q',
                  '~p V ~q',
                  'p ? ~~q'
                ],
                answer: 0,
                points: 10
              }
            ]
          },
          {
            category: 'PROPOSIÇÕES',
            title: 'Lista de exercícios 1 para treinar proposições',
            points: 0,
            maxPoints: 100,
            tip: `
              <p>| <b>~</b> | &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp NÃO &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp |
                <br/>| <b>?</b> |&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp E &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>V</b> &nbsp|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp OU &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>?</b> | se e somente se |
              </p>
            `,
            questions: [
              {
                question: `
                  2. Sejam as proposições:
                  <br/>
                  <b>p: Kirby é rosa, q: Kirby é uma bolinha.</b>
                  <p>Qual alternativa abaixo traduz para a linguagem corrente:
                    <br/>
                    <b>“~p -> q”:</b>
                  </p>
                `,
                possibleAnswers: [
                  'Kirby não é rosa nem bolinha',
                  'kirby é rosa  ou é bolinha',
                  'Se kirby não é rosa então é bolinha',
                  'Kirby é rosa se e somente se não é bolinha'
                ],
                answer: 2,
                points: 10
              }
            ]
          },
          {
            category: 'PROPOSIÇÕES',
            title: 'Lista de exercícios 1 para treinar proposições',
            points: 0,
            maxPoints: 100,
            tip: `
              <p>| <b>~</b> | &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp NÃO &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp |
                <br/>| <b>?</b> |&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp E &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>V</b> &nbsp|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp OU &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>?</b> | se e somente se |
              </p>
            `,
            questions: [
              {
                question: `
                  3. Sejam as proposições:
                  <br/>
                  <b>p: Mario é um encanador, q: Sonic coleta moedas.</b>
                  <p>Qual alternativa abaixo traduz para a linguagem simbólica:
                    <br/>
                    <b>“Mario não é um encanador ou Sonic coleta moedas”:</b>
                  </p>
                `,
                possibleAnswers: [
                  '~~q',
                  '~p V q',
                  'p V q',
                  'q -> p'
                ],
                answer: 1,
                points: 10
              }
            ]
          },
          {
            category: 'PROPOSIÇÕES',
            title: 'Lista de exercícios 1 para treinar proposições',
            points: 0,
            maxPoints: 100,
            tip: `
              <p>| <b>~</b> | &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp NÃO &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp |
                <br/>| <b>?</b> |&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp E &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>V</b> &nbsp|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp OU &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>?</b> | se e somente se |
              </p>
            `,
            questions: [
              {
                question: `
                  4. Sejam as proposições:
                  <br/>
                  <b>p: Darius é fraco, q: Jinx é maníaca.</b>
                  <p>Qual alternativa abaixo traduz para a linguagem simbólica:
                    <br/>
                    <b>“Jinx não é maníaca ou Daruis é forte”:</b>
                  </p>
                `,
                possibleAnswers: [
                  '~~q ? p',
                  '~q V p',
                  '~q V ~p',
                  'q -> p'
                ],
                answer: 2,
                points: 10
              }
            ]
          },
          {
            category: 'PROPOSIÇÕES',
            title: 'Lista de exercícios 1 para treinar proposições',
            points: 0,
            maxPoints: 100,
            tip: `
              <p>| <b>~</b> | &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp NÃO &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp |
                <br/>| <b>?</b> |&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp E &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>V</b> &nbsp|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp OU &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>?</b> | se e somente se |
              </p>
            `,
            questions: [
              {
                question: `
                  5. Sejam as proposições:
                  <br/>
                  <b>p: Yoshi gosta de fruta, q: Mario é um encanador.</b>
                  <p>Qual alternativa abaixo traduz para a linguagem corrente:
                    <br/>
                    <b>“q V ~p”:</b>
                  </p>
                `,
                possibleAnswers: [
                  'Mario não é encanador e Yoshi gosta de fruta',
                  'Yoshi não gosta de fruta se e somente se Mario não é encanador',
                  'Yoshi gosta de fruta ou mario não é encanador',
                  'Mario é encanador ou yoshi não gosta de fruta'
                ],
                answer: 3,
                points: 10
              }
            ]
          },
          {
            category: 'PROPOSIÇÕES',
            title: 'Lista de exercícios 1 para treinar proposições',
            points: 0,
            maxPoints: 100,
            tip: `
              <p>| <b>~</b> | &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp NÃO &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp |
                <br/>| <b>?</b> |&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp E &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>V</b> &nbsp|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp OU &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>?</b> | se e somente se |
              </p>
            `,
            questions: [
              {
                question: `
                  6. Sejam as proposições:
                  <br/>
                  <b>p: Kirby é rosa, q: Kirby é uma bolinha.</b>
                  <p>Qual alternativa abaixo traduz para a linguagem simbólica:
                    <br/>
                    <b>“Kirby é rosa e não é uma bolinha”:</b>
                  </p>
                `,
                possibleAnswers: [
                  '~~p',
                  '~~p ? ~q',
                  'p ? q',
                  'q -> p'
                ],
                answer: 1,
                points: 10
              }
            ]
          },
          {
            category: 'PROPOSIÇÕES',
            title: 'Lista de exercícios 1 para treinar proposições',
            points: 0,
            maxPoints: 100,
            tip: `
              <p>| <b>~</b> | &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp NÃO &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp |
                <br/>| <b>?</b> |&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp E &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>V</b> &nbsp|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp OU &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>?</b> | se e somente se |
              </p>
            `,
            questions: [
              {
                question: `
                  7. Sejam as proposições:
                  <br/>
                  <b>p: Mario é um encanador, q: Sonic é azul.</b>
                  <p>Qual alternativa abaixo traduz para a linguagem simbólica:
                    <br/>
                    <b>“Mario é um encanador e Sonic não é azul”:</b>
                  </p>
                `,
                possibleAnswers: [
                  '~~q ? p',
                  'p ? ~q',
                  'p v q',
                  'q -> p'
                ],
                answer: 1,
                points: 10
              }
            ]
          },
          {
            category: 'PROPOSIÇÕES',
            title: 'Lista de exercícios 1 para treinar proposições',
            points: 0,
            maxPoints: 100,
            tip: `
              <p>| <b>~</b> | &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp NÃO &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp |
                <br/>| <b>?</b> |&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp E &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>V</b> &nbsp|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp OU &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>?</b> | se e somente se |
              </p>
            `,
            questions: [
              {
                question: `
                  8. Sejam as proposições:
                  <br/>
                  <b>p: Yoshi gosta de fruta, q: Yoshi é um dinossauro.</b>
                  <p>Qual alternativa abaixo traduz para a linguagem simbólica:
                    <br/>
                    <b>“Yoshi é um dinossauro, se e somente se come fruta”:</b>
                  </p>
                `,
                possibleAnswers: [
                  'q <-> p',
                  '~p v q',
                  'p v q',
                  'q -> ~p'
                ],
                answer: 0,
                points: 10
              }
            ]
          },
          {
            category: 'PROPOSIÇÕES',
            title: 'Lista de exercícios 1 para treinar proposições',
            points: 0,
            maxPoints: 100,
            tip: `
              <p>| <b>~</b> | &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp NÃO &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp |
                <br/>| <b>?</b> |&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp E &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>V</b> &nbsp|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp OU &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>?</b> | se e somente se |
              </p>
            `,
            questions: [
              {
                question: `
                  9. Sejam as proposições:
                  <br/>
                  <b>p: Mario é um encanador, q: Sonic coleta moedas.</b>
                  <p>Qual alternativa abaixo traduz para a linguagem simbólica:
                    <br/>
                    <b>“Mario é um encanador”:</b>
                  </p>
                `,
                possibleAnswers: [
                  '~~q',
                  '~p v q',
                  'p v ~~q',
                  '~~p'
                ],
                answer: 3,
                points: 10
              }
            ]
          },
          {
            category: 'PROPOSIÇÕES',
            title: 'Lista de exercícios 1 para treinar proposições',
            points: 0,
            maxPoints: 100,
            tip: `
              <p>| <b>~</b> | &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp NÃO &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp |
                <br/>| <b>?</b> |&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp E &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>V</b> &nbsp|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp OU &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|
                <br/>| <b>?</b> | se e somente se |
              </p>
            `,
            questions: [
              {
                question: `
                  10. Sejam as proposições:
                  <br/>
                  <b>p: Darius é fraco , q: Jinx é maníaca.</b>
                  <p>Qual alternativa abaixo traduz para a linguagem corrente:
                    <br/>
                    <b>“~( p v ~q )”:</b>
                  </p>
                `,
                possibleAnswers: [
                  'Darius é forte ou Jinx é maníaca',
                  'Darius é fraco ou Jinx não é maníaca',
                  'Darius é forte se e somente se Jinx é maníaca',
                  'Jinx é maníaca se Darius é fraco'
                ],
                answer: 0,
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
