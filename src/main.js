import express from 'express'
import es6Renderer from 'express-es6-template-engine'
import binanceApi from 'binance'

const state = {}
const binance = new binanceApi.BinanceWS()

binance.onKline('BNBBTC', '1m', (data) => {
  console.log(data.kline.volume)
  state.kline = data.kline
})

const app = express()

app.engine('html', es6Renderer)
app.set('views', 'views')
app.set('view engine', 'html')

app.get('/', (req, res) => res.render('index', {locals: {title: state.kline.volume}}))

app.listen(3000, () => console.log('listening on port 3000, bich'))
