# 🌤️ SkyCast - Professional Weather Dashboard

**SkyCast** is a modern, responsive weather application built with Vanilla JavaScript. It features a "Glassmorphism" UI design, real-time weather data, 5-day forecasting, and automatic user location detection using the Browser Geolocation API.

🔗 **https://mohansai-mosuri.github.io/skycast-weather-app/

## ✨ Key Features

* **📍 Auto-Location Detection:** Uses the `navigator.geolocation` API to instantly fetch weather for the user's current location without manual input.
* **📅 5-Day Forecast:** Displays a predictive weather cards for the upcoming week, including daily highs/lows and conditions.
* **🎨 Glassmorphism UI:** Features a modern, semi-transparent interface with backdrop filters and a high-quality dynamic background.
* **⚡ Asynchronous Data Fetching:** Uses `async/await` to handle API requests smoothly without blocking the main thread.
* **📱 Fully Responsive:** Optimized for desktops, tablets, and mobile devices using CSS Flexbox and media queries.
* **🛡️ Error Handling:** Gracefully manages network errors, invalid city names, and denied location permissions.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Flexbox, CSS Variables, Backdrop Filter), JavaScript (ES6+)
* **API:** [Open-Meteo API](https://open-meteo.com/) (Free, No API Key required)
* **Deployment:** GitHub Pages

## 📂 Project Structure

```bash
skycast-weather-app/
├── index.html      # Main structure with semantic HTML5
├── style.css       # Custom styling, animations, and glassmorphism effects
├── script.js       # Logic for Geolocation, API fetching, and DOM manipulation
└── README.md       # Project documentation
````

## 🚀 How It Works

1.  **Geolocation:** When the user clicks the "Location" icon, the app requests permission to access the device's GPS coordinates.
2.  **API Request:** It sends the coordinates (Lat/Lon) to the Open-Meteo API to fetch both current weather and a 7-day daily forecast array.
3.  **Data Processing:** JavaScript processes the raw JSON data, mapping numeric "Weather Codes" (WMO) to human-readable text (e.g., Code 61 → "Rainy").
4.  **Dynamic Rendering:** The app clears the previous state and injects new HTML cards into the DOM for the 5-day forecast.

## 🔮 Future Improvements

  *  Add a search history feature using `localStorage`.
  *  Implement dynamic background images that change based on the weather condition (e.g., Rainy background for rain).
  *  Add unit conversion toggle (Celsius to Fahrenheit).

-----
