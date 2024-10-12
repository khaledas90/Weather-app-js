const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".city-input");
const currentWeatherDiv = document.querySelector(".current-weather");
const WeatherCardDiv = document.querySelector(".weather-cards");
const API_KEY = `09c658c48dac5ad62f7620c1ef904952`;

const ShowDetails = (nameCity, element, index) => {
    if (index === 0) {
        return `
        <div class="details">
            <h2>${nameCity} (${element.dt_txt.split(" ")[0]})</h2>
            <h6>Temperature: ${(element.main.temp - 273.15).toFixed(2)}°C</h6>
            <h6>Wind: ${element.wind.speed} M/S</h6>
            <h6>Humidity:${element.main.humidity} %</h6>
        </div>
        <div class="icon">
            <img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@4x.png" alt="weather-icon">
            <h6>${element.weather[0].description}</h6>
        </div>`;
    } else {
        return `<li class="card">
            <h3>${element.dt_txt.split(" ")[0]}</h3>
            <img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@4x.png" alt="weather-icon">
            <h6>Temp: ${(element.main.temp - 273.15).toFixed(2)}°C</h6>
            <h6>Wind: ${element.wind.speed} M/S</h6>
            <h6>Humidity: ${element.main.humidity}%</h6>
        </li>`;
    }
};

const getWeatherDetails = (nameCity, lat, lon) => {
    let Days_API_KEY = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(Days_API_KEY)
        .then((res) => res.json())
        .then((data) => {
            const uniqForestDar = [];
            const FiveDayForest = data.list.filter((filterDay) => {
                const Forcest = new Date(filterDay.dt_txt).getDate();
                if (!uniqForestDar.includes(Forcest)) {
                    return uniqForestDar.push(Forcest);
                }
            });

            WeatherCardDiv.innerHTML = "";
            currentWeatherDiv.innerHTML = ""; 
            console.log(FiveDayForest);

            FiveDayForest.forEach((element, index) => {
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", ShowDetails(nameCity, element, index));
                } else {
                    WeatherCardDiv.insertAdjacentHTML('beforeend', ShowDetails(nameCity, element, index));
                }
            });
        })
        .catch(() => {
            alert("An error occurred while fetching Weather Forecast!");
        });
};

const GetCityName = () => {
    let valInput = searchInput.value.trim();
    if (valInput === "") return "No input provided";

    let Good_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${valInput}&limit=1&appid=${API_KEY}`;

    fetch(Good_API_URL)
        .then((res) => res.json())
        .then((data) => {
          
            if (!data || data.length === 0) return `No Data Found In ${valInput}`;
            const { lat, lon, name } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
};

searchBtn.addEventListener("click", GetCityName);
