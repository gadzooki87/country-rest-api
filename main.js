//////////////////////////////////////////////////////////////
// Countries for autocomplete
const countries = [
	"Afghanistan",
	"Albania",
	"Algeria",
	"Andorra",
	"Angola",
	"Anguilla",
	"Antigua &amp; Barbuda",
	"Argentina",
	"Armenia",
	"Aruba",
	"Australia",
	"Austria",
	"Azerbaijan",
	"Bahamas",
	"Bahrain",
	"Bangladesh",
	"Barbados",
	"Belarus",
	"Belgium",
	"Belize",
	"Benin",
	"Bermuda",
	"Bhutan",
	"Bolivia",
	"Bosnia &amp; Herzegovina",
	"Botswana",
	"Brazil",
	"British Virgin Islands",
	"Brunei",
	"Bulgaria",
	"Burkina Faso",
	"Burundi",
	"Cambodia",
	"Cameroon",
	"Canada",
	"Cape Verde",
	"Cayman Islands",
	"Central Arfrican Republic",
	"Chad",
	"Chile",
	"China",
	"Colombia",
	"Congo",
	"Cook Islands",
	"Costa Rica",
	"Cote D Ivoire",
	"Croatia",
	"Cuba",
	"Curacao",
	"Cyprus",
	"Czech Republic",
	"Denmark",
	"Djibouti",
	"Dominica",
	"Dominican Republic",
	"Ecuador",
	"Egypt",
	"El Salvador",
	"Equatorial Guinea",
	"Eritrea",
	"Estonia",
	"Ethiopia",
	"Falkland Islands",
	"Faroe Islands",
	"Fiji",
	"Finland",
	"France",
	"French Polynesia",
	"French West Indies",
	"Gabon",
	"Gambia",
	"Georgia",
	"Germany",
	"Ghana",
	"Gibraltar",
	"Greece",
	"Greenland",
	"Grenada",
	"Guam",
	"Guatemala",
	"Guernsey",
	"Guinea",
	"Guinea-Bissau",
	"Guyana",
	"Haiti",
	"Honduras",
	"Hong Kong",
	"Hungary",
	"Iceland",
	"India",
	"Indonesia",
	"Iran",
	"Iraq",
	"Ireland",
	"Isle of Man",
	"Israel",
	"Italy",
	"Jamaica",
	"Japan",
	"Jersey",
	"Jordan",
	"Kazakhstan",
	"Kenya",
	"Kiribati",
	"Kosovo",
	"Kuwait",
	"Kyrgyzstan",
	"Laos",
	"Latvia",
	"Lebanon",
	"Lesotho",
	"Liberia",
	"Libya",
	"Liechtenstein",
	"Lithuania",
	"Luxembourg",
	"Macau",
	"Macedonia",
	"Madagascar",
	"Malawi",
	"Malaysia",
	"Maldives",
	"Mali",
	"Malta",
	"Marshall Islands",
	"Mauritania",
	"Mauritius",
	"Mexico",
	"Micronesia",
	"Moldova",
	"Monaco",
	"Mongolia",
	"Montenegro",
	"Montserrat",
	"Morocco",
	"Mozambique",
	"Myanmar",
	"Namibia",
	"Nauro",
	"Nepal",
	"Netherlands",
	"Netherlands Antilles",
	"New Caledonia",
	"New Zealand",
	"Nicaragua",
	"Niger",
	"Nigeria",
	"North Korea",
	"Norway",
	"Oman",
	"Pakistan",
	"Palau",
	"Palestine",
	"Panama",
	"Papua New Guinea",
	"Paraguay",
	"Peru",
	"Philippines",
	"Poland",
	"Portugal",
	"Puerto Rico",
	"Qatar",
	"Réunion Island",
	"Romania",
	"Russia",
	"Rwanda",
	"Saint Pierre &amp; Miquelon",
	"Samoa",
	"San Marino",
	"Sao Tome and Principe",
	"Saudi Arabia",
	"Senegal",
	"Serbia",
	"Seychelles",
	"Sierra Leone",
	"Singapore",
	"Slovakia",
	"Slovenia",
	"Solomon Islands",
	"Somalia",
	"South Africa",
	"South Korea",
	"South Sudan",
	"Spain",
	"Sri Lanka",
	"St Kitts &amp; Nevis",
	"St Lucia",
	"St Vincent",
	"Sudan",
	"Suriname",
	"Swaziland",
	"Sweden",
	"Switzerland",
	"Syria",
	"Taiwan",
	"Tajikistan",
	"Tanzania",
	"Thailand",
	"Timor L'Este",
	"Togo",
	"Tonga",
	"Trinidad &amp; Tobago",
	"Tunisia",
	"Turkey",
	"Turkmenistan",
	"Turks &amp; Caicos",
	"Tuvalu",
	"Uganda",
	"Ukraine",
	"United Arab Emirates",
	"United Kingdom",
	"United States of America",
	"Uruguay",
	"Uzbekistan",
	"Vanuatu",
	"Vatican City",
	"Venezuela",
	"Vietnam",
	"Virgin Islands (US)",
	"Yemen",
	"Zambia",
	"Zimbabwe",
];

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
			<div class="error"></div>
			<div class="map-wrapper">
				<div class="map map-default" id="map"></div>
				<div class="toggle-map"><i class="fa-solid fa-toggle-off toggle-map-icon"></i></div>
			</div>
			</div><div class="photos"></div>

			<!-- The Modal/Lightbox -->
			<div id="myModal" class="modal">
				<span class="close cursor">&times;</span>
				<div class="modal-content">

				</div>
			</div>
		`;
		output.style.opacity = 0;
		getCountryBasics(userInput);
	}
});

/////////////////////////////////////////////////////////////
////////////////////// Fetch Functions //////////////////////

const getJSON = (url, errorMsg = "Something went wrong. Probably network connection problem.") => {
	return fetch(url).then((res) => {
		if (!res.ok) throw new Error(`${errorMsg} ${res.status}`);
		return res.json();
	});
};

const renderErr = (msg) => {
	const output = document.querySelector(".error");
	output.insertAdjacentText("beforeend", msg);
	output.style.display = "block"
};

function getCountryBasics(name) {
	// Promise.all() -----> check for solutions

	getJSON(`https://restcountries.com/v3.1/name/${name}?fullText=true`, "Country not found.")
		.then(([data]) => {
			renderCard(data);
			return data;
		})
		.then((data) => {
			loadMap(data.latlng);
			return data;
		})
		.then((data) => {
			getWeather(data.latlng);
			return data;
		})
		.then((data) => {
			unsplash(data.name.common);
		})
		.catch((error) => {
			console.error(`${error} 💥`);
			console.error(`${error.message} 💥`);
			renderErr(error.message)
		})
		.finally(() => {
			output.style.opacity = 1;
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
	console.log(coords);
	const map = L.map("map").setView(coords, 6);
	L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);
	L.marker(coords).addTo(map).bindPopup("Weather data based on this location.").openPopup();
	
	// Show map and enable toggle
	document.querySelector(".map-wrapper").style.opacity = 1;
	
}

