import React, { createContext, ReactNode, useState } from "react";
import * as Location from 'expo-location';
import { getCoordinatesByCity } from "../api/apiCalls";
import { ToastAndroid } from "react-native";
import { api_secret } from '../api/config.json';

interface WheatherProviderProps {
  children: ReactNode;
}

interface WeekItem {
  dt: number,
  sunrise: number,
  sunset: number,
  temp: {
    day: Number,
    min: number,
    max: number,
    night: Number,
    eve: Number,
    morn: Number
  },
  feels_like: {
    day: Number,
    night: Number,
    eve: Number,
    morn: Number
  },
  pressure: Number,
  humidity: Number,
  dew_point: Number,
  wind_speed: number,
  wind_deg: Number,
  weather: [
    {
      id: Number,
      main: String,
      description: String,
      icon: String
    }
  ],
  clouds: Number,
  pop: Number,
  rain: Number,
  uvi: Number
}

export interface HourlyPrevisionItem {
  dt: number,
  temp: number,
  feels_like: Number,
  pressure: Number,
  humidity: Number,
  dew_point: Number,
  uvi: Number,
  clouds: Number,
  visibility: Number,
  wind_speed: Number,
  wind_deg: Number,
  weather: [
    {
      id: Number,
      main: String,
      description: String,
      icon: string
    }
  ],
  rain: {
    '1h': Number;
  } | undefined;
  pop: Number
}

interface Data {
  today: {
    icon: String;
    description: String;
    temp: {
      now: Number;
      min: Number;
      max: Number;
      morning: Number;
      evenning: Number;
      night: Number;
      feelsLike: Number;
    }
    rain: Number | null;
    clouds: Number;
    windSpeed: Number;
    humidity: Number;
  },
  week: Array<WeekItem>;
  hourly: Array<HourlyPrevisionItem>
}

interface Coordinates {
  lat: Number;
  lon: Number;
}

interface WeatherContextData {
  city: String;
  coordinates: Coordinates;
  data: Data;
  loadingState: Boolean;
  refresh: () => void;
  searchCity: (City: String) => void;
  getByGeoLocation: () => void;
  hasLocationError: Boolean;
  weekDays: Array<String>;
  monthNames: Array<String>;
}

export const WeatherContext = createContext({} as WeatherContextData);

const weekDays = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];
const monthNames = [
  "jan",
  "fev",
  "mar",
  "abr",
  "maio",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export function WeatherProvider({ children }: WheatherProviderProps) {
  const [data, setData] = useState({} as Data);
  const [loadingState, setLoadingState] = useState(true);
  const [hasGeolocation, setHasGeolocation] = useState(false);
  const [hasLocationError, setHasLocationError] = useState(false);
  const [city, setCity] = useState('');
  const [coordinates, setCoordinates] = useState({} as Coordinates);

  async function getByGeoLocation() {
    setLoadingState(true);

    let res = await Location.requestPermissionsAsync();

    if (res.status === 'granted') {
      setHasGeolocation(true);
      console.log('Permission granted');

      try {
        const location = await Location.getCurrentPositionAsync({});

        const coord = {
          lat: location.coords.latitude,
          lon: location.coords.longitude
        };

        setCoordinates(coord);

        await fetchData({lat: coord.lat, lon: coord.lon}, true);
      } catch (error) {
        setHasLocationError(true);
        setLoadingState(false);
      }
    }

    setLoadingState(false);
  }
  
  async function searchCity(city: String) {
    if (city.length > 0) {
      setLoadingState(true);
    
      const coord = await getCoordinatesByCity(city);
      if (!coord.error) {
        setHasGeolocation(false);
        setCoordinates(coord.coordinates);
        setCity(`${coord.city}, ${coord.country}`);
        await fetchData({lat: coord.coordinates.lat, lon: coord.coordinates.lon}, false);
        setLoadingState(false);
      } else {
        setLoadingState(false);
        ToastAndroid.show("Cidade não encontrada", ToastAndroid.LONG);
      }
    } else {
      ToastAndroid.show('Nenhuma cidade.', ToastAndroid.SHORT);
    }
  }

  async function fetchData(coordinates: Coordinates, GeoLocation: Boolean) {
    console.log('Fetching data: ', coordinates);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&lang=pt_br&exclude=minutely&appid=${api_secret}`
    );
  
    const json = await response.json();
  
    if (!json.cod) {
      setData({
        today: {
          icon: json.current?.weather[0].icon,
          description: json.current?.weather[0].description,
          temp: {
            now: Math.round(json.current?.temp),
            min: Math.round(json.daily[0]?.temp.min),
            max: Math.round(json.daily[0]?.temp.max),
            morning: Math.round(json.daily[0]?.temp.morn),
            evenning: Math.round(json.daily[0]?.temp.eve),
            night: Math.round(json.daily[0]?.temp.night),
            feelsLike: Math.round(json.current.feels_like)
          },
          rain: json.daily[0].rain ? json.daily[0].rain : null,
          clouds: json.current?.clouds,
          windSpeed: json.current?.wind_speed,
          humidity: json.current?.humidity
        },
        week: json?.daily,
        hourly: json?.hourly        
      });
    }

    if (GeoLocation) {
      setCity("Localização atual");
    }
  }

  async function refresh() {
    setLoadingState(true);
    await fetchData({lat: coordinates.lat, lon: coordinates.lon}, hasGeolocation);
    setLoadingState(false);
  }

  return (
    <WeatherContext.Provider 
      value={{
        city,
        coordinates,
        data,
        loadingState,
        refresh,
        searchCity,
        getByGeoLocation,
        hasLocationError,
        weekDays,
        monthNames
      }}
    >
      { children }
    </WeatherContext.Provider>
  );
}
