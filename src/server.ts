import express from 'express'
import payload from 'payload'
import cors from 'cors'
import path from 'path'

require('dotenv').config()
const app = express()

const corsOptions = {
  origin: 'http://localhost:4200',
}

app.use(cors(corsOptions))

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

app.use('/media', express.static(path.join(__dirname, 'media')));


const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  // Add your own express routes here

  app.listen(3000, async () => {
    payload.logger.info(`Server running at http://localhost:3000`)
  },)
}

start()
