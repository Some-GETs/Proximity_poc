import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useSelector} from 'react-redux';

const ImagePickerComponent = ({initialPhotoUrl}) => {
  const token = useSelector(state => state.auth.token);
  const [photo, setPhoto] = useState(
    initialPhotoUrl ? {uri: initialPhotoUrl} : null,
  );
  const [isUploadAllowed, setIsUploadAllowed] = useState(false);
  const requestPermissions = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      const mediaPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      );
      console.log(cameraPermission, mediaPermission);
      return (
        cameraPermission === PermissionsAndroid.RESULTS.GRANTED ||
        mediaPermission === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };
  const handleImageSelection = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot access camera or gallery');
      return;
    }
    Alert.alert('Select Image', 'Choose the image source', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Camera',
        onPress: () => openCamera(),
      },
      {
        text: 'Gallery',
        onPress: () => openGallery(),
      },
    ]);
  };

  const openCamera = () => {
    launchCamera(
      {mediaType: 'photo', cameraType: 'back', quality: 0.8},
      response => {
        if (response.didCancel || response.errorCode) {
          console.log(response);
          return;
        }
        setPhoto(response.assets[0]);
        setIsUploadAllowed(true);
      },
    );
  };

  const openGallery = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      if (response.didCancel || response.errorCode) return;
      console.log(`photo upload: ${response.assets.length}`);
      setPhoto(response.assets[0]);
      setIsUploadAllowed(true);
    });
  };

  const uploadData = async () => {
    const formData = new FormData();
    if (photo) {
      formData.append('pfp', {
        uri: photo.uri,
        type: photo.type,
        name: photo.fileName,
      });
    }
    try {
      console.log(formData);
      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.post(
        'http://34.220.144.31:8000/upload-pfp/',
        formData,
        {
          headers,
        },
      );
      setIsUploadAllowed(false);
      console.log(res.data);
    } catch (error) {
      ;
      console.log("erroroor"+" "+JSON.stringify(error.response.data));
    }
  };
  useEffect(() => {
    console.log(`photo: ${photo}`);
  }, [photo]);

  return (
    <View style={styles.container}>
      {photo ? (
        <Image source={{uri: photo.uri}} style={styles.imagePreview} />
      ) : (
        <Image
          source={require('../../accountImage.png')}
          style={styles.imagePreview}
        />
      )}
      {isUploadAllowed && (
        <TouchableOpacity onPress={uploadData}>
          <Text style={{color: '#28a745'}}>Upload</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.button} onPress={handleImageSelection}>
        <Text style={styles.buttonText}>
          {photo ? 'Change Photo' : 'Upload Photo'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImagePickerComponent;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
