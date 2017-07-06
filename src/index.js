const express = require('express')
const app = express()

const raw = require('../data/airports.json')

const data_arr = []
const idx_by_icao = {}
const idx_by_iata = {}
const idx_by_latlon = {}
for (let [icao, data] of Object.entries(raw)) {
  const ind = data_arr.length
  data_arr.push(data)
  idx_by_icao[icao] = ind
  if (data.iata) idx_by_iata = ind
}

const getOr = (col, idx) => (ind, substitute) => (ind && idx[ind] && col[idx[ind]]) ? col[idx[ind]] : substitute
const getByIata = getOr(data_arr, idx_by_iata)
const getByIcao = getOr(data_arr, idx_by_icao)
const getByLatlon = getOr(data_arr, idx_by_latlon)

const api = express.Router()

api.get('/iata/:code', (req, res) => {
  const d = getByIata(req.params.code, null)
  if (d) {
    res.json(d)
  } else {
    res.status(404)
    res.json({
      error: 'Airport Not Found'
    })
  }
})

app.use(api)
app.get('/', (req, res) => res.json({status: 'OK'}))
app.listen(8080, () => console.log('Started listening on localhost:8080'))
