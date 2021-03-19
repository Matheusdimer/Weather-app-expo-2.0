import { api_secret } from './config.json';

interface CoordinatesProps {
  lat: Number;
  lon: Number;
}

interface Test {
  icon: String;
}

export async function getCoordinatesByCity(city: String) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_secret}`
  );

  const json = await response.json();

  return {
    error: json.cod !== 200 ? json.message : null,
    coordinates: {
      lat: json.coord?.lat,
      lon: json.coord?.lon,
    },
    city: json?.name,
    country: json.sys?.country
  };
}
