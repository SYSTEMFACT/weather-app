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

//falsy thurthy
//falsy 0, null, undefined, NaN, '', false, 
function App() {
  const [coords, setCoords] = useState(null)
  const [weather, setWeather] = useState(null)
  const [message, setMessage] = useState('')

  useEffect (() => {
    if (window.navigator.geolocation) {
        function success ({ coords }) {
          const { latitude, longitude } = coords
          setCoords({ lat: latitude, lon: longitude })
        }

        function error () {
          console.log('permission denied')
          // Solicitude error
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
          
          const newObject = {
            city: res.data.name,
            country: res.data.sys.country,
            temp: res.data.main.temp,
            description: res.data.weather[0].description,
            icon: icons[keys.find((k) => codes[k].includes(codeId))],
            wind: res.data.wind.speed,
            clouds: res.data.clouds.all,
            pressure: res.data.main.pressure
          }

          setWeather(newObject)            
        })
    }
  }, [coords])

  const styles = {
    display: 'grid',
    placeContent: 'center',
    height: '100dvh',
    texAling: 'center',
    backgroundColor: 'lightblue'
  }

  return (
    <div style={styles}>
        {weather && <Weather weather={weather} />}
        <h1> {message}</h1>
    </div>
  )
}

export default App
