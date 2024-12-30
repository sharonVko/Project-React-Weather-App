
import { useEffect, useState } from 'react';
import './App.css'
import ILocation from '../interfaces/ILocation';
import IWeather from '../interfaces/IWeather';

/* const apiLink = import.meta.env.VITE_API_LINK */
/* 1. innput feld auslesen ✅ */
/* 2.onclick bei btn click mithilfe der api lat und long ✅ */
/* 3. lat und long in einem anderen state speichern , wird getrennt und zuerst gefetchted ✅*/
/* 4. hauptfetch für wetterdaten */
const apiKey = import.meta.env.VITE_API_KEY

function App() {

console.log(apiKey);

const[searchInput, setSearchInput] = useState<string>("")
const[location, setLocation] = useState<ILocation | null>(null)
const[weatherData, setWeatherData] = useState<IWeather | null>(null)
  
const getLocation = () => {
  fetch (`https://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&appid=${apiKey}`)
  
  .then(response => response.json())
  .then(data => setLocation(data[0]));
  setSearchInput(""); // Reset the input field
}

/* console.log(searchInput); */

useEffect(() => {
  if(location){
   fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`)

   .then(response => response.json())
   .then((data:IWeather )=> setWeatherData(data))
  /* console.log(location); */
}
}, [location])
  console.log(weatherData);

  //? test icons
  const getWeatherIcon = (iconCode: string) => { switch(iconCode) { 
    case '01d': return '/src/assets/weather-icons/sun.gif'; 
    case '01n': return '/src/assets/weather-icons/night.gif'; 
    case '02d': case '02n': return '/src/assets/weather-icons/cloudy.gif';
     case '03d': case '03n': return '/src/assets/weather-icons/cloudy.gif';
      case '04d': case '04n': return '/src/assets/weather-icons/cloudy.gif';
       case '09d': case '09n': return '/src/assets/weather-icons/rain.gif'; 
       case '10d': case '10n': return '/src/assets/weather-icons/rain.gif'; 
       case '11d': case '11n': return '/src/assets/weather-icons/storm.gif'; 
       case '13d': case '13n': return '/src/assets/weather-icons/snow.gif'; 
       case '50d': case '50n': return '/src/assets/weather-icons/foggy.gif'; 
       default: return '/src/assets/weather-icons/whirlwind.gif'; } };

  //- test day night
  const formatTime = (timestamp: number) => {
    // Funktion zum Formatieren der Unix-Zeit. Umwandeln der Zeit in Millisekunden
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  return (
    <>
    <section className='seach-bar'>
     <input type="text" name="" id="" placeholder='Please enter a city' value={searchInput} onChange={(event: React.ChangeEvent<HTMLInputElement>)=> setSearchInput(event?.target.value)}/>
     <button type="button" onClick={getLocation}>Search</button>
     </section>
    
      {weatherData && (
    <section className='weather-card__wrapper'>
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
       <p>Feels like{weatherData?.main.feels_like.toFixed(0)} c°</p>
       <div className='sun-status'>
          <p>Sunrise: {weatherData?.sys.sunrise && formatTime(weatherData.sys.sunrise)}</p> 

          <p>Sunset: {weatherData?.sys.sunset && formatTime(weatherData.sys.sunset)}</p>
         
      </div>
     </article>
     </section>
     )};
    </>
  )
}

export default App
