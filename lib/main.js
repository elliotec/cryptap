'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressEs6TemplateEngine = require('express-es6-template-engine');

var _expressEs6TemplateEngine2 = _interopRequireDefault(_expressEs6TemplateEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import binance from 'binance'
var app = (0, _express2.default)();

app.engine('html', _expressEs6TemplateEngine2.default);
app.set('views', 'views');
app.set('view engine', 'html');

app.get('/', function (req, res) {
  return res.render('index', { locals: { title: 'omg' } });
});

app.listen(3000, function () {
  return console.log('listening on port 3000, bich');
});