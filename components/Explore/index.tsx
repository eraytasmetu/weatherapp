import React, { useEffect, useState } from 'react';
import { View, Text,  ActivityIndicator } from 'react-native';
import { useWeather } from '../../app/WeatherContext';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TextInput, Button, Card } from 'react-native-paper';

const Explore: React.FC = () => {
  const { weatherData } = useWeather();
  const [recommendation, setRecommendation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [foodLoading, setFoodLoading] = useState<boolean>(false);
  const [foodRecommendation, setFoodRecommendation] = useState<string>('');
  const API_KEY = "AIzaSyCpCKg4VpJ0CfX5JJyvLGsB5OIKKo_9bbU"; 
  useEffect(() => {
    setRecommendation('');
    setFoodRecommendation('');
  },[weatherData]);  
  const handleSend = async () => {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY) 
      const model = await genAI.getGenerativeModel({model:"gemini-pro"});
      const prompt = `Şehir: ${weatherData.cityName}\nHava Durumu: ${weatherData.condition}\nSıcaklık: ${weatherData.temperature}°C\nNem: ${weatherData.humidity}%\nRüzgar: ${weatherData.wind} km/h\nHissedilen Sıcaklık: ${weatherData.feelsLike}°C\nBulutluluk: ${weatherData.cloud}%\nBugün ne giymeliyim 3-5 cümle ile öner?`;
      const result = await model.generateContent(prompt);
      const response = result.response
      const text = response.text();
      return text
    } catch (error) {
      console.error('Error fetching GoogleGenerativeAI response:', error);
      return 'Bir hata oluştu. Lütfen tekrar deneyin.';
    }
  };
  const handleGetRecommendation = async () => {
    setLoading(true);
    const rec = await handleSend();
    setRecommendation(rec);
    setLoading(false);
  };
  const handleFoodInformationSend = async () => {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY) 
      const model = await genAI.getGenerativeModel({model:"gemini-pro"});
      const prompt = `Şuanda ${weatherData.cityName} dayım. Ne yiyebilirim 3-4 cümle ile bana öneri sunar mısın?`
      const result = await model.generateContent(prompt);
      const response = result.response
      const text = response.text();
      return text
    } catch (error) {
      console.error('Error fetching GoogleGenerativeAI response:', error);
      return 'Bir hata oluştu. Lütfen tekrar deneyin.';
    }
  }
  const handleGetFoodRecommendation = async () => {
    setFoodLoading(true);
    const rec = await handleFoodInformationSend();
    setFoodRecommendation(rec);
    setFoodLoading(false);
  }
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap : 5
    }}>
      <Text>How should you dress today ?</Text>
      <Button mode="contained" onPress={handleGetRecommendation}>
        Get Idea
      </Button>
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : 
        <View>
          {recommendation === "" ? null :
          <Card style={{
            margin: 10,
            padding: 10,
            borderRadius: 10,
            elevation: 5,
            backgroundColor: '#f5f5f5',
          }}>
            <Card.Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 10,
              }}>Our Ideas</Text>
              <Text>{recommendation}</Text>
            </Card.Content>
          </Card>
        }
        </View>}
      <Text>What should you eat today ?</Text>
      <Button mode="contained" onPress={handleGetFoodRecommendation}>
        Get Idea
      </Button>
        {
          foodLoading ? <ActivityIndicator size="large" color="#0000ff" /> :
          <View>
            {foodRecommendation === "" ? null :
            <Card style={{
              margin: 10,
              padding: 10,
              borderRadius: 10,
              elevation: 5,
              backgroundColor: '#f5f5f5',
            }}>
              <Card.Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}>Our Ideas</Text>
                <Text>{foodRecommendation}</Text>
              </Card.Content>
            </Card>
          }
          </View>
        }
    </View>
  );
};

export default Explore;
