'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressEs6TemplateEngine = require('express-es6-template-engine');

var _expressEs6TemplateEngine2 = _interopRequireDefault(_expressEs6TemplateEngine);

var _binance = require('binance');

var _binance2 = _interopRequireDefault(_binance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = {};
var binance = new _binance2.default.BinanceWS();

binance.onKline('BNBBTC', '1m', function (data) {
  console.log(data.kline.volume);
  state.kline = data.kline;
});

var app = (0, _express2.default)();

app.engine('html', _expressEs6TemplateEngine2.default);
app.set('views', 'views');
app.set('view engine', 'html');

app.get('/', function (req, res) {
  return res.render('index', { locals: { title: state.kline.volume } });
});

app.listen(3000, function () {
  return console.log('listening on port 3000, bich');
});