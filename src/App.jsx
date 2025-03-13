import { useState, useEffect } from "react"
import axios from 'axios'
import Weather from "./componets/Weather"


// Se importa la llave del archivo .env
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const codes = {
  thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],
  rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
  snow: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
  atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  clear: [800],
  clouds: [801, 802, 803, 804]
}

const icons = {
  thunderstorm: '⛈️',
  drizzle: '🌦️',
  rain: '🌧️',
  snow: '❄️',
  atmosphere: '🌫️',
  clear: '☀️',
  clouds: '☁️'
}

const getTimezone = (countryCode, cityName) => {
  const timezones = {
    "PE": "America/Lima",
    "CL": cityName === "Punta Arenas" ? "America/Punta_Arenas" : "America/Santiago",
    "US": "America/New_York",
    // Agrega más zonas horarias según lo necesites
  };

  return timezones[countryCode] || "UTC";
};

function App() {
  const [coords, setCoords] = useState(null)
  const [weather, setWeather] = useState(null)
  const [message, setMessage] = useState('')
  const [timeOfDay, setTimeOfDay] = useState('day')

  useEffect (() => {
    if (window.navigator.geolocation) {
        function success ({ coords }) {
          const { latitude, longitude } = coords
          setCoords({ lat: latitude, lon: longitude })
        }

        function error () {
          console.log('permission denied')
          setMessage('Permission denied')
        }

        navigator.geolocation.getCurrentPosition(success, error)  
        } else {
          console.log('Geolocalitation is not sipported by this browser')
        }
  }, [])

  useEffect (() => {
    if (coords) {
      axios.get(`${BASE_URL}lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=en&appid=${API_KEY}`)
      .then((res) => {
          const codeId = res.data.weather[0].id
          const keys = Object.keys(codes)
          
          const weatherKey = keys.find((k) => codes[k].includes(codeId));

          const timezone = getTimezone(res.data.sys.country, res.data.name)

          const newObject = {
            city: res.data.name,
            country: res.data.sys.country,
            temp: res.data.main.temp,
            description: res.data.weather[0].description,
            icon: icons[weatherKey],
            wind: res.data.wind.speed,
            clouds: res.data.clouds.all,
            pressure: res.data.main.pressure,
            weatherType: weatherKey,
            timezone: timezone,
          };

          setWeather(newObject);
          
          const now = new Date();
          const options = { timeZone: timezone, hour: '2-digit', hour12: false };
          const localHour = parseInt(new Intl.DateTimeFormat('en-US', options).format(now));

          if (localHour >= 6 && localHour < 18) {
            setTimeOfDay('day');
          } else {
            setTimeOfDay('night');
          }

        })

        .catch((err) => {
          console.log(err);
          setMessage('Error fetching weather data');
        });
    }
  }, [coords]);

   // Determina la clase de fondo
   const backgroundClass = weather ? `${weather.weatherType} ${timeOfDay}` : 'clear day';

   return (
    <div className={`app-container ${backgroundClass}`}>
      {weather
        ? <Weather weather={weather} />
        : <h1 style={{ color: 'white' }}>{message || 'Loading weather data...'}</h1>}
    </div>
    
    );
}

export default App
