import express from 'express'
// import binance from 'binance'

const app = express()

app.get('/', (req, res) => res.send('Hello bab!'))

app.listen(3000, () => console.log('listening on port 3000, bich'))
