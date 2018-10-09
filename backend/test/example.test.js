const expect = require('chai').expect
const { describe, it } = require('mocha')

describe('Example function', (done) => {
  const exampleFunction = require('../functions/example/')
  const exampleMock = require('./mock/example.mock')

  it('Should get status 200', (done) => {
    exampleFunction.handler(exampleMock.valid)
      .then(result => {
        expect(result.statusCode).to.equal(200)
        done()
      })
      .catch(error => {
        console.log(error.message)
        done(error)
      })
  })

  it('Should get status 400', (done) => {
    exampleFunction.handler(exampleMock.invalid)
      .then(result => {
        expect(result.statusCode).to.equal(400)
        done()
      })
      .catch(error => {
        console.log(error.message)
        done(error)
      })
  })
})
