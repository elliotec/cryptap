'use strict';

// io is defined by the socket io script tag in views/index.html
var socket = io(); // eslint-disable-line
function formChange() {
  // eslint-disable-line
  window.fetch('/form', {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      interval: document.getElementById('interval').value,
      symbol: document.getElementById('symbol').value,
      percentChange: document.getElementById('percentChange').value
    })
  }).then(function (response) {
    console.log(response);
  });
}
socket.on('broadcast', function (json) {
  var data = JSON.stringify(json);
  var symbols = json.symbols;
  symbols.map(function (sym) {
    console.log(json);
    var symbol = json[sym].symbol;
    var change = json[sym].percentChange;
    var html = '<h1>' + symbol + '</h1><p>' + change + '</p>';
    document.getElementById('table').insertAdjacentHTML('beforeend', html);
  });
  document.getElementById('money').innerHTML = data;
});