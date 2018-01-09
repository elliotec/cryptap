'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _expressEs6TemplateEngine = require('express-es6-template-engine');

var _expressEs6TemplateEngine2 = _interopRequireDefault(_expressEs6TemplateEngine);

var _binance = require('binance');

var _binance2 = _interopRequireDefault(_binance);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = {};
var binance = new _binance2.default.BinanceWS();
var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var io = (0, _socket2.default)(server);
var topHundredCoins = 'https://api.coinmarketcap.com/v1/ticker/';

app.engine('html', _expressEs6TemplateEngine2.default);
app.set('views', 'views');
app.set('view engine', 'html');
app.use(_express2.default.static('lib'));

app.get('/', function (req, res) {
  return res.render('index', {
    locals: { title: 'waddup', state: state }
  });
});

io.on('connection', function (socket) {
  (0, _nodeFetch2.default)(topHundredCoins).then(function (res) {
    return res.json();
  }).then(function (json) {
    return getAllSymbols(json);
  });

  function getAllSymbols(data) {
    data.map(function (coin) {
      var symbol = coin.symbol;
      state[symbol] = {};
      return binance.onKline(symbol + 'BTC', '5m', function (data) {
        state[symbol] = _extends({}, data.kline);
        var open = state[symbol].open;
        var close = state[symbol].close;
        var change = (close - open) / open * 100;
        var roundedChange = Number.parseFloat(change).toPrecision(4);
        console.log(symbol + ': ' + roundedChange + '%');
        if (roundedChange > 1.5) {
          console.log('Alert!');
        }
        state.percentChange = roundedChange;

        socket.emit('broadcast', { state: state });
      });
    });
    // return data.map((coin) => {
    //   return coin.symbol
    // })
  }
});

server.listen(3000);