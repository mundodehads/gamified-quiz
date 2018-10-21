exports.handler = async (event) => {
  const DynamoDB = require('aws-sdk/clients/dynamodb')
  const dynamo = new DynamoDB.DocumentClient()

  try {
    const achievements = await getAchievements()
    return {
      statusCode: 200,
      body: JSON.stringify(achievements)
    }
  } catch (error) {
    console.log(error.name)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message })
    }
  }

  function getAchievements () {
    return new Promise((resolve, reject) => {
      dynamo.get({
        TableName: 'Session',
        Key: { sessionId: event.pathParameters.sessionId },
        AttributesToGet: ['achievements', 'name'],
        Select: 'SPECIFIC_ATTRIBUTES'
      }, (error, data) => {
        if (error) reject(error)
        resolve(data.Item)
      })
    })
  }
}
