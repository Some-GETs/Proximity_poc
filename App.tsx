// @ts-nocheck
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import {Provider, useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setCredentials} from './src/redux/auth';
import store from './src/redux/store';

import LoginScreen from './src/screens/login';
import SignupScreen from './src/screens/signup';
import HomeScreen from './src/screens/home';
import OnboardScreen from './src/screens/onboard';
import DetailsScreen from './src/screens/details';
import {View, ActivityIndicator} from 'react-native';
import UserInfoScreen from './src/screens/UserProfile';

const Stack = createNativeStackNavigator();

function AppInitializer() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      // const userData = await AsyncStorage.getItem('user');
      console.log(token);
      if (token) {
        console.log('setting show as truee');
        dispatch(setCredentials({token}));
        setShow(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={show ? 'Home' : 'Login'}
        screenOptions={{headerShown: false}}>
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            screenOptions={{headerShown: false}}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            screenOptions={{headerShown: false}}
          />
          <Stack.Screen
            name="Onboard"
            component={OnboardScreen}
            screenOptions={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            screenOptions={{headerShown: false}}
          />
          <Stack.Screen name="Account" component={UserInfoScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInitializer />
      <Toast />
    </Provider>
  );
}
