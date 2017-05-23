require('dotenv').config()

const start = require('./app');

if (process.env.SLACK_BOT_TOKEN) {
  start()
}
