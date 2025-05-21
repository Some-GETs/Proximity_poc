// @ts-nocheck
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/auth'

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const signupUrl = 'http://34.220.144.31:8000/login/';

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
      console.log('➡️ hitting', signupUrl);                 // ① see real URL
      try {
        const { data, status, config } = await axios.post(
          signupUrl,
          { username, password },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const token = data?.token;
        console.log(token)
        console.log('✅', status, data);
        dispatch(setCredentials({token: token, user: username}));
        navigation.replace('Home'); //changed this from Home to Details

      } catch (err) {
        if (err.response) {
          console.log('❌ SERVER', err.response.status, err.response.data);
          console.log('❌ URL', err.config.url);             // ② confirm path/slash
        } else {
          console.log('❌ NETWORK', err.message);
        }
      }
    };
    return (
       <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={text => setUserName(text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />

      {/* <View style={styles.buttonContainer}> */}
      <TouchableOpacity style={styles.buttonContainer} onPress={login}>
        <Text style={{color: 'black'}}>Login</Text>
      </TouchableOpacity>
        <Button title="Login" onPress={login} color="#000" />
      {/* </View> */}

      <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>
        Don't have an account? Sign up
      </Text>
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#fff',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10
    // overflow: 'hidden',
  },
  link: {
    color: '#ccc',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
