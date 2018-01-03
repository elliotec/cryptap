import express from 'express'
import es6Renderer from 'express-es6-template-engine'
// import binance from 'binance'
const app = express()

app.engine('html', es6Renderer)
app.set('views', 'views')
app.set('view engine', 'html')

app.get('/', (req, res) => res.render('index', {locals: {title: 'omg'}}))

app.listen(3000, () => console.log('listening on port 3000, bich'))
