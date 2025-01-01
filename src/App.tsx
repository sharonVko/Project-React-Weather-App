import { useEffect, useState } from 'react';
import './App.css';
import ILocation from '../interfaces/ILocation';
import IWeather from '../interfaces/IWeather';

const apiKey = import.meta.env.VITE_API_KEY;

function App() {
 /*  console.log(apiKey); */
  
  const [searchInput, setSearchInput] = useState<string>("");
  const [location, setLocation] = useState<ILocation | null>(null);
  const [weatherData, setWeatherData] = useState<IWeather | null>(null);
  // State for sunset mode
  const [isSunset, setIsSunset] = useState<boolean>(false);

  //- fetch for location first
  const getLocation = () => {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => setLocation(data[0]));
    setSearchInput(""); // Reset the input field
  }

  //- fetch weather data
  useEffect(() => {
    if (location) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then((data: IWeather) => {
          setWeatherData(data);
          checkSunset(data); // Check for sunset
        })
        /* console.log(location); */
        
    }
  }, [location]);
  /* console.log(weatherData) */

  //- Check sunset mode, when weatherData is changing
  useEffect(() => { 
    if (weatherData) { 
      checkSunset(weatherData); 
    }
  }, [weatherData]);

  //- add / remove sunset-mode to body for bg-color with ternary
  useEffect(() => {
    document.body.className = isSunset ? 'sunset-mode' : ''; 
    console.log('isSunset useEffect:', isSunset);
  }, [isSunset]);

  //- show weather matching icons / night.gif in sunset mode
  const getWeatherIcon = (iconCode: string) => { 
    console.log('isSunset:', isSunset, 'iconCode:', iconCode);

    if (isSunset) { 
      return '/weather-icons/night.gif'; 
    } 
    
    switch (iconCode) { 
      case '01d': return '/weather-icons/sun.gif';
      case '02d': return '/weather-icons/cloudy.gif';
      case '03d': return '/weather-icons/cloudy.gif';
      case '04d': return '/weather-icons/cloudy.gif';
      case '09d': return '/weather-icons/rain.gif';
      case '10d': return '/weather-icons/rain.gif';
      case '11d': return '/weather-icons/storm.gif';
      case '13d': return '/weather-icons/snow.gif';
      case '50d': return '/weather-icons/foggy.gif';
      default: return '/weather-icons/whirlwind.gif';
    } 
  }

   //-  sun-status (formatting time stamp)
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  //- Function to check sunset mode 
  const checkSunset = (data: IWeather) => {
    const sunsetTime = new Date(data.sys.sunset * 1000);
    const currentTime = new Date();
    console.log('sunsetTime:', sunsetTime.toLocaleString(), 'currentTime:', currentTime.toLocaleString());

    // checking currentTime and sun status to return the matching creen
    if (currentTime >= sunsetTime) { 
      setIsSunset(true);
    } else { 
      setIsSunset(false);
    }
    console.log('isSunset in checkSunset:', isSunset);
  };

  return (
    <div className={isSunset ? 'sunset-mode' : ''}>
      <section className='seach-bar'>
        <input 
          type="text" 
          placeholder='Please enter a city' 
          value={searchInput} 
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchInput(event?.target.value)}
        />
        <button type="button" onClick={getLocation}>Search</button>
      </section>
    
      <section className='weather-card__wrapper'>
        {!weatherData && (
          <div className='temperature-display'>
            <h1 className="fall-and-bounce">Daily Weather Forecast</h1>
            <img className='weather-icon' src="/weather-icons/sun-startview.gif" alt="🌈" />
          </div>
        )}

        {weatherData && (
          <article className='weather-card'>
            <h1>{location?.name}</h1>
            <div>
              {weatherData?.weather.map((weatherInfo, index) => (
                <div key={index}>
                  <div className='temperature-display'>
                    <h2>{weatherData?.main.temp.toFixed(0)} °</h2>
                    <img className="weather-icon" src={getWeatherIcon(weatherInfo.icon)} alt={weatherInfo.description} />
                  </div>
                  <p className='info'>{weatherInfo.main}</p>
                </div>
              ))}
            </div>
            <div className='wind'>
              <p>Wind: {weatherData?.wind.speed.toFixed(1)} km/h</p>
              <p>Humidity: {weatherData?.main.humidity} %</p>
            </div>
            <p>Feels like {weatherData?.main.feels_like.toFixed(0)} °C</p>
            <div className='sun-status'>
              <p>Sunrise: {weatherData?.sys.sunrise && formatTime(weatherData.sys.sunrise)}</p>
              <p>Sunset: {weatherData?.sys.sunset && formatTime(weatherData.sys.sunset)}</p>
            </div>
          </article>
        )}
      </section>
    </div>
  )
}

export default App;
