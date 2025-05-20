// @ts-nocheck
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet} from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/auth'

const LoginScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const loginUrl = 'http://34.220.144.31:8000/login';

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
      console.log("clickeddd");
        try {

            const body = {
                username,
                password,
            }
            console.log("<<<<<")
            const resp = await axios.post(loginUrl, body);
            console.log("11111111")
            Toast.show({
                type: "success",
                text1: "Logged in successfully",
                // text2: "Please login now",
            })
            console.log(resp);
            const token = resp?.data?.token || null;
            dispatch(setCredentials({ token: token, user: username }));
            navigation.replace('Home');
        } catch (error) {
            console.log(error);
        }
    }
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

      <View style={styles.buttonContainer}>
        <Button title="Log" onPress={login} color="#000" />
      </View>

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
    backgroundColor: 'White',
    borderRadius: 10,
    borderColor: '#fff',
    overflow: 'hidden',
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
