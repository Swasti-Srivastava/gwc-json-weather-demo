// The city and state boxes on our page.
const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const stateInput = document.getElementById("stateInput");
const statusText = document.getElementById("status");

// Put weather numbers on the page.
function showWeather(city, state, temperature, humidity, wind, description) {
  document.getElementById("cityName").textContent = city + ", " + state;
  document.getElementById("temperature").textContent = Math.round(temperature) + "°F";
  document.getElementById("humidity").textContent = humidity + "%";
  document.getElementById("wind").textContent = Math.round(wind) + " mph";
  document.getElementById("description").textContent = description;
}

// The API gives us a number for the weather. Turn it into words.
function weatherDescription(code) {
  if (code === 0) return "Clear ☀️";
  if (code >= 71 && code <= 77) return "Snowy ❄️";
  if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return "Rainy 🌧️";
  if (code >= 95) return "Thunderstorm ⛈️";
  if (code === 45 || code === 48) return "Foggy 🌫️";
  return "Cloudy ⛅";
}

// Find the latitude and longitude for the city and state.
// This part is already done. We'll focus on the weather JSON in class.
async function findCity(city, state) {
  const url = "https://geocoding-api.open-meteo.com/v1/search?name=" +
    encodeURIComponent(city) + "&count=100&countryCode=US";
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not search for that city.");
  const data = await response.json();
  const places = data.results || [];

  // Cities can share names, so make sure the state matches too.
  const place = places.find(function (item) {
    return item.name.toLowerCase() === city.toLowerCase() &&
      item.admin1 === state;
  });
  if (!place) throw new Error("Couldn't find that city in that state.");
  return place;
}

// Start with sample data so the page isn't empty.
// Change weather.json, save, and refresh to see what happens.
async function loadSample() {
  try {
    const response = await fetch("./weather.json");
    if (!response.ok) throw new Error("Couldn't open weather.json");
    const sample = await response.json();
    showWeather(sample.city, sample.state, sample.weather.temperature,
      sample.weather.humidity, sample.weather.windSpeed,
      sample.weather.description);
    statusText.textContent = "Sample weather (not live yet)";
  } catch (error) {
    statusText.textContent = "Use Live Server in VS Code to open this page.";
    console.error(error);
  }
}

// Get live weather for the city someone searches.
async function getWeather(city, state) {
  statusText.textContent = "Getting live weather...";
  try {
    const place = await findCity(city, state);

    // Ask Open-Meteo for current weather at this location.
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" +
      place.latitude + "&longitude=" + place.longitude +
      "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
      "&temperature_unit=fahrenheit&wind_speed_unit=mph";

    // fetch gets the response. .json() lets us use its data in JavaScript.
    const response = await fetch(url);
    if (!response.ok) throw new Error("Couldn't get the weather.");
    const data = await response.json();
    console.log("Live weather JSON:", data);

    // current is an object inside the JSON. These are its values.
    const temperature = data.current.temperature_2m;
    const humidity = data.current.relative_humidity_2m;
    const wind = data.current.wind_speed_10m;
    const code = data.current.weather_code;

    showWeather(place.name, place.admin1, temperature, humidity,
      wind, weatherDescription(code));
    statusText.textContent = "Live weather from Open-Meteo";
  } catch (error) {
    statusText.textContent = error.message;
  }
}

// Run the search when someone clicks Get Weather.
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Don't refresh the whole page.
  const city = cityInput.value.trim();
  if (city) getWeather(city, stateInput.value);
});

// Show live Santa Cruz weather as soon as the page opens.
getWeather("Santa Cruz", "California");
