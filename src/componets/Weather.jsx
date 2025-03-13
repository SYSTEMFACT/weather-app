import { useState, useEffect } from "react";

function Weather({ weather }) {
  const [isFah, setIsFah] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState("day");

  if (!weather || weather.temp == null) {
    return <h2>No hay datos de temperatura disponibles.</h2>;
  }

  const temperature = isFah ? (weather.temp * 9 / 5) + 32 : weather.temp;

  // Verificar si es de día o de noche basado en la zona horaria
  useEffect(() => {
    const localTime = new Date().toLocaleString("en-US", {
      timeZone: weather.timezone, 
      hour: '2-digit',
      hour12: false
    });

    const hour = parseInt(localTime, 10);
    if (hour >= 6 && hour < 18) {
      setTimeOfDay("day");
    } else {
      setTimeOfDay("night");
    }
  }, [weather.timezone]);

  return (
    <div className={`weather-container ${weather.condition} ${timeOfDay}`}>
      <h1>Weather App</h1>
      <p>{weather.city}, {weather.country}</p>

      <div className="weather-icon">
        <span role="img" aria-label='icon'>
          {weather.icon}
        </span>
      </div>

      <div className="weather-info">
        <h2>"{weather.description}"</h2>
        <ul className="weather-details">
          <li>Wind Speed: <strong>{weather.wind} m/s</strong></li>
          <li>Clouds: <strong>{weather.clouds}%</strong></li>
          <li>Pressure: <strong>{weather.pressure} hPa</strong></li>
        </ul>
      </div>

      <div className="weather-temp">
        <h3>{Math.ceil(temperature)} {isFah ? '°F' : '°C'}</h3>
        <button className="weather-button" onClick={() => setIsFah(!isFah)}>
          Change to {isFah ? 'Celsius' : 'Fahrenheit'}
        </button>
      </div>
    </div>
  );
}

export default Weather;