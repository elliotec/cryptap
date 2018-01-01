'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import binance from 'binance'

var app = (0, _express2.default)();

app.get('/', function (req, res) {
  return res.send('Hello bab!');
});

app.listen(3000, function () {
  return console.log('listening on port 3000, bich');
});