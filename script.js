document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const locationBtn = document.getElementById("locationBtn");
    const cityInput = document.getElementById("cityInput");

    searchBtn.addEventListener("click", getWeatherByCity);
    locationBtn.addEventListener("click", getUserLocation);

    cityInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            getWeatherByCity();
        }
    });
});

async function getWeatherByCity() {
    const city = document.getElementById("cityInput").value;
    if (!city) return;

    try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();

        if (!geoData.results) {
            showError("City not found.");
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];
        fetchWeatherData(latitude, longitude, name);

    } catch (error) {
        showError("Failed to fetch location.");
    }
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherData(latitude, longitude, "My Location"); 
            },
            (error) => {
                showError("Location access denied. Please enable permissions.");
            }
        );
    } else {
        showError("Geolocation is not supported by your browser.");
    }
}

async function fetchWeatherData(lat, lon, cityName) {
    const weatherSection = document.getElementById("weatherSection");
    const errorMsg = document.getElementById("errorMsg");

    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await response.json();

        document.getElementById("cityName").innerHTML = cityName;
        document.getElementById("temp").innerHTML = Math.round(data.current_weather.temperature) + "°C";
        document.getElementById("wind").innerHTML = data.current_weather.windspeed + " km/h";
        document.getElementById("condition").innerHTML = getConditionText(data.current_weather.weathercode);

        // TRIGGER THE BACKGROUND EFFECT HERE
        updateBackgroundEffect(data.current_weather.weathercode);

        const forecastContainer = document.getElementById("forecastContainer");
        forecastContainer.innerHTML = ""; 

        for (let i = 0; i < 5; i++) {
            const dateStr = data.daily.time[i];
            const maxTemp = Math.round(data.daily.temperature_2m_max[i]);
            const minTemp = Math.round(data.daily.temperature_2m_min[i]);
            const code = data.daily.weathercode[i];

            const date = new Date(dateStr);
            const dayName = date.toLocaleDateString("en-US", { weekday: 'short' });

            const card = `
                <div class="day-card">
                    <div class="day-name">${dayName}</div>
                    <div class="day-icon">${getWeatherIcon(code)}</div>
                    <div class="day-temp">${maxTemp}° / ${minTemp}°</div>
                </div>
            `;
            forecastContainer.innerHTML += card;
        }

        weatherSection.style.display = "block";
        errorMsg.style.display = "none";

    } catch (error) {
        showError("Error fetching weather data.");
    }
}

// === NEW FUNCTION: HANDLES BACKGROUND EFFECTS ===
function updateBackgroundEffect(code) {
    const bgContainer = document.getElementById("bg-effects");
    bgContainer.innerHTML = ""; // Clear previous effects

    // 1. Rain (Codes: 51-67, 80-82)
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
        createRain(bgContainer);
    } 
    // 2. Snow (Codes: 71-77, 85-86)
    else if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
        createSnow(bgContainer);
    } 
    // 3. Fog (Codes: 45, 48)
    else if (code === 45 || code === 48) {
        const fog = document.createElement("div");
        fog.classList.add("fog-layer");
        bgContainer.appendChild(fog);
    }
    // 4. Sunny/Clear (Codes: 0, 1)
    else if (code <= 1) {
        const sun = document.createElement("div");
        sun.classList.add("sun-glow");
        bgContainer.appendChild(sun);
    }
}

function createRain(container) {
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement("div");
        drop.classList.add("raindrop");
        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = Math.random() * 1 + 0.5 + "s"; // Random speed
        drop.style.animationDelay = Math.random() * 2 + "s";
        container.appendChild(drop);
    }
}

function createSnow(container) {
    for (let i = 0; i < 50; i++) {
        const flake = document.createElement("div");
        flake.classList.add("snowflake");
        flake.style.left = Math.random() * 100 + "vw";
        flake.style.width = Math.random() * 10 + 5 + "px"; // Random size
        flake.style.height = flake.style.width;
        flake.style.opacity = Math.random();
        flake.style.animationDuration = Math.random() * 3 + 2 + "s"; // Slower than rain
        flake.style.animationDelay = Math.random() * 5 + "s";
        container.appendChild(flake);
    }
}

function getConditionText(code) {
    if (code === 0) return "Clear";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snow";
    return "Stormy";
}

function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 67) return "🌧️";
    return "🌨️";
}

function showError(message) {
    document.getElementById("weatherSection").style.display = "none";
    document.getElementById("errorMsg").style.display = "block";
    document.getElementById("errorText").innerText = message;
}