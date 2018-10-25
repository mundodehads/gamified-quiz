exports.handler = async (event) => {
  const DynamoDB = require('aws-sdk/clients/dynamodb')
  const dynamo = new DynamoDB.DocumentClient()

  try {
    const dashboard = await getDashboard()
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(dashboard)
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

  function getDashboard () {
    return new Promise((resolve, reject) => {
      dynamo.get({
        TableName: 'Session',
        Key: { sessionId: event.pathParameters.sessionId },
        AttributesToGet: ['barChart', 'cards', 'name'],
        Select: 'SPECIFIC_ATTRIBUTES'
      }, (error, data) => {
        if (error) reject(error)
        resolve(data.Item)
      })
    })
  }
}
