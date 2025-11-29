async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const weatherSection = document.getElementById("weatherSection");
    const errorMsg = document.getElementById("errorMsg");
    if (!city) return;
    try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();
        if (!geoData.results) {
            weatherSection.style.display = "none";
            errorMsg.style.display = "block";
            return;
        }
        const { latitude, longitude, name } = geoData.results[0];
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherResponse.json();
        document.getElementById("cityName").innerHTML = name;
        document.getElementById("temp").innerHTML = Math.round(weatherData.current_weather.temperature) + "°C";
        document.getElementById("wind").innerHTML = weatherData.current_weather.windspeed + " km/h";
        const code = weatherData.current_weather.weathercode;
        let conditionText = "Clear";
        if (code > 3) conditionText = "Cloudy";
        if (code > 50) conditionText = "Rainy";
        if (code > 70) conditionText = "Snow";
        document.getElementById("condition").innerHTML = conditionText;
        weatherSection.style.display = "block";
        errorMsg.style.display = "none";
    } catch (error) {
        console.error(error);
        weatherSection.style.display = "none";
        errorMsg.style.display = "block";
    }
}
document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});