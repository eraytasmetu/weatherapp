import { View, Text, Image ,ScrollView} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextInput, Button, ActivityIndicator, Card } from 'react-native-paper';
import { useWeather } from '../../app/WeatherContext';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';

const API = "95729f1ede4e429c998110909240907";

const Home = () => {
    const { weatherData, setWeatherData } = useWeather(); 
    const [tempCityName, setTempCityName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [cityName, setCityName] = useState('London');
    const [possibleCities, setPossibleCities] = useState<string[]>([]);
    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${API}&q=${cityName}`);
                setWeatherData({
                    cityName: response.data.location.name,
                    condition: response.data.current.condition.text,
                    conditionIcon: response.data.current.condition.icon,
                    temperature: response.data.current.temp_c,
                    humidity: response.data.current.humidity,
                    wind: response.data.current.wind_kph,
                    feelsLike: response.data.current.feelslike_c,
                    cloud: response.data.current.cloud,
                    time: response.data.location.localtime.split(" ")[1],
                });
                setLoading(false);
                
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchWeatherData();
    }, [cityName]);
    const handlePossibleCityNames = async (cityName: string) => {
        try {
            const response = await axios.get(`https://api.weatherapi.com/v1/search.json?key=${API}&q=${cityName}`);
            return response.data.map((city: { name: string }) => city.name);
        } catch (error) {
            return [];
        }
    }
    const handleCityChange = async (text: string) => {
        setTempCityName(text);
        const cities = await handlePossibleCityNames(text);
        setPossibleCities(cities);
    };
    const handleFetchWeather = () => {
        setCityName(tempCityName);
        setLoading(true);
        setError(false);
        setPossibleCities([]);
    };

    const getColorFromCloud = (cloud: number): string => {
        const normalizedCloud = Math.min(Math.max(cloud / 50, 0), 1);
        const startColor = { r: 195, g: 254, b: 246 }; 
        const endColor = { r: 189, g: 197, b: 196 }; 
        const r = Math.round(startColor.r + (endColor.r - startColor.r) * normalizedCloud);
        const g = Math.round(startColor.g + (endColor.g - startColor.g) * normalizedCloud);
        const b = Math.round(startColor.b + (endColor.b - startColor.b) * normalizedCloud);
        const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        return hexColor;
    };

    const backgroundColor = getColorFromCloud(weatherData.cloud);

    return (
        <GestureHandlerRootView  style={{ flex: 1}}>
        <View style={{ flex: 1, flexDirection: 'column', padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30 ,zIndex: 1}}>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                <View style={{ }}>
                    <TextInput
                        label="Enter city name"
                        value={tempCityName}
                        onChangeText={handleCityChange}
                        style={{ width: 300 }}
                    />
                    {possibleCities.length > 0 && (
                        <View style={{ position: 'absolute', top: 50, left: 0, right: 0, backgroundColor: 'white', padding: 5, maxHeight: 150, zIndex: 1 }}>
                            <ScrollView>
                                {possibleCities.map((city, index) => (
                                    <TouchableOpacity key={index} onPress={() => {setTempCityName(city);handleFetchWeather();}} style={{
                                        height: 30,
                                        display:    "flex" ,
                                        alignItems: "center",
                                        borderRadius: 5,
                                        flexDirection: 'row',
                                        padding: 5,
                                        marginBottom: 5,
                                    }}>
                                        <Text>{city}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
                </View>
                <TouchableOpacity onPress={handleFetchWeather}>
                    <Image source={require("./icons8-search-50.png")} style={{ width: 50, height: 50 }} />
                </TouchableOpacity>
        </View>
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, marginTop: 20, marginBottom: 20 }}>
                {error ? (
                    <Text>Invalid city name value</Text>
                ) : loading ? (
                    <ActivityIndicator animating={true} color="#000" />
                ) : (
                    <Card style={{ width: '100%', padding: 5, backgroundColor: backgroundColor }}>
                        <Card.Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{weatherData.cityName}</Text>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                                width: '100%'
                            }}>
                                <Text style={{ fontSize: 25 }}>{weatherData.condition}</Text>
                                <Image source={{ uri: `https:${weatherData.conditionIcon}` }} style={{ width: 100, height: 100 }} />
                            </View>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'row'
                            }}><Image source={require("./icons8-thermometer-50.png")} style={{ width: 32, height: 32 }}/> 
                            <Text style={{
                                 color:"black",fontSize: 25,
                                fontWeight: 'bold'
                            }}>
                           {weatherData.temperature} °C</Text>
                            </View>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'row'
                            }}><Image source={require("./icons8-thermometer-50.png")} style={{ width: 32, height: 32 }}/> 
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold'
                            }}>
                            Feels like: {weatherData.feelsLike}°C</Text>
                            </View>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                display: 'flex',
                                flexDirection: 'row',
                                width  :"100%"
                            }}>
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}><Image source={require("./icons8-water-50.png")} style={{ width: 32, height: 32 }}/> 
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}>
                            {weatherData.humidity}% </Text>
                                </View>
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}><Image source={require("./icons8-wind-50.png")} style={{ width: 32, height: 32 }}/> 
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}>
                                {weatherData.wind} km</Text>
                                </View>
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}><Image source={require("./icons8-clock-50-white.png")} style={{ width: 32, height: 32 }}/> 
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}>
                                {weatherData.time} </Text>
                                </View>
                            </View>
                        </Card.Content>                    
                    </Card>
                )}
            </View>
            
        </View>
        </GestureHandlerRootView>
    );
};

export default Home;
