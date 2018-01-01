// const BASE_CRYPTONATOR_API_URL = 'https://api.cryptonator.com/api'
// const BASE_BINANCE_API_URL = 'https://api.binance.com/api/v1'
// const BINANCE_ALL_PRICES_URL = `${BASE_BINANCE_API_URL}/ticker/allPrices`
// const CURRENCIES_URL = `${BASE_CRYPTONATOR_API_URL}/currencies`
// const TICKER_URL = `${BASE_CRYPTONATOR_API_URL}/ticker`
// const FULL_TICKER_URL = `${BASE_CRYPTONATOR_API_URL}/full`

// function fetchAllCurrencies() {
//   fetch(BINANCE_ALL_PRICES_URL)
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => error)
// }

// function fetchTickerData(data) {
//   const currencies = data.rows
//   currencies.map((currency) => {
//     const currencyCode = currency.code.toLowerCase()
//     const currencyUri = `${FULL_TICKER_URL}/${currencyCode}-usd`
//     fetch(currencyUri)
//       .then(response => response.json())
//       .then(data => console.log(data))
//       .catch(error => error)
//   })
// }

// fetchAllCurrencies()
