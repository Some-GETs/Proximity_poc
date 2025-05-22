// @ts-nocheck
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity} from 'react-native';
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
          Toast.show({
                          type: 'error',
                          text1: "Usename and Password do not match",
                      })
          console.log('❌ URL', err.config.url);             // ② confirm path/slash
        } else {
          console.log('❌ NETWORK', err.message);
          Toast.show({
                          type: 'error',
                          text1: "Network error",
                      })
        }
    }
  }
return (
  <View style={styles.container}>
    <Text style={styles.heading}>Welcome Back 👋</Text>

    <TextInput
      placeholder="Username"
      placeholderTextColor="#aaa"
      value={username}
      onChangeText={text => setUserName(text)}
      style={styles.input}
    />

    <TextInput
      placeholder="Password"
      placeholderTextColor="#aaa"
      value={password}
      onChangeText={text => setPassword(text)}
      secureTextEntry
      style={styles.input}
    />

    <TouchableOpacity style={styles.button} onPress={login}>
      <Text style={styles.buttonText}>Log In</Text>
    </TouchableOpacity>

    <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>
      Don't have an account? <Text style={styles.linkHighlight}>Sign up</Text>
    </Text>
  </View>
);

};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 34,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    backgroundColor: '#00b894',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: '#bbb',
    marginTop: 25,
    textAlign: 'center',
    fontSize: 16,
  },
  linkHighlight: {
    color: '#00cec9',
    fontWeight: '500',
  },
});


export default LoginScreen;
