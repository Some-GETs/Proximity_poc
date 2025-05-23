import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import SocialInputRow from './SocialInputRow';
import axios from 'axios';
import {useSelector} from 'react-redux';
import ImagePickerComponent from './src/screens/ImagePickerComponent';

const UserInfoScreen = () => {
  const token = useSelector(state => state.auth.token);
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [twitter, setTwitter] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [profession, setProfession] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  // change offset based on keyboard appearance
  const onKeyboardShow = event => {
    console.log(event.endCoordinates.height);
    setKeyboardOffset(event.endCoordinates.height);
  };
  const onKeyboardHide = () => setKeyboardOffset(0);
  const keyboardDidShowListener = useRef();
  const keyboardDidHideListener = useRef();
  // register keyboard appear/disappear events
  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    keyboardDidShowListener.current = Keyboard.addListener(
      showEvent,
      onKeyboardShow,
    );
    keyboardDidHideListener.current = Keyboard.addListener(
      hideEvent,
      onKeyboardHide,
    );

    return () => {
      keyboardDidShowListener.current.remove();
      keyboardDidHideListener.current.remove();
    };
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const UPDATE_API_URL = 'http://34.220.144.31:8000/update-metadata/';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const body = {
      email_id: email,
      full_name: fullName,
      social_media: {
        instagram_username: instagram,
        linkedin_username: linkedIn,
        twitter: twitter,
      },
      mobile_no: mobile,
      gender: gender,
      age: parseInt(age),
      profession: profession,
    };
    try {
      const res = await axios.post(UPDATE_API_URL, body, {
        headers,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
    // Handle save logic here
    console.log({username, mobile, instagram});
    setLoading(false);
  };
  const fetchUserData = async () => {
    setLoading(true);
    console.log('fetchin user...');
    const API_URL = 'http://34.220.144.31:8000/fetch-metadata/';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    try {
      const res = await axios.get(API_URL, {
        headers,
      });
      console.log(`user data:`);
      console.log(res.data.metadata);

      setInstagram(res?.data?.metadata?.social_media?.instagram_username);
      setLinkedIn(res?.data?.metadata?.social_media?.linkedin_username);
      setTwitter(res?.data?.metadata?.social_media?.twitter);

      setUsername(res?.data?.metadata?.username);
      setMobile(res?.data?.metadata?.mobile_no);
      setImage(res?.data?.metadata?.pfp_url);
      setAge(res?.data?.metadata?.age?.toString());
      setEmail(res?.data?.metadata?.email_id);
      setFullName(res?.data.metadata?.full_name);
      setProfession(res?.data?.metadata?.profession);
      setGender(res?.data?.metadata?.gender);
    } catch {
      console.log(error);
      setLoading(false);
    }
  setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      style={styles.wrapper}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={{flex: 1, marginBottom: Platform.OS=='ios'?0: keyboardOffset * 0.5}}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={true}>
            {/* Profile Image */}
            <ImagePickerComponent initialPhotoUrl={image ? image : null} />
            {/* Username Row */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={username}
                editable={false}
              />
            </View>

            {/* Mobile Number Row */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Mobile</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                value={mobile}
                onChangeText={text => {
                  setMobile(text);
                  setSaveDisabled(false);
                }}
              />
            </View>
            {/* Full Name */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter full name"
                value={fullName}
                onChangeText={text => {
                  setFullName(text);
                  setSaveDisabled(false);
                }}
              />
            </View>

            {/* Email */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setSaveDisabled(false);
                }}
              />
            </View>

            {/* Age */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter age"
                keyboardType="numeric"
                value={age}
                onChangeText={text => {
                  setAge(text);
                  setSaveDisabled(false);
                }}
              />
            </View>

            {/* Gender */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter gender"
                value={gender}
                onChangeText={text => {
                  setGender(text);
                  setSaveDisabled(false);
                }}
              />
            </View>

            {/* Profession */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Profession</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter profession"
                value={profession}
                onChangeText={text => {
                  setProfession(text);
                  setSaveDisabled(false);
                }}
              />
            </View>

            {/* Social Handles */}
            <Text style={styles.sectionTitle}>Social Handles</Text>

            {/* Reusable social input row */}
            <SocialInputRow
              icon={require('./src/assets/instagram.png')}
              placeholder="Instagram Handle"
              value={instagram}
              onChangeText={text => {
                setInstagram(text);
                setSaveDisabled(false);
              }}
              iconColor="#C13584"
            />
            <SocialInputRow
              icon={require('./src/assets/linkedin.png')}
              placeholder="LinkedIn ID"
              value={linkedIn}
              onChangeText={text => {
                setLinkedIn(text);
                setSaveDisabled(false);
              }}
              iconColor="#C13584"
            />
            <SocialInputRow
              icon={require('./src/assets/twitter.png')}
              placeholder="Twitter Handle"
              value={twitter}
              onChangeText={text => {
                setTwitter(text);
                setSaveDisabled(false);
              }}
              iconColor="#C13584"
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      )}
      {/* Save Button Fixed at Bottom */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={saveDisabled ? styles.saveButtonDisabled : styles.saveButton}
          onPress={handleSave}
          disabled={saveDisabled}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UserInfoScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100, // Add space for bottom button
  },
  profileImage: {
    resizeMode: 'cover',
    width: 120,
    height: 120,
    borderRadius: 120,
    alignSelf: 'center',
  },
  editImageText: {
    textAlign: 'center',
    color: '#1e90ff',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  socialInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    // borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: 'gray',
    paddingVertical: 15,
    // borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  label: {
    width: 80,
    fontSize: 16,
    color: '#333',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  loaderViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});
