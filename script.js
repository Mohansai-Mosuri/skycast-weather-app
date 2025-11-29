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
                showError("Location permission denied.");
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
        console.error(error);
        showError("Error fetching weather data.");
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
document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeatherByCity();
    }
});