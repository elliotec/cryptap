'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressEs6TemplateEngine = require('express-es6-template-engine');

var _expressEs6TemplateEngine2 = _interopRequireDefault(_expressEs6TemplateEngine);

var _binance = require('binance');

var _binance2 = _interopRequireDefault(_binance);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = {};
var binance = new _binance2.default.BinanceWS();
var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var io = (0, _socket2.default)(server);

app.engine('html', _expressEs6TemplateEngine2.default);
app.set('views', 'views');
app.set('view engine', 'html');

app.get('/', function (req, res) {
  return res.render('index', { locals: {
      title: 'elan',
      state: state
    } });
});

io.on('connection', function (socket) {
  binance.onKline('BNBBTC', '1m', function (data) {
    state.kline = data.kline;
    socket.emit('broadcast', { state: state });
  });
});

server.listen(3000);