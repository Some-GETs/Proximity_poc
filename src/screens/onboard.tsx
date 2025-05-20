// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { setDetails } from '../redux/detail';
import { useDispatch } from 'react-redux';
// import * as ImagePicker from 'expo-image-picker';

const OnboardingScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const handleNext = () => {
    dispatch(setDetails({
            mobileNo: mobileNumber,
            username: username,
        })
    )

    navigation.navigate('Details');
  }

    const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setImage(uri);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ONBOARD</Text>
      <TouchableOpacity onPress={selectImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>Upload Image</Text>
          </View>
        )}
      </TouchableOpacity>
      <TextInput
        placeholder="Enter your username"
        placeholderTextColor="#888"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Enter your Mobile Number"
        placeholderTextColor="#888"
        style={styles.input}
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={styles.buttonFilled}>
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.buttonFilled} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#fff', // White text
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarText: {
    color: '#fff',
  },
  input: {
    width: '100%',
    backgroundColor: '#222',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonOutline: {
    flex: 1,
    borderColor: '#fff',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonFilled: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
