import { use, useState } from "react";

function Weather({ weather }) {
    const [isFah, setIsFah] = useState(false);
    //(0 °c x 9/5) + 32 = 32 °F
    const temperature = isFah ? (weather.temp * 9 / 5) + 32 : weather.temp;

  return (
    <div className="weather-container">
        <h1> Weather App</h1>
        <p>{weather.city}, {weather.country}</p>

        <div className="weather-icon">
            <span role="img" aria-label='icon'>
                {weather.icon}
            </span>
        </div>

        <div className="weather-info">
            <h2>"{weather.description}"</h2>
            <ul className="weather-details">
                <li>Wind Speed <strong>{weather.wind} m/s</strong></li>
                <li>Clouds <strong>{weather.clouds}%</strong></li>
                <li>Pressure <strong>{weather.pressure} hPa</strong></li>
            </ul>
        </div>  

        <div className="weather-temp">
            <h3>{Math.ceil(temperature)} {isFah ? '°F' : '°C'}</h3>
            <button className="weather-button" onClick={() => setIsFah(!isFah)}>
                Change to {isFah ? 'Celsius': 'Fahrenheit'}
            </button>
        </div>   
    </div>
  );
}

export default Weather
