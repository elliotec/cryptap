const BASE_CRYPTONATOR_API_URI = 'https://api.cryptonator.com/api'
const CURRENCIES_URI = `${BASE_API_URI}/currencies`
const TICKER_URI = `${BASE_API_URI}/ticker`
const FULL_TICKER_URI = `${BASE_API_URI}/full`

function fetchAllCurrencies() {
  fetch(CURRENCIES_URI)
    .then(response => response.json())
    .then(data => fetchTickerData(data))
    .catch(error => error)
}

function fetchTickerData(data) {
  const currencies = data.rows
  currencies.map((currency) => {
    const currencyCode = currency.code.toLowerCase()
    const currencyUri = `${FULL_TICKER_URI}/${currencyCode}-usd`
    fetch(currencyUri)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => error)
  })
}

fetchAllCurrencies()
