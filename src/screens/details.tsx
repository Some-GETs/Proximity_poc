// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useSelector} from 'react-redux';

const Details = ({navigation}) => {
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');

  const data = useSelector((state) => state.details)

  console.log(data);
  const handleSkip = () => {
    // Handle skip action
    console.log('User chose to skip entering social media details.');
    navigation.navigate('Home')
  };

  const handleNext = () => {
    // Handle next action with the entered social media handles
    console.log('Instagram:', instagram);
    console.log('LinkedIn:', linkedin);
    console.log('Twitter:', twitter);

    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Social Media Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Instagram Handle"
        placeholderTextColor="#888"
        value={instagram}
        onChangeText={setInstagram}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="LinkedIn Profile"
        placeholderTextColor="#888"
        value={linkedin}
        onChangeText={setLinkedin}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Twitter Handle"
        placeholderTextColor="#888"
        value={twitter}
        onChangeText={setTwitter}
        autoCapitalize="none"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonOutline} onPress={handleSkip}>
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonFilled} onPress={handleNext}>
          <Text style={[styles.buttonText, { color: '#000' }]}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff', // White text
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Details;
