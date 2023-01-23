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
	3. Show overlay for pictures when clicked. Maybe can iterate pictures in prev next fashion while in overlay.
	4. Bring more pictures button. 
	5. Move the map only when it's focused. On map click allow its full features.
	6. Bring up some most extreme facts about countries of the world. Like: smallest countries, most rich, poorest, most populated, least populated, etc

**/

///////////////////////////////////////////////////////////////
/////////////////////    Start     ///////////////////////////

const form = document.querySelector(".form");
const input = document.querySelector(".input");
const output = document.querySelector(".output");
let map = document.querySelector(".map");
let mapToggle = document.querySelector(".fa-toggle-on");

form.addEventListener("submit", function (e) {
	e.preventDefault();
	const userInput = input.value;
	if (input.value != "") {
		document.querySelector(".output").innerHTML = `
			<div class="map-wrapper">
				<div class="map map-default" id="map"></div>
				<div class="toggle-map"><i class="fa-solid fa-toggle-off toggle-map-icon"></i></div>
			</div>
			</div><div class="photos"></div>
		`;
		getCountryBasics(userInput);
	}
});

/////////////////////////////////////////////////////////////
////////////////////// Fetch Functions //////////////////////

const getJSON = (url, errorMsg = "Something went wrong. Probably network connection problem.") => {
	return fetch(url).then((res) => {
		console.log(res.ok);
		if (!res.ok) throw new Error(`${errorMsg} ${res.status}`);
		return res.json();
	});
};

function getCountryBasics(name) {
	// Promise.all() -----> check for solutions

	getJSON(`https://restcountries.com/v3.1/name/${name}`, "Country not found.")
		.then(([data]) => {
			renderCard(data);
			console.log(data);
			return data;
		})
		.then((data) => {
			loadMap(data.latlng);
			document.querySelector(".map").style.opacity = 1;
			return data;
		})
		.then((data) => {
			getWeather(data.latlng);
			return data;
		})
		.then((data) => {
			console.log(data.name.common);
			unsplash(data.name.common);
		})
		.catch((error) => {
			console.error(`${error} 💥`);
			console.error(`${error.message} 💥`);
		})
		.finally(() => {
			output.style.opacity = 1;
			map = document.querySelector(".map");
			mapToggle = document.querySelector(".toggle-map-icon");
			mapToggle.addEventListener("click", () => {
				toggleMapControl();
			});
		});
}

function getWeather(latlng) {
	const currentDate = new Date().toISOString().split("T")[0];
	const tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
	getJSON(
		`https://api.open-meteo.com/v1/forecast?latitude=${latlng[0]}&longitude=${latlng[1]}&hourly=temperature_2m,relativehumidity_2m,precipitation,surface_pressure,cloudcover&current_weather=true&start_date=${currentDate}&end_date=${currentDate}&timezone=auto`,
		"Coudn't get weather."
	).then((data) => {
		renderWeatherCard(data);
		console.log(data);
	});
}

function loadMap(coords) {
	const map = L.map("map").setView(coords, 6);
	L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);
	L.marker(coords).addTo(map).bindPopup("Weather data based on this location.").openPopup();
	// leaflet.js map does inform of internal errors already
}

function unsplash(query) {
	getJSON(`https://api.unsplash.com/search/photos?page=1&per_page=20&query=${query}&client_id=ZnA8Fx4U0KqXYNHvj2wd5CTv_f_E86PCOVh4UWIuIXA`, "Can't fetch the pictures.").then((data) => {
		renderPhotos(data.results);
	});
}

/////////////////////////////////////////////////////////////
////////////////////// Render Functions /////////////////////

function renderCard(data) {
	const outputUI = document.querySelector(".output");

	const outputInner = `
  <div class="country-card">
        <div class="flag">
          <img src="${data.flags.svg}" alt="${data.flag}">
        </div>
        <div class="description-box">
          <div class="name">${data.name.common}</div>
          <div class="name-official">${data.name.official}</div>
          <div class="capital">💒 Capital: <span>${data.capital}</span></div>
          <div class="population">🧑 Population: <span>${Math.round(data.population / 1000000).toFixed(1)} MLN</span></div>
          <div class="currency">💭 Language: <span>${Object.values(data.languages)[0]}</span></div>
          <div class="currency">💰 Currency: <span>${Object.values(data.currencies)[0].name}</span></div>
        </div>
      </div>
`;

	outputUI.insertAdjacentHTML("beforeend", outputInner);
}

