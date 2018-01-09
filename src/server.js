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
app.use(express.static('lib'))

app.get('/', (req, res) => res.render('index', {
  locals: { title: 'waddup', state }
}))

io.on('connection', (socket) => {
  binance.onKline('ETHBTC', '5m', (data) => {
    state.kline = data.kline
    const open = state.kline.open
    const close = state.kline.close
    const change = (close - open) / open * 100
    const roundedChange = Number.parseFloat(change).toPrecision(4)
    console.log(`${roundedChange}%`)
    state.percentChange = roundedChange

    socket.emit('broadcast', { state })
  })
})

server.listen(3000)
