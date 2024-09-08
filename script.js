"use strict";

const API = "ef47ca9e9bea144073a56fa044dadf3d";

const dayEL = document.querySelector(".default_day");
const dateEL = document.querySelector(".default_date");
const btnEL = document.querySelector(".btn_search");
const inputEL = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEL = document.querySelector(".day_info");
const listContentEL = document.querySelector(".List_content ul");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// display day
const day = new Date();
const dayName = days[day.getDay()];
dayEL.textContent = dayName;

// display date
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();
dateEL.textContent = date + " " + month + " " + year;

// add event
btnEL.addEventListener("click", (e) => {
  e.preventDefault();

  // Check empty value
  if (inputEL.value !== "") {
    const Search = inputEL.value;
    inputEL.value = "";
    findLocation(Search);
  } else {
    console.log("Please Enter City or Country Name");
  }
});

async function findLocation(name) {
  iconsContainer.innerHTML = "";
  dayInfoEL.innerHTML = "";
  listContentEL.innerHTML = "";
  try {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
    const data = await fetch(API_URL);
    const result = await data.json();
    console.log(result);

    if (result.cod !== "404") {
      // display image content
      const ImageContent = displayImageContent(result);

      // display Highlights
      const rightSide = rightSideContent(result);

      // forecast function
      displayForeCast(result.coord.lat, result.coord.lon);

      setTimeout(() => {
        iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
        dayInfoEL.insertAdjacentHTML("afterbegin", rightSide);
      }, 1500);
    } else {
      const message = `<h2 class="weather_temp" style="margin-top: 25px; font-size: 35px">${result.cod}</h2>
          <h3 class="cloudtxt" style="margin-top: 15px; font-size: 20px;">${result.message}</h3>`;
      iconsContainer.insertAdjacentHTML("afterbegin", message);
    }
  } catch (error) {}
}

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
