"use strict";

// API key for OpenWeatherMap
const API = "ef47ca9e9bea144073a56fa044dadf3d";

// DOM Elements
const dayEL = document.querySelector(".default_day");
const dateEL = document.querySelector(".default_date");
const btnEL = document.querySelector(".btn_search");
const inputEL = document.querySelector(".input_field");
const iconsContainer = document.querySelector(".icons");
const dayInfoEL = document.querySelector(".day_info");
const listContentEL = document.querySelector(".List_content ul");

// Days array for date display
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Display current day and date
function displayDateTime() {
    const day = new Date();
    // Set day name
    const dayName = days[day.getDay()];
    dayEL.textContent = dayName;
    
    // Set date
    let month = day.toLocaleString("default", { month: "long" });
    let date = day.getDate();
    let year = day.getFullYear();
    dateEL.textContent = date + " " + month + " " + year;
}

// Search functionality
btnEL.addEventListener("click", (e) => {
    e.preventDefault();
    performSearch();
});

inputEL.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
    }
});

function performSearch() {
    if (inputEL.value !== "") {
        const Search = inputEL.value;
        inputEL.value = "";
        findLocation(Search);
    }
}

// Main function to fetch and display weather data
async function findLocation(name) {
    clearContainers();
    try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
        const data = await fetch(API_URL);
        const result = await data.json();
        
        if (result.cod === 200) {
            // Update location name
            document.getElementById('LValue').textContent = result.name;
            
            // Update map
            updateMap(result.coord.lat, result.coord.lon, result.name);

            // Update weather display
            changeBackground(result.weather[0].main);
            displayWeatherInfo(result);
            displayForeCast(result.coord.lat, result.coord.lon);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Helper functions
function clearContainers() {
    iconsContainer.innerHTML = "";
    dayInfoEL.innerHTML = "";
    listContentEL.innerHTML = "";
}

function displayWeatherInfo(result) {
    const ImageContent = displayImageContent(result);
    const rightSide = rightSideContent(result);
    
    setTimeout(() => {
        iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
        dayInfoEL.insertAdjacentHTML("afterbegin", rightSide);
    }, 1500);
}

// Initialize
displayDateTime();

// display Image content and temp
function displayImageContent(data) {
  return `<img src="https://openweathermap.org/img/wn/${
    data.weather[0].icon
  }@4x.png" alt="">
          <h2 class="weather_temp">${Math.round(data.main.temp - 275.15)}°C</h2>
          <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

function rightSideContent(result) {
  return `<div class="category">
                            <div class="locationName">
                                <i class="fa-solid fa-water"></i>
                                Name
                                <h1 id="HValue">${result.name}</h1>
                            </div>
                        </div>
                        <div class="category">
                            <div class="wind-speed">
                                <i class="fa-solid fa-wind"></i>
                                Wind Speed
                                <h1 id="WValue">${result.wind.speed}km/h</h1>
                            </div>
                        </div>
                        <div class="category">
                            <div class="sun2">
                                <i class="fa-solid fa-sun"></i>
                                Sunrise
                                <h1 id="sunRise">${new Date(
                                  result.sys.sunrise * 1000
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}</h1>
                            </div>
                        </div>
                        <div class="category">
                            <div class="sun3">
                                <i class="fa-regular fa-sun"></i>
                                Sunset
                                <h1 id="sunSet">${new Date(
                                  result.sys.sunset * 1000
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}</h1>
                            </div>
                        </div>
                        <div class="category">
                            <div class="clouds">
                                <i class="fa-solid fa-cloud"></i>
                                Clouds
                                <h1 id="CValue">${result.clouds.all} %</h1>
                            </div>
                        </div>
                        <div class="category">
                            <div class="humidity">
                                <i class="fa-solid fa-water"></i>
                                Humidity
                                <h1 id="HValue">${result.main.humidity} %</h1>
                            </div>
                        </div>
                        <div class="category">
                            <div class="pressure">
                                <i class="fa-solid fa-volcano"></i>
                                Pressure
                                <h1 id="PValue">${result.main.pressure} hPa</h1>
                            </div>
                        </div>`;
}

async function displayForeCast(lat, long) {
  const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
  const data = await fetch(ForeCast_API);
  const result = await data.json();

  // filter the forecast
  const uniqeForeCastDays = [];
  const daysForecast = result.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqeForeCastDays.includes(forecastDate)) {
      return uniqeForeCastDays.push(forecastDate);
    }
  });
  console.log(daysForecast);

  daysForecast.forEach((content, indx) => {
    if (indx <= 6) {
      listContentEL.insertAdjacentHTML("afterbegin", forecast(content));
    }
  });
}

// forecast html element data
function forecast(frContent) {
  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()];
  const splitDay = dayName.split("", 3);
  const joinDay = splitDay.join("");
  
  const date = day.getDate();
  
  const month = day.toLocaleString("default", { month: "short" });
  
  return `<li>
              <p class="default_date1">${date + " " + month+ "," + joinDay}</p>
              <img src="https://openweathermap.org/img/wn/${
                frContent.weather[0].icon
              }@4x.png" alt="">
              <p>${frContent.weather[0].main}</p>
              <p class="day_te">${Math.round(
                frContent.main.temp - 275.15
              )}°C</p>
          </li>`;
}

// Add this function to change background based on weather
function changeBackground(weatherCondition) {
  const bgElement = document.querySelector('.bg');
  
  // Weather condition mappings
  const weatherBackgrounds = {
      'Clear': 'assets/images/Clear.webp',
      'Clouds': 'assets/images/Cloudy.jpg',
      'Rain': 'assets/images/Rainy.jpg',
      'Drizzle': 'assets/images/Rainy.jpg',
      'Thunderstorm': 'assets/images/Stormy.jpg',
      'Snow': 'assets/images/snow.webp',
      'Mist': 'assets/images/fog.png',
      'Fog': 'assets/images/fog.png',
      'Haze': 'assets/images/fog.png',
      'default': 'assets/images/Stormy.webp'  // Your default background
  };

  // Get the background image URL based on weather condition
  const backgroundUrl = weatherBackgrounds[weatherCondition] || weatherBackgrounds.default;
  
  // Update the background
  bgElement.style.background = `url(${backgroundUrl}) center/cover no-repeat`;
}

// Function to update map with new location
function updateMap(lat, lng, locationName) {
  if (map && marker) {
    // Create LatLng object
    const position = new google.maps.LatLng(lat, lng);
    
    // Update map center and zoom
    map.setCenter(position);
    map.setZoom(12);
    
    // Update marker position
    marker.setPosition(position);
    marker.setVisible(true);
    
    // Optional: Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="color: black;">${locationName}</div>`
    });
    
    // Show info window when clicking marker
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  }
}

