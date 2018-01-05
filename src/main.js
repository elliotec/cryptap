import express from 'express'
import es6Renderer from 'express-es6-template-engine'
import binanceApi from 'binance'
import http from 'http'
import socketIo from 'socket.io'

const state = {}
const binance = new binanceApi.BinanceWS()
const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.engine('html', es6Renderer)
app.set('views', 'views')
app.set('view engine', 'html')

app.get('/', (req, res) => res.render('index', {locals: {
  title: 'elan',
  state
}}))

io.on('connection', (socket) => {
  binance.onKline('BNBBTC', '1m', (data) => {
    state.kline = data.kline
    socket.emit('broadcast', { state })
  })
})

server.listen(3000)
