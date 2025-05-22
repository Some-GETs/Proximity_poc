// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector} from 'react-redux';
import { setDetails } from '../redux/detail';
import axios from 'axios';

const Details = ({navigation}) => {
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [fetch,setFetch] = useState(false);

  const data = useSelector((state) => state.details)
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  console.log(token);

  const apiUrl = "http://34.220.144.31:8000/update-metadata";

  useEffect(() => {
    if(fetch){
        fetchData();
    }

    async function fetchData(){
        const body = {
            email_id: data.email,
            mobile_no: data.mobileNo,
            social_media:{
                instagram_username: data.instagram,
                linkedin_username: data.linkedin,
                twitter: data.twitter
            }
        }
        const headers = {
            Authorization: `Bearer ${token}`
        }
        try{

            const resp = await axios.post(apiUrl,body,{headers});
            console.log(resp);
        }catch(error){
            console.log(error);
        }
        console.log(resp);
    }
  },[fetch])
  const handleSkip = () => {
    if(instagram || linkedin || twitter){
        Alert.alert("Please press next");
        return;
    }
    
    console.log('User chose to skip entering social media details.');
    navigation.navigate('Home')
  };

  const handleNext = async () => {
    await dispatch(setDetails({
        ...data,
        instagram: instagram,
        twitter: twitter,
        linkedIn: linkedin,
    }));

    setFetch(true);
  };

  return (
    <SafeAreaView style={styles.container}>
  <Text style={styles.title}>Social Media Details</Text>

  <TextInput
    style={styles.input}
    placeholder="Instagram Handle"
    placeholderTextColor="#aaa"
    value={instagram}
    onChangeText={setInstagram}
    autoCapitalize="none"
  />

  <TextInput
    style={styles.input}
    placeholder="LinkedIn Profile"
    placeholderTextColor="#aaa"
    value={linkedin}
    onChangeText={setLinkedin}
    autoCapitalize="none"
  />

  <TextInput
    style={styles.input}
    placeholder="Twitter Handle"
    placeholderTextColor="#aaa"
    value={twitter}
    onChangeText={setTwitter}
    autoCapitalize="none"
  />

  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.buttonOutline} onPress={handleSkip}>
      <Text style={styles.buttonOutlineText}>Skip</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.buttonFilled} onPress={handleNext}>
      <Text style={styles.buttonFilledText}>Next</Text>
    </TouchableOpacity>
  </View>
</SafeAreaView>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 35,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  buttonOutline: {
    flex: 1,
    borderColor: '#fff',
    borderWidth: 1.2,
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonFilled: {
    flex: 1,
    backgroundColor: '#6c5ce7',
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 10,
    alignItems: 'center',
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonOutlineText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonFilledText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


export default Details;
