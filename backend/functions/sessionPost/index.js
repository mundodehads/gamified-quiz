exports.handler = async (event) => {
  const crypto = require('crypto')
  const DynamoDB = require('aws-sdk/clients/dynamodb')
  const dynamo = new DynamoDB.DocumentClient()

  try {
    const params = defineParamsToPutASession()
    await dynamoPut(params)

    return {
      statusCode: 200,
      body: JSON.stringify({
        sessionId: params.Item.sessionId
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
    return {
      TableName: 'Session',
      Item: {
        sessionId: generateUUID(),
        name: event.body.name,
        createdAt: new Date().toISOString()
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
