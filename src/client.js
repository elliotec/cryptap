// io is defined by the socket io script tag in views/index.html
const socket = io() // eslint-disable-line
socket.on('broadcast', (data) => {
  var html = JSON.stringify(data)
  document.getElementById('money').innerHTML = html
})
