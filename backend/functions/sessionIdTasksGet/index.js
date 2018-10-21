exports.handler = async (event) => {
  const DynamoDB = require('aws-sdk/clients/dynamodb')
  const dynamo = new DynamoDB.DocumentClient()

  try {
    const tasks = await getTasks()
    return {
      statusCode: 200,
      body: JSON.stringify(tasks)
    }
  } catch (error) {
    console.log(error.name)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message })
    }
  }

  function getTasks () {
    return new Promise((resolve, reject) => {
      dynamo.get({
        TableName: 'Session',
        Key: { sessionId: event.pathParameters.sessionId },
        AttributesToGet: ['tasks', 'name'],
        Select: 'SPECIFIC_ATTRIBUTES'
      }, (error, data) => {
        if (error) reject(error)
        resolve(data.Item)
      })
    })
  }
}