function unsplash(query) {
	getJSON(`https://api.unsplash.com/search/photos?page=1&per_page=20&query=${query}&client_id=ZnA8Fx4U0KqXYNHvj2wd5CTv_f_E86PCOVh4UWIuIXA`, "Can't fetch the pictures.")
		.then((data) => {
			renderPhotos(data.results);
			return data.results;
		})
		.then((data) => {
			console.log("Unsplash: ", data);
			populateModal(data);
		});
}

/////////////////////////////////////////////////////////////
////////////////////// Render Functions /////////////////////

function renderCard(data) {
	const outputUI = document.querySelector(".output");

	let population = data.population
	if (population < 1000000) population = population
	else if (population > 1000000 && population < 1000000000) population = (population / 1000000).toFixed(1) + " MLN";
	else if (population >= 1000000000) population = (population / 1000000000).toFixed(2) + " BLN"

	const outputInner = `
  <div class="country-card">
        <div class="flag">
          <img src="${data.flags.svg}" alt="${data.flag}">
        </div>
        <div class="description-box">
          <div class="name">${data.name.common}</div>
          <div class="name-official">${data.name.official}</div>
          <div class="capital">💒 Capital: <span>${data.capital}</span></div>
          <div class="population">🧑 Population: <span>${population}</span></div>
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

	results.forEach((element, index) => {
		output += `
			<div class="photos__single" data-number="${index}">
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

///////////////////////////////////////////////////////////
////////////// Toggle map back and forth //////////////////
function toggleMapControl() {
	const map = document.getElementById('map')
	map.style.pointerEvents = "all";
	map.style.userSelect = "all";

	if (mapToggle.classList.contains("fa-toggle-off")) {
		mapToggle.classList.remove("fa-toggle-off");
		mapToggle.classList.add("fa-toggle-on");
		map.style.pointerEvents = "all";
	} else {
		mapToggle.classList.remove("fa-toggle-on");
		mapToggle.classList.add("fa-toggle-off");
		map.style.pointerEvents = "none";
	}
}

///////////////////////////////////////////////////////////
/////////////////////// Modal /////////////////////////////

function populateModal(data) {
	const modalContent = document.querySelector(".modal-content");

	let output = ``;

	data.forEach((el, index) => {
		const desc = el.description != null ? el.description : el.alt_description != null ? el.alt_description : "No description"
		output += `
			<div class="photo-single--modal" data-number="${index}" data-desc="${desc}">
				<div class="numbertext">${index + 1} / ${data.length}</div>
				<img src="${el.urls.regular}">
			</div>
		`;
	});

	output += `
		<!-- Next/previous controls -->
    <a class="prev">&#10094;</a>
    <a class="next">&#10095;</a>

    <!-- Caption text -->
    <div class="caption-container">
      <p id="caption"></p>
    </div>
		<div class="thumbnails">
	`;

	data.forEach((el, index) => {
		const desc = el.description != null ? el.description : el.alt_description != null ? el.alt_description : "No description";
		output += `
			<div class="thumbnail" data-number="${index}" data-desc="${desc}">
				<img src="${el.urls.small}" alt="Nature">
			</div>
		`;
	});

	output += `
		<div/> 
	`;

	modalContent.insertAdjacentHTML("beforeend", output);
}

function openModal() {
	document.getElementById("myModal").style.display = "block";
}

function closeModal() {
	document.getElementById("myModal").style.display = "none";
	const photos = document.querySelectorAll(".photo-single--modal");
	photos.forEach((photo) => {
		photo.style.display = "none";
	});
}

function chooseCurrentPhoto(current) {
	const photos = document.querySelectorAll(".photo-single--modal");
	photos.forEach((photo) => {
		if (photo.dataset.number == current) {
			photo.style.display = "block";
			const caption = document.getElementById("caption");
			caption.innerHTML = photo.dataset.desc;
		}
	});
}

function prevPhoto() {
	let photos = document.querySelectorAll(".photo-single--modal");
	let current;
	let prev;
	photos.forEach((photo) => {
		if (photo.style.display == "block") {
			photo.style.display = "none";
			current = photo.dataset.number;
			if (current == 0) {
				prev = photos.length - 1;
			} else {
				prev = Number(current) - 1;
			}
		}
	});

	photos.forEach((photo) => {
		if (photo.dataset.number == prev) {
			photo.style.display = "block";
			const caption = document.getElementById("caption")
			caption.innerHTML = photo.dataset.desc
		}
	});
}

function nextPhoto() {
	const photos = document.querySelectorAll(".photo-single--modal");
	let current;
	let next;
	photos.forEach((photo) => {
		if (photo.style.display == "block") {
			photo.style.display = "none";
			current = photo.dataset.number;
			if (current == photos.length - 1) {
				next = 0;
			} else {
				next = Number(current) + 1;
			}
		}
	});

	photos.forEach((photo) => {
		if (photo.dataset.number == next) {
			photo.style.display = "block";
			const caption = document.getElementById("caption");
			caption.innerHTML = photo.dataset.desc;
		}
	});
}

function clickThumbnail (thumbnailClicked) {
	const photos = document.querySelectorAll(".photo-single--modal");
	photos.forEach((photo) => {
		if (photo.style.display == "block") {
			photo.style.display = "none";
		}
	});

	photos.forEach((photo) => {
		if (photo.dataset.number == thumbnailClicked) {
			photo.style.display = "block";
			const caption = document.getElementById("caption");
			caption.innerHTML = photo.dataset.desc;
		}
	});

	const myModal = document.getElementById("myModal")
	myModal.scrollTo(0, 0);

}

document.addEventListener("click", (e) => {
	e.stopPropagation();

	// Click on photo
	if (e.target.parentElement.classList.contains("photos__single")) {
		const current = e.target.parentElement.dataset.number;
		openModal();
		chooseCurrentPhoto(current);
	}

	// Close modal
	if (e.target.classList.contains("close")) {
		closeModal();
	}

	if (e.target.classList.contains("prev")) {
		prevPhoto();
	}

	if (e.target.classList.contains("next")) {
		nextPhoto();
	}

	if (e.target.parentElement.classList.contains("thumbnail")) {
		const thumbnailClicked = e.target.parentElement.dataset.number
		clickThumbnail(thumbnailClicked);
	}
});


/////////////////////////////////////////////////////////////////////////
// Autocomplete 
function autocomplete(inp, arr) {
	/*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
	var currentFocus;
	/*execute a function when someone writes in the text field:*/
	inp.addEventListener("input", function (e) {
		var a,
			b,
			i,
			val = this.value;
		/*close any already open lists of autocompleted values*/
		closeAllLists();
		if (!val) {
			return false;
		}
		currentFocus = -1;
		/*create a DIV element that will contain the items (values):*/
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		/*append the DIV element as a child of the autocomplete container:*/
		this.parentNode.appendChild(a);
		/*for each item in the array...*/
		for (i = 0; i < arr.length; i++) {
			/*check if the item starts with the same letters as the text field value:*/
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				/*create a DIV element for each matching element:*/
				b = document.createElement("DIV");
				/*make the matching letters bold:*/
				b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
				b.innerHTML += arr[i].substr(val.length);
				/*insert a input field that will hold the current array item's value:*/
				b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
				/*execute a function when someone clicks on the item value (DIV element):*/
				b.addEventListener("click", function (e) {
					/*insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;
					/*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
					closeAllLists();
				});
				a.appendChild(b);
			}
		}
	});
	/*execute a function presses a key on the keyboard:*/
	inp.addEventListener("keydown", function (e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
			/*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
			currentFocus++;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 38) {
			//up
			/*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
			currentFocus--;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 13) {
			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			// e.preventDefault();
			closeAllLists();
			if (currentFocus > -1) {
				/*and simulate a click on the "active" item:*/
				if (x) x[currentFocus].click();
			}
		}
	});
	function addActive(x) {
		/*a function to classify an item as "active":*/
		if (!x) return false;
		/*start by removing the "active" class on all items:*/
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = x.length - 1;
		/*add class "autocomplete-active":*/
		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
		/*close all autocomplete lists in the document,
    except the one passed as an argument:*/
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	/*execute a function when someone clicks in the document:*/
	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
}

autocomplete(document.getElementById("country"), countries);