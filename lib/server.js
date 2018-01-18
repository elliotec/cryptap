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

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = {};
state.alerts = {};
state.interval = '5m';
state.symbol = 'BTC';
state.percentChange = 10;
var binance = new _binance2.default.BinanceWS();
var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var io = (0, _socket2.default)(server);
var topHundredCoins = 'https://api.coinmarketcap.com/v1/ticker/';

_dotenv2.default.config();
app.engine('html', _expressEs6TemplateEngine2.default);
app.set('views', 'views');
app.set('view engine', 'html');
app.use(_express2.default.static('lib'));
app.use(_express2.default.json());

app.get('/', function (req, res) {
  return res.render('index', {
    locals: { title: 'coinage', state: state }
  });
});

app.post('/form', function (req, res) {
  console.log(req.body);
  state = _extends({}, state, {
    interval: req.body.interval,
    symbol: req.body.symbol,
    percentChange: req.body.percentChange
  });
});

io.on('connection', function (socket) {
  (0, _nodeFetch2.default)(topHundredCoins).then(function (res) {
    return res.json();
  }).then(function (json) {
    return getRealTimeCoinData(json);
  });

  function getRealTimeCoinData(data) {
    state.symbols = data.map(function (coin) {
      return coin.symbol;
    });
    data.map(function (coin) {
      var symbol = coin.symbol;
      state[symbol] = {};
      return binance.onKline('' + symbol + state.symbol, '' + state.interval, function (data) {
        if (state[symbol] && !(0, _deepEqual2.default)(state[symbol], _extends({}, data.kline))) {
          state[symbol] = _extends({}, state[symbol], data.kline);
        }

        var open = state[symbol].open;
        var close = state[symbol].close;
        var change = (close - open) / open * 100;
        var roundedChange = Number.parseFloat(change).toPrecision(3);
        var EMAIL_SEND_THRESHOLD = 5 * 60 * 1000;
        state[symbol].percentChange = roundedChange;

        if (roundedChange > state.percentChange || roundedChange < -state.percentChange) {
          state[symbol] = _extends({}, state[symbol], {
            alert: {
              message: symbol + ' has changed ' + roundedChange + '% in the last ' + state.interval,
              symbol: symbol,
              roundedChange: roundedChange,
              timestamp: Date.now()
            }
          });
        }

        if (state[symbol].alert) {
          var transporter = _nodemailer2.default.createTransport({
            service: 'gmail',
            auth: {
              user: 'coinagenotifier@gmail.com',
              pass: process.env.COINAGE_EMAIL_PASS
            }
          });
          var mailOptions = {
            from: 'coinagenotifier@gmail.com',
            to: 'elliotecweb@gmail.com evanlhatch@gmail.com',
            subject: state[symbol].alert.message,
            text: state[symbol].alert.message + ', so what are you gonna do about it bitch?'
          };

          if (!state[symbol].emailSentTime) {
            var emailSentTime = Date.now();
            state[symbol] = _extends({}, state[symbol], {
              emailSentTime: emailSentTime
            });
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) return console.error(error);
              console.log(info);
            });
          } else if (state[symbol].emailSentTime && Date.now() - state[symbol].emailSentTime >= EMAIL_SEND_THRESHOLD) {
            var _emailSentTime = Date.now();
            state[symbol] = _extends({}, state[symbol], {
              emailSentTime: _emailSentTime
            });
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) return console.error(error);
              console.log(info);
            });
          }
        }

        socket.emit('broadcast', state);
      });
    });
  }
});

server.listen(8080, function () {
  return console.log('listening on port 8080');
});