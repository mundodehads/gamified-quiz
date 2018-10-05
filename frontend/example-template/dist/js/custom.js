/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 * 
 */

function login () {
  console.log('oioi')
  sessionStorage.setItem('email', $('#email').val())
  sessionStorage.setItem('password', $('#password').val())
  getLogin()
}

function getLogin () {
  console.log('\n\n\n')
  console.log(sessionStorage.getItem('email'))
  console.log('\n\n\n')
  console.log(sessionStorage.getItem('password'))
  console.log('\n\n\n')
}
