exports.handler = async (event) => {
  try {
    justALog(event.body.message)
    return {
      statusCode: 200,
      body: JSON.stringify({})
    }
  } catch (error) {
    console.log(error.name)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message })
    }
  }

  function justALog (message) {
    if (!message) {
      const missingMessageError = new Error('Invalid request body')
      missingMessageError.name = 'INVALID_REQUEST_BODY'
      throw missingMessageError
    }
    console.log('The example says: ', message)
  }
}
