airports
========

Simple API for getting basic airports info, like city and country. Mostly
for learning and demo purposes.

## TL;DR

Check out <http://airports-api.marinin.xyz>. API is provided without any
guarantees of anything, but I suppose I'll keep it running while it doesn't
get too messy. Please, do not abuse this instance.

At the moment there is no authentication or rate limiting, and I want to keep
it that way.

## Background (a little)

There are two most common types of airport identifier: IATA code and ICAO code.
IATA code is the three-letter one on the luggage, like DME or JFK. ICAO code
consists of 4 characters, like UUDD or KFJK.

This project uses data from [@mwgg/Airports](https://github.com/mwgg/Airports)
which is licensed under MIT license.

## Endpoints

<dl>
  <dt>/iata</dt>
  <dd>Get all available IATA codes in the dataset.</dd>
  <dt>/iata/[IATA]></dt>
  <dd>Get airport description or <code>{"error": "Airport Not Found"}</code></dd>
  <dt>/icao</dt>
  <dd>Get all available ICAO codes in the dataset</dd>
  <dt>/icao/[ICAO]</dt>
  <dd>Get airport description or <code>{"error": "Airport Not Found"}</code></dd>
  <dt>/[COUNTRY]</dt>
  <dd>Get cities in the <COUNTRY> with airports counts. </dd>
  <dt>/[COUNTRY]/[CITY]</dt>
  <dd>Get [ICAO] codes of airports in the city. Country is added to avoid ambiguities like Paris, US and PARIS, FR.</dd>
  <dt>/</dt>
  <dd>Get links to <code>/iata</code>, <code>/icao</code>, and available countries.</dd>
</dl>

## License

Dataset is available at [@mwgg/Airports](https://github.com/mwgg/Airports)
and licensed under MIT license.

This code is licensed under MIT license as well.

Tim Marinin, 2017.
