const { buildAccountCreator } = require('../index')
const twoCaptchaApiKey = 'YOUR_TWO_CAPTCHA_API_KEY'

const accountCreator = buildAccountCreator(twoCaptchaApiKey)

/**
 * Creates an account by generating a random email/password and birthday.
 */
function withRandomCredentials () {
  accountCreator.register().then(({ credentials, birthday }) => {
    console.log(`We registered ${credentials.email} with ${credentials.password}. Birthday: ${birthday}`)
  }).catch(error => {
    console.log(error)
  })
}

// Uncomment the line below to run the example
// withRandomCredentials()

/**
 * Creates an account using the specified email/password and generating a birthday.
 */
function withSpecifiedCredentials () {
  accountCreator.register({
    email: 'example@gmail.com',
    password: 'examplepassword'
  }).then(response => {
    console.log(response)
  }).catch(error => {
    console.log(error)
  })
}

// withSpecifiedCredentials()

/**
 * Creates an account using the specified email/password/birthday,
 * and the specified socks5 proxy.
 */
function withProxy () {
  accountCreator.register({
    // email: 'example@gmail.com',
    password: 'examplepassword',
    proxy: 'socks5://username:password@127.0.0.1:1080'
  }).then(response => {
    console.log(response)
  }).catch(error => {
    console.log(error)
  })
}

// withProxy()

/**
 * Big fan of async/await? We've got you covered!
 */
async function example1 () {
  try {
    const { credentials, birthday } = await accountCreator.register({
      // email: 'example@example.com',
      password: 'pass43594word'
    })

    console.log(`We registered an account! creds=(${credentials}) bday=${birthday.toLocaleString()}`)
  } catch (e) {
    console.error('Something went wrong with our registration attempt!', e)
  }
}

//(async () => { await example1() })()
