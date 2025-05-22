// @ts-nocheck
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useState} from 'react';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {setCredentials} from '../redux/auth';

const SignupScreen = ({navigation}) => {
  const signupUrl = 'http://34.220.144.31:8000/signup/';

  const dispatch = useDispatch();

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const register = async () => {
        try {
            const body = {
                username,
                password,
            }
            const resp = await axios.post(signupUrl, body);
            Toast.show({
                type: "success",
                text1: "User Registered",
                text2: "Logged in successfully",
            })
            const token = resp?.data?.token || null;
            dispatch(setCredentials({ token: token, user: username }));
            navigation.replace('Onboard');

        } catch (error) {
            console.log(error);
            Toast.show({
                type: "error",
                text1: "Try again after sometime!"
            })
        }
    }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.heading}>Create Account ✨</Text>

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

        <TouchableOpacity style={styles.button} onPress={register}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text onPress={() => navigation.navigate('Login')} style={styles.link}>
          Have an account? <Text style={styles.linkHighlight}>Log in</Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6c5ce7',
    shadowOffset: {width: 0, height: 3},
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
    color: '#a29bfe',
    fontWeight: '500',
  },
});

export default SignupScreen;
