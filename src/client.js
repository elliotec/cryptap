// io is defined by the socket io script tag in views/index.html
const socket = io() // eslint-disable-line
function formChange() { // eslint-disable-line
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
  }).then((response) => {
    console.log(response)
  })
}
socket.on('broadcast', (json) => {
  const data = JSON.stringify(json)
  // const symbols = json.symbols
  // symbols.map((sym) => {
  //   console.log(json)
  //   const symbol = json[sym].symbol
  //   const change = json[sym].percentChange
  //   const html = `<h1>${symbol}</h1><p>${change}</p>`
  //   document.getElementById('table').insertAdjacentHTML('beforeend', html)
  // })
  document.getElementById('money').innerHTML = data
})
