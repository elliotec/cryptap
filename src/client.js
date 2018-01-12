// io is defined by the socket io script tag in views/index.html
const socket = io() // eslint-disable-line
socket.on('broadcast', (json) => {
  const data = JSON.stringify(json)
  const symbols = json.symbols
  // window.alert('')
  symbols.map((sym) => {
    // const symbol = json[sym].symbol
    // const change = json[sym].percentChange
    // const html = `<h1>${symbol}</h1><p>${change}</p>`
    // document.getElementById('money').insertAdjacentHTML('beforeend', html)
  })
  document.getElementById('money').innerHTML = data
})
