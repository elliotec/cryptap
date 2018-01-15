import express from 'express'
import http from 'http'
import es6Renderer from 'express-es6-template-engine'
import binanceApi from 'binance'
import socketIo from 'socket.io'
import fetch from 'node-fetch'
import deepEqual from 'deep-equal'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

const state = {}
state.alerts = {}
state.interval = '5m'
state.symbol = 'ETH'
state.percentChange = 2
const binance = new binanceApi.BinanceWS()
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const topHundredCoins = 'https://api.coinmarketcap.com/v1/ticker/'

dotenv.config()
app.engine('html', es6Renderer)
app.set('views', 'views')
app.set('view engine', 'html')
app.use(express.static('lib'))
app.use(express.json())

app.get('/', (req, res) => res.render('index', {
  locals: { title: 'coinage', state }
}))

app.post('/form', (req, res) => {
  console.log(req.body)
  state.interval = req.body.interval
  state.symbol = req.body.symbol
  state.percentChange = req.body.percentChange
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
      return binance.onKline(`${symbol}${state.symbol}`, `${state.interval}`, (data) => {
        if (state[symbol] && !deepEqual(state[symbol], {...data.kline})) {
          state[symbol] = {
            ...state[symbol],
            ...data.kline
          }
        }

        const open = state[symbol].open
        const close = state[symbol].close
        const change = (close - open) / open * 100
        const roundedChange = Number.parseFloat(change).toPrecision(3)
        const EMAIL_SEND_THRESHOLD = 5 * 60 * 1000
        state[symbol].percentChange = roundedChange

        if (roundedChange > state.percentChange || roundedChange < -(state.percentChange)) {
          state[symbol] = {
            ...state[symbol],
            alert: {
              message: `${symbol} has changed ${roundedChange}% in the last ${state.interval}`,
              symbol,
              roundedChange,
              timestamp: Date.now()
            }
          }
        }

        if (state[symbol].alert) {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'coinagenotifier@gmail.com',
              pass: process.env.COINAGE_EMAIL_PASS
            }
          })
          const mailOptions = {
            from: 'coinagenotifier@gmail.com',
            to: 'elliotecweb@gmail.com',
            subject: state[symbol].alert.message,
            text: `${state[symbol].alert.message}, so are you gonna do something about it?`
          }

          if (!state[symbol].emailSentTime) {
            const emailSentTime = Date.now()
            state[symbol] = {
              ...state[symbol],
              emailSentTime
            }
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) return console.error(error)
            })
          } else if (
            state[symbol].emailSentTime &&
            (Date.now() - state[symbol].emailSentTime) >= EMAIL_SEND_THRESHOLD
          ) {
            const emailSentTime = Date.now()
            state[symbol] = {
              ...state[symbol],
              emailSentTime
            }
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) return console.error(error)
            })
          }
        }

        socket.emit('broadcast', state)
      })
    })
  }
})

server.listen(3000)
