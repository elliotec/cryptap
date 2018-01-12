import express from 'express'
import http from 'http'
import es6Renderer from 'express-es6-template-engine'
import binanceApi from 'binance'
import socketIo from 'socket.io'
import fetch from 'node-fetch'
import deepEqual from 'deep-equal'
// import nodemailer from 'nodemailer'

const state = {}
state.alerts = {}
const binance = new binanceApi.BinanceWS()
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const topHundredCoins = 'https://api.coinmarketcap.com/v1/ticker/'

app.engine('html', es6Renderer)
app.set('views', 'views')
app.set('view engine', 'html')
app.use(express.static('lib'))

app.get('/', (req, res) => res.render('index', {
  locals: { title: 'coinage', state }
}))

app.post('/form', (req, res) => {
  res.send('You sent the name "' + req.body.name + '".')
})

io.on('connection', (socket) => {
  fetch(topHundredCoins)
    .then((res) => res.json())
    .then((json) => getRealTimeCoinData(json))

  function getRealTimeCoinData (data) {
    state.symbols = data.map((coin) => coin.symbol)
    data.map((coin) => {
      const symbol = coin.symbol
      state[symbol] = {}
      return binance.onKline(`${symbol}ETH`, '5m', (data) => {
        if (state[symbol] && !deepEqual(state[symbol], {...data.kline})) {
          state[symbol] = {...data.kline}
        }
        const open = state[symbol].open
        const close = state[symbol].close
        const change = (close - open) / open * 100
        const roundedChange = Number.parseFloat(change).toPrecision(4)
        state[symbol].percentChange = roundedChange

        if (roundedChange > 3) {
          state[symbol].alert = {
            message: `${symbol} has INCREASED ${roundedChange}% in the last 5 minutes`,
            symbol,
            roundedChange
          }
        } else if (roundedChange < -3) {
          state[symbol].alert = {
            message: `${symbol} has DECREASED ${roundedChange}% in the last 5 minutes`,
            symbol,
            roundedChange
          }
        }

        if (state[symbol].alert) {
          state.alerts = {...state.alerts, ...state[symbol].alert}
          console.log(state[symbol].alert)
        }

        socket.emit('broadcast', state)
      })
    })
  }
})

server.listen(3000)
