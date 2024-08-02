import React, { createContext, useState, useContext, ReactNode } from 'react';

interface WeatherData {
  cityName: string;
  condition: string;
  conditionIcon: string;
  temperature: number;
  humidity: number;
  wind: number;
  feelsLike: number;
  cloud: number;
  time: string;
}

interface WeatherContextType {
  weatherData: WeatherData;
  setWeatherData: React.Dispatch<React.SetStateAction<WeatherData>>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    cityName: 'London',
    condition: '',
    conditionIcon: '',
    temperature: 0,
    humidity: 0,
    wind: 0,
    feelsLike: 0,
    cloud: 0,
    time: '',
  });

  return (
    <WeatherContext.Provider value={{ weatherData, setWeatherData }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
