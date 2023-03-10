# country-rest-api


//////////////////////////////////////////////////////////////////
////////////////////  Some APIs used ////////////////////////////

/* 

1. Info of countries
// URL: https://restcountries.com/
// Endpoint: https://restcountries.com/v3.1/name/${name}`

2. Weather
// URL: https://api.open-meteo.com
// Endpoint: `https://api.open-meteo.com/v1/forecast?latitude=${latlng[0]}&longitude=${latlng[1]}&hourly=temperature_2m,relativehumidity_2m,precipitation,surface_pressure,cloudcover&current_weather=true&start_date=${currentDate}&end_date=${tomorrowDate}&timezone=auto`

3. Leaflet Maps

4. Unsplash for photos

**/

/////////////////////////////////////////////////////////////////
/////////////  Ideas for APIs that could be used ////////////////

// Wikipedia API aka Mediawiki
// The unofficial Wikipedia API. Because Wikipedia is built using MediaWiki, which in turn supports an API, Wikipedia does as well.
// This provides developers code-level access to the entire Wikipedia reference.

// Get all administrative divisions of a country
// https://github.com/kamikazechaser/administrative-divisions-db

// ip-fast.com
// IP address for country and city

// https://date.nager.at/
// public holidays

// weather-api
// https://github.com/robertoduessmann/weather-api

// World bank
// https://datahelpdesk.worldbank.org/knowledgebase/articles/889386-developer-information-overview

/////////////////////////////////////////////////////////////////
////////////////////  Things that could be done /////////////////

/* 
	Date: 1/19/2023

	Beside:

	1. Basic description of a country via Wiki 
	2. Maybe change the theme to dark, if it's night time in the country.
	3. Show overlay for pictures when clicked. Maybe can iterate pictures in prev next fashion while in overlay. It's called Lightbox -> Modal image gallery
	4. Bring more pictures button. 
	5. Move the map only when it's focused. On map click allow its full features. - SOLVED WITH A TOGGLER
	6. Bring up some most extreme facts about countries of the world. Like: smallest countries, most rich, poorest, most populated, least populated, etc

**/


/* 
	Date: 1/19/2023

  New ideas:
	1. Bring new weather information based on the marker location on the map.


**/