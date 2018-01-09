'use strict';

// io is defined by the socket io script tag in views/index.html
var socket = io(); // eslint-disable-line
socket.on('broadcast', function (data) {
  var html = JSON.stringify(data);
  document.getElementById('money').innerHTML = html;
});