function renderWeatherCard(data) {
	const outputUI = document.querySelector(".output");

	icon = "";

	if (data.current_weather.weathercode != undefined) {
		icon = chooseWeatherIcon(data.current_weather.weathercode);
	} else throw new Error("No weathercode.");

	const outputInner = `
  <div class="weather-card">
    <div class="icon">
      <img src="${icon}" alt="" />
    </div>
      <div class="description-box">
			<div class="weather">Weather</div>
      <div class="temp">🌡️ Temperature(avg): <span>${data.current_weather.temperature}°C</span></div>
      <div class="wind">💨 Wind Speed: <span>${data.current_weather.windspeed} km/h</span></div>
      <div class="humidity">💧 Humidity: <span>${data.hourly.relativehumidity_2m[0]}%</span></div>
      <div class="pressure">🍆 Pressure: <span>${data.hourly.surface_pressure[0]} hPa</span></div>
    </div>
    </div>
  </div>
`;

	outputUI.insertAdjacentHTML("beforeend", outputInner);

	return data;
}

function renderPhotos(results) {
	let output = "";

	results.forEach((element) => {
		output += `
			<div class="photos__single">
				<img src="${element.urls.regular}" alt="">
			</div>
		`;
	});

	document.querySelector(".photos").insertAdjacentHTML("beforeend", output);
}

function chooseWeatherIcon(weathercode) {
	let icon;

	if (weathercode == 0) {
		icon = "./images/day.svg";
	}

	// Mainly clear, partly cloudy, and overcast
	if (weathercode == 1) {
		icon = "./images/cloudy-day-1.svg";
	}

	if (weathercode == 2) {
		icon = "./images/cloudy-day-2.svg";
	}

	if (weathercode == 3) {
		icon = "./images/cloudy.svg";
	}

	// Drizzle: Light, moderate, and dense intensity
	if (weathercode == 51) {
		icon = "./images/rainy-1.svg";
	}

	if (weathercode == 53) {
		icon = "./images/rainy-2.svg";
	}

	if (weathercode == 55) {
		icon = "./images/rainy-3.svg";
	}

	// Rain: Slight, moderate and heavy intensity || Freezing Rain: Light and heavy intensity || Rain showers: Slight, moderate, and violent
	if (weathercode == 61 || weathercode == 66 || weathercode == 80) {
		icon = "./images/rainy-4.svg";
	}

	if (weathercode == 63 || weathercode == 81) {
		icon = "./images/rainy-5.svg";
	}

	if (weathercode == 65 || weathercode == 67 || weathercode == 82) {
		icon = "./images/rainy-6.svg";
	}

	// Snow || 	Snow showers slight and heavy
	if (weathercode == 71 || weathercode == 85) {
		icon = "./images/snowy-4.svg";
	}

	if (weathercode == 73) {
		icon = "./images/snowy-5.svg";
	}

	if (weathercode == 75 || weathercode == 86) {
		icon = "./images/snowy-6.svg";
	}

	if (weathercode == 77) {
		icon = "./images/snowy-6.svg";
	}

	// Thunderstorm
	if (weathercode == 95 || weathercode == 96 || weathercode == 99) {
		icon = "./images/thunder.svg";
	}

	return icon;
}

/////////////////////////////////////////////////////////////
////////////////////// Toggle map back and forth /////////////////////
function toggleMapControl() {
	map.style.pointerEvents = "all";
	map.style.userSelect = "all";

	if (mapToggle.classList.contains("fa-toggle-off")) {
		mapToggle.classList.remove("fa-toggle-off");
		mapToggle.classList.add("fa-toggle-on");
		map.style.pointerEvents = "all";
		// map.style.userSelect = "all";
	} else {
		mapToggle.classList.remove("fa-toggle-on");
		mapToggle.classList.add("fa-toggle-off");
		map.style.pointerEvents = "none";
		// map.style.userSelect = "none";
	}
	console.log("toggle clicked");
}



///////////////////////////////////////////////////////////////////
////////////// Possible architecture of promises ??????????????????

// Check how this work -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally

// function checkMail() {
// 	return new Promise((resolve, reject) => {
// 		if (Math.random() > 0.5) {
// 			resolve("Mail has arrived");
// 		} else {
// 			reject(new Error("Failed to arrive"));
// 		}
// 	});
// }

// checkMail()
// 	.then((mail) => {
// 		console.log(mail);
// 	})
// 	.catch((err) => {
// 		console.error(err);
// 	})
// 	.finally(() => {
// 		console.log("Experiment completed");
// 	});

////////////////////// or this

// const promise1 = Promise.resolve(3);
// const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
// const promises = [promise1, promise2];

// Promise.allSettled(promises).
//   then((results) => results.forEach((result) => console.log(result.status)));

// Expected output:
// "fulfilled"
// "rejected"

// Read (MUST!!!)
// https://javascript.info/promise-chaining
