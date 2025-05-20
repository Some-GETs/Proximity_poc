import React, {useState} from 'react';
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
} from 'react-native';
import SocialInputRow from './SocialInputRow';

const UserInfoScreen = () => {
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [twitter, setTwitter] = useState('');

  const handleSave = () => {
    // Handle save logic here
    console.log({username, mobile, instagram});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Image */}
        <Image
          source={require('./accountImage.png')}
          style={styles.profileImage}
        />

        {/* Edit Image Text */}
        <TouchableOpacity>
          <Text style={styles.editImageText}>Edit Image</Text>
        </TouchableOpacity>

        {/* Username Input */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        {/* Mobile Number Input */}
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
        />

        {/* Social Handles */}
        <Text style={styles.sectionTitle}>Social Handles</Text>

        {/* Reusable social input row */}
        <SocialInputRow
          icon="instagram"
          placeholder="Instagram Handle"
          value={instagram}
          onChangeText={setInstagram}
          iconColor="#C13584"
        />
        <SocialInputRow
          icon="linkedin"
          placeholder="LinkedIn ID"
          value={linkedIn}
          onChangeText={setLinkedIn}
          iconColor="#C13584"
        />
        <SocialInputRow
          icon="twitter"
          placeholder="Twitter Handle"
          value={twitter}
          onChangeText={setTwitter}
          iconColor="#C13584"
        />
      </ScrollView>

      {/* Save Button Fixed at Bottom */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginVertical: 8,
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
    bottom: 20,
    left: 20,
    right: 20,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
