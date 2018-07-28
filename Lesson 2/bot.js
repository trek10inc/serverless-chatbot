'use strict'

const https = require('https')
const qs = require('querystring')

module.exports.endpoint = (event, context, callback) => {
  console.log('Received event', event)

  const request = {
    token: 'xoxb-1234567890121-AaaAAaa123'
  }

  const url = 'https://slack.com/api/users.list?' + qs.stringify(request)

  https.get(url, (res) => {
    res.setEncoding('utf8')
    let rawData = ''
    res.on('data', (chunk) => { rawData += chunk })
    res.on('end', () => {
      try {
        console.log(JSON.parse(rawData))
      } catch (err) {
        console.log('Error', err)
      }
    })
  })
}
