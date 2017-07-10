const express = require('express')
const app = express()
const cors = require('cors')

const raw = require('../data/airports.json')

const data_arr = []
const idx_by_icao = {}
const idx_by_iata = {}
const idx_by_city = {}
const idx_by_country_city = {}
const idx_country_by_city = {}
const iata_excludes = new Set(['0', '---'])
for (let [icao, data] of Object.entries(raw)) {
  const ind = data_arr.length
  data_arr.push(data)
  idx_by_icao[icao] = ind
  if (data.iata && !iata_excludes.has(data.iata)) idx_by_iata[data.iata] = ind
  if (data.city) {
    if (!idx_by_city[data.city]) idx_by_city[data.city] = new Set([ind])
    else idx_by_city[data.city].add(ind)

    if (!idx_by_country_city[data.country]) idx_by_country_city[data.country] = { [data.city]: new Set([ind]) }
    else if (!idx_by_country_city[data.country][data.city]) idx_by_country_city[data.country][data.city] = new Set([ind])
    else idx_by_country_city[data.country][data.city].add(ind)

    if (!idx_country_by_city[data.city]) idx_country_by_city[data.city] = new Set([data.country])
    else idx_country_by_city[data.city].add(data.country)
  }
}

const getOr = (col, idx) => (ind, substitute) => (ind && idx[ind] && col[idx[ind]]) ? col[idx[ind]] : substitute
const getByIata = getOr(data_arr, idx_by_iata)
const getByIcao = getOr(data_arr, idx_by_icao)

const api = express.Router()

const sendAirport = (res, d) => d ? res.json(d) : res.status(404).json({error: 'Airport Not Found'})

api.get('/iata/:code', (req, res) => {
  const d = getByIata(req.params.code, null)
  sendAirport(res, d)
})

api.get('/iata/?', (req, res) => {
  res.json({
    codes: Object.keys(idx_by_iata).sort()
  })
})

const icao_handler = (req, res) => {
  const d = getByIcao(req.params.code, null)
  sendAirport(res, d)
}

api.get('/icao/:code', icao_handler)

api.get('/icao', (req, res) => {
  res.json({
    codes: Object.keys(idx_by_icao).sort()
  })
})

api.get('/city/:city', (req, res) => {
  const inds = idx_by_city[req.params.city]
  const countries = idx_country_by_city[req.params.city]
  if (inds) {
    const response = {
      city: req.params.city,
      airports: Array.from(inds).map(k => data_arr[k].icao)
    }
    if (countries.size > 1) {
      response.error = 'Multiple countries, results are merged. Use /:country/:city instead'
      response.countries = Array.from(countries)
    }
    res.json(response)
  } else {
    res.status(404).json({error: 'City Not Found'})
  }
})

app.get('/city', (req, res) => {
  res.json({
    cities: Object.keys(idx_by_city).sort()
  })
})

api.get('/:country/:city', (req, res) => {
  const airports = idx_by_country_city[req.params.country] && idx_by_country_city[req.params.country][req.params.city]
  if (airports) {
    res.json({
      country: req.params.country,
      city: req.params.city,
      airports: Array.from(airports).map(k => data_arr[k].icao)
    })
  } else {
    res.status(404).json({error: 'Country/City Not Found'})
  }
})

api.get('/:country', (req, res) => {
  const cities = idx_by_country_city[req.params.country]
  if (cities) {
    res.json({
      country: req.params.country,
      cities: Object.entries(cities).map(([city, airports]) => ({name: city, airpors: airports.size}))
    })
  } else {
    res.status(404).json({error: 'Country Not Found'})
  }
})

api.get('/:country/:city/:code', icao_handler)

const index = {
  endpoints: {
      iata: '/iata',
      icao: '/icao',
      countries: Object.keys(idx_by_country_city).reduce((obj, country) => ((obj[country] = '/' + country), obj), {})
  }
}

app.use(cors())
app.use(api)
app.get('/', (req, res) => res.json(index))

const port = process.env.PORT || 8080
app.listen(port, () => console.log('Started listening on localhost:%s', port))
