'use strict'

const https = require('https')
const qs = require('querystring')

const directMention = new RegExp('^\<\@' + process.env.BOT_ID + '\>', 'i')

module.exports.endpoint = (event, context, callback) => {
  console.log('Received event', event)
  const request = JSON.parse(event.body)

  if (request.type === 'url_verification' &&
      request.token === process.env.VERIFICATION_TOKEN) {
    console.log('Verifying url')
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        'challenge': request.challenge
      })
    }
    return callback(null, response)
  }
  if (request.event.text.match(directMention)) {
    console.log('Echoing message back to slack')
    const response = {
      token: process.env.BOT_ACCESS_TOKEN,
      channel: request.event.channel,
      text: request.event.text.replace(directMention, '') + ' [' + Date.now() + ']'
    }
    const URL = process.env.POST_MESSAGE_URL + qs.stringify(response)

    https.get(URL, (res) => {
      const statusCode = res.statusCode
      console.log(directMention, request.event.text.replace(directMention, ''), statusCode)
      if (statusCode !== 200) {
        console.log(res)
      }
      callback(null, { statusCode: 200 })
    })
  }
}
