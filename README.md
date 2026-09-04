# YieldVault — Weather Dashboard

A simple single-page Weather Dashboard that fetches current weather data from the OpenWeatherMap public API. This is a starter front-end app (HTML/CSS/JS) intended for local use or static hosting.

Features
- Search weather by city name
- Use browser geolocation to get weather for your current location
- Displays temperature, description, humidity, wind speed, and an icon

Quickstart
1. Clone the repo:
   git clone https://github.com/762121264/yieldvault.git
2. Create a config file with your OpenWeatherMap API key:
   - Copy config.example.js to config.js and replace YOUR_API_KEY_HERE with your key.
     cp config.example.js config.js
3. Serve the folder with a static server (or open index.html directly, but some browsers restrict geolocation/XML requests when opened from the file system):
   - Python 3: python -m http.server 8000
   - Then open http://localhost:8000 in your browser.

Get an API key
- Sign up at https://openweathermap.org/ to get a free API key.

Deployment
- This is a static site and can be deployed to GitHub Pages, Netlify, Vercel, or any static hosting provider.

Next steps you might want me to do
- Add forecast (5-day) view
- Use a build tool (React/Vite) for better UX
- Store API key securely using server-side proxy or environment variables for production
