// @ts-nocheck
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {setDetails} from '../redux/detail';
import {useDispatch} from 'react-redux';
import ImagePickerComponent from './ImagePickerComponent';
// import * as ImagePicker from 'expo-image-picker';

const OnboardingScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  const handleMobileNumberChange = text => {
    const cleaned = text.replace(/[^0-9]/g, '');
    // setMobileNumber(cleaned);

    if (cleaned === '' || /^[6-9]/.test(cleaned)) {
      if (cleaned.length <= 10) {
        setMobileNumber(cleaned);
      }
    }
    // if (cleaned.length !== 10) {
    //     setErrorMessage('Mobile number must be 10 digits');
    // } else {
    //     setErrorMessage('');
    // }
  };

  const handleNext = () => {
    if (!username || !mobileNumber || !email) {
      setErrorMessage('Please fill all the details');
      return;
    }

    dispatch(
      setDetails({
        mobileNo: mobileNumber,
        email: email,
        username: username,
      }),
    );

    navigation.navigate('Details');
  };

  // const selectImage = () => {
  //     const options = {
  //         mediaType: 'photo',
  //         quality: 1,
  //     };

  //     launchImageLibrary(options, (response) => {
  //         if (response.didCancel) {
  //             console.log('User cancelled image picker');
  //         } else if (response.errorCode) {
  //             console.log('ImagePicker Error: ', response.errorMessage);
  //         } else {
  //             const uri = response.assets[0].uri;
  //             setImage(uri);
  //         }
  //     });
  // };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Welcome 👋</Text>

        {/* <TouchableOpacity onPress={selectImage}>
    {image ? (
      <Image source={{ uri: image }} style={styles.avathjar} />
    ) : (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>Upload Image</Text>
      </View>
    )}
  </TouchableOpacity> */}

        <ImagePickerComponent />

        <TextInput
          placeholder="Enter your username"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          onFocus={() => setErrorMessage('')}
        />
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          onFocus={() => setErrorMessage('')}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Enter your mobile number"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={mobileNumber}
          onChangeText={handleMobileNumberChange}
          onFocus={() => setErrorMessage('')}
          keyboardType="phone-pad"
          maxLength={10}
        />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity style={styles.buttonFilled} onPress={handleNext}>
          <Text style={styles.buttonText}>Continue ➤</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#6c5ce7',
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
  avatarText: {
    color: '#bbb',
    fontSize: 14,
  },
  input: {
    width: '100%',
    backgroundColor: '#1c1c1e',
    color: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  buttonFilled: {
    width: '100%',
    backgroundColor: '#6c5ce7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6c5ce7',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
