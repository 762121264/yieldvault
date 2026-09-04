const $ = (sel) => document.querySelector(sel);

function showError(msg) {
  const el = $('#error');
  el.textContent = msg;
  el.classList.add('visible');
}

function clearError() {
  const el = $('#error');
  el.textContent = '';
  el.classList.remove('visible');
}

function showWeather(data) {
  clearError();
  $('#weather').classList.remove('hidden');
  $('#location').textContent = `${data.name}, ${data.sys.country}`;
  $('#temp').textContent = `${Math.round(data.main.temp)}°C`;
  $('#desc').textContent = data.weather[0].description;
  $('#more').innerHTML = `Humidity: ${data.main.humidity}% &nbsp;|&nbsp; Wind: ${Math.round(data.wind.speed)} m/s`;
  const iconCode = data.weather[0].icon;
  $('#icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  $('#icon').alt = data.weather[0].description;
}

function showLoading() {
  $('#weather').classList.add('hidden');
  clearError();
}

async function fetchWeatherByCity(city) {
  const apiKey = window.OPEN_WEATHER_MAP_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') return showError('Missing API key — create config.js from config.example.js and add your OpenWeatherMap API key.');
  try {
    showLoading();
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('City not found.');
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    showWeather(data);
  } catch (err) {
    showError(err.message);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  const apiKey = window.OPEN_WEATHER_MAP_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') return showError('Missing API key — create config.js from config.example.js and add your OpenWeatherMap API key.');
  try {
    showLoading();
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    showWeather(data);
  } catch (err) {
    showError(err.message);
  }
}

// UI wiring
document.addEventListener('DOMContentLoaded', () => {
  const cityInput = $('#city-input');
  const searchBtn = $('#search-btn');
  const locBtn = $('#loc-btn');

  searchBtn.addEventListener('click', () => {
    const q = cityInput.value.trim();
    if (!q) return showError('Please enter a city.');
    fetchWeatherByCity(q);
  });

  cityInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') searchBtn.click();
  });

  locBtn.addEventListener('click', () => {
    if (!navigator.geolocation) return showError('Geolocation is not supported by your browser.');
    navigator.geolocation.getCurrentPosition((pos) => {
      fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
    }, (err) => showError('Unable to retrieve your location.'));
  });
});