// Initialize map
function initMap() {
  // Default location (can be anywhere)
  const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // India's center

  // Create map
  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: defaultLocation,
      mapTypeControl: true
  });

  // Create marker (initially hidden)
  marker = new google.maps.Marker({
      map: map,
      visible: false
  });
}

let map;
let marker;
let autocomplete;

// Initialize the map with error handling
function initializeMap() {
  try {
    const defaultLocation = { lat: 40.7128, lng: -74.0060 };

    // Create map with disabled controls
    map = new google.maps.Map(document.getElementById('map'), {
      center: defaultLocation,
      zoom: 13,
      mapTypeControl: false,     // Removes Map/Satellite toggle
      streetViewControl: false,  // Removes street view control
      zoomControl: false,        // Removes zoom controls
    });

    // Create marker
    marker = new google.maps.Marker({
      map: map,
      position: defaultLocation,
      draggable: true,
      animation: google.maps.Animation.DROP
    });

    // Initialize autocomplete
    const input = document.getElementById('userLocation');
    autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['geocode', 'establishment'],
    });

    // Bind autocomplete to map
    autocomplete.bindTo('bounds', map);

    // Listen for place selection
    autocomplete.addListener('place_changed', function() {
      const place = autocomplete.getPlace();

      // Verify we have a valid place
      if (!place.geometry || !place.geometry.location) {
        window.alert("No details available for: '" + place.name + "'");
        return;
      }

      // Update map view
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      // Update marker
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      // You can store the location data if needed
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      console.log(`Selected location: ${lat}, ${lng}`);
    });

    // Handle marker drag events
    marker.addListener('dragend', function() {
      const position = marker.getPosition();
      const lat = position.lat();
      const lng = position.lng();
      console.log(`Marker dragged to: ${lat}, ${lng}`);
    });

  } catch (error) {
    console.error('Error initializing map:', error);
    document.getElementById('map').innerHTML = 'Error loading map. Please check your API key and internet connection.';
  }
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeMap();
});

// Handle potential loading errors
window.gm_authFailure = function() {
  document.getElementById('map').innerHTML = 
    'Google Maps authentication failed. Please check your API key.';
};