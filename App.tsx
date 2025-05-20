// @ts-nocheck
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import LoginScreen from './src/screens/login';
import SignupScreen from './src/screens/signup';
import HomeScreen from './src/screens/home';
import OnboardScreen from './src/screens/onboard';
import DetailsScreen from './src/screens/details';
import { Provider } from 'react-redux';
import store from './src/redux/store'


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
    <Provider store={store}>

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="Details" component={DetailsScreen}/>
        <Stack.Screen name="Onboard" component={OnboardScreen}/> 
        <Stack.Screen name="Signup" component={SignupScreen} /> 
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    <Toast/>
        </Provider>
    </>
  );
}
