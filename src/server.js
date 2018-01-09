import express from 'express'
import es6Renderer from 'express-es6-template-engine'
import binanceApi from 'binance'
import http from 'http'
import socketIo from 'socket.io'
import fetch from 'node-fetch'

const state = {}
const binance = new binanceApi.BinanceWS()
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const coinMarketCapApi = 'https://api.coinmarketcap.com/v1/ticker/'

app.engine('html', es6Renderer)
app.set('views', 'views')
app.set('view engine', 'html')
app.use(express.static('lib'))

app.get('/', (req, res) => res.render('index', {
  locals: { title: 'waddup', state }
}))

io.on('connection', (socket) => {
  fetch(coinMarketCapApi)
    .then((res) => res.json())
    .then((json) => getAllSymbols(json))

  function getAllSymbols (data) {
    console.log(data.map((coin) => {
      return binance.onKline(`${coin.symbol}BTC`, '5m', (data) => {
        state.kline = data.kline
        const open = state.kline.open
        const close = state.kline.close
        const change = (close - open) / open * 100
        const roundedChange = Number.parseFloat(change).toPrecision(4)
        console.log(`${roundedChange}%`)
        state.percentChange = roundedChange

        socket.emit('broadcast', { state })
      })
    }))
    // return data.map((coin) => {
    //   return coin.symbol
    // })
  }

  binance.onKline('ETHBTC', '5m', (data) => {
    state.kline = data.kline
    const open = state.kline.open
    const close = state.kline.close
    const change = (close - open) / open * 100
    const roundedChange = Number.parseFloat(change).toPrecision(4)
    // console.log(`${roundedChange}%`)
    state.percentChange = roundedChange

    socket.emit('broadcast', { state })
  })
})

server.listen(3000)
