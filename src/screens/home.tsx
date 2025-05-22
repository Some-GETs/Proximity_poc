// @ts-nocheck
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';

// const API_URL = 'http://34.220.144.31:8000/fetch-users-mg/';
// const API_URL2 = 'http://34.220.144.31:8000/update-location2/';
const API_BASE_URL = 'http://34.220.144.31:8000';
const UPDATE_LOCATION_ENDPOINT = `${API_BASE_URL}/update-location/`;
const FETCH_USERS_ENDPOINT = `${API_BASE_URL}/fetch-users-mg/`;

// Function to get permission for location on Android
const requestAndroidLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    console.error('Error requesting Android location permission:', err);
    return false;
  }
};

// Platform-independent permission request
const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    try {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      console.log('iOS permission status:', auth);
      return auth === 'granted';
    } catch (error) {
      console.error('Error requesting iOS location permission:', error);
      return false;
    }
  } else if (Platform.OS === 'android') {
    return await requestAndroidLocationPermission();
  }
  return false;
};

const Home = ({navigation}) => {
  // Get token from route params
  const token = useSelector((state)=> state.auth.token);
  console.log(token);
  
  // State variables
  const [location, setLocation] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Check for permission on component mount
  useEffect(() => {
    (async () => {
      const hasPermission = await requestLocationPermission();
      setPermissionGranted(hasPermission);
      if (hasPermission) {
        getLocation();
      }
    })();
  }, []);

  const sendLocation = async () => {
    try {
      setLoading(true);
      
      // If we don't have location yet, try to get it
      
      const coords = await getLocation();
      
      console.log(`coords ${coords}`)
      
      // If we still don't have location, show an error
    //   if (!location) {
    //     Alert.alert('Error', 'Unable to get your location. Please check your permissions and try again.');
    //     setLoading(false);
    //     return;
    //   }
  
      // Prepare request data
      const body = {
        lat: coords.latitude,
        lng: coords.longitude,
      };
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
  
      console.log('Making API request to:', UPDATE_LOCATION_ENDPOINT);
      console.log('With body:', JSON.stringify(body));
      console.log('And headers:', JSON.stringify(headers));
      
      // Try ping the server first to see if it's reachable
    //   try {
    //     const pingResponse = await axios.get(`${API_BASE_URL}/`);
    //     console.log('Server ping response:', pingResponse.status);
    //   } catch (pingError) {
    //     console.log('Server ping failed:', pingError);
    //     // Continue anyway - the ping endpoint might not exist
    //   }
      
      // Update user's location
      const updateResponse = await axios.post(
        UPDATE_LOCATION_ENDPOINT,
        body,
        { headers }
      );
      
      console.log('Location update response:', updateResponse.data);
      
      const usersResponse = await axios.post(
        FETCH_USERS_ENDPOINT,
        {
          rad: 0.02,
          lat: coords.latitude,
          lng: coords.longitude,
        }
      );
      
      console.log('Fetched users:', usersResponse.data);
      setUsers(usersResponse.data);
      
    } catch (error) {
      console.error('Error in sendLocation:', error);
      
      // More detailed error logging
      if (axios.isAxiosError(error)) {
        console.log('API error details:');
        console.log('- Status:', error.response?.status);
        console.log('- Status text:', error.response?.statusText);
        console.log('- URL:', error.config?.url);
        console.log('- Method:', error.config?.method);
        console.log('- Headers:', JSON.stringify(error.config?.headers));
        console.log('- Data:', error.response?.data);
        
        // Suggest specific fixes based on error status
        if (error.response?.status === 404) {
          Alert.alert(
            'API Endpoint Not Found', 
            'The server endpoint could not be found. Please check the API URL or contact support.'
          );
        } else if (error.response?.status === 401) {
          Alert.alert(
            'Authentication Error', 
            'Your session may have expired. Please log in again.'
          );
        } else if (error.response?.status === 403) {
          Alert.alert(
            'Permission Denied', 
            'You do not have permission to perform this action.'
          );
        } else {
          Alert.alert(
            'Network Error', 
            `Failed to connect to the server. Please check your internet connection and try again. Error: ${error.message}`
          );
        }
      } else {
        Alert.alert(
          'Error', 
          'An unexpected error occurred. Please try again later.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to get location
  const getLocation = async () => {
    try {
      if (!permissionGranted) {
        const hasPermission = await requestLocationPermission();
        setPermissionGranted(hasPermission);
        
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Location permission is required to use this feature.',
            [
              { text: 'OK' }
            ]
          );
          return;
        }
      }
      
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            console.log('Position received:', position);
            const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
            setLocation(position);
            resolve(coords);
          },
          error => {
            console.log('Geolocation error:', error.code, error.message);
            setLocation(null);
            reject(error);
          },
          { 
            enableHighAccuracy: true, 
            timeout: 10000, 
            maximumAge: 0 
          }
        );
      });
    } catch (error) {
      console.error('Error in getLocation:', error);
      return null;
    }
  };

  const handleAbout = () => {
    navigation.navigate('Account');
  }

   return (
    <View style={styles.container}>

        
        <TouchableOpacity style={styles.aboutIcon} onPress={handleAbout}>
            <Image
                source={require('../../account_icon.png')}
                style={styles.locationIcon}
            />
        </TouchableOpacity>
        <View style={styles.locationContainer}>
            <Image
                source={require('../../location_pin.png')}
                style={styles.locationIcon}
            />
            <Text style={styles.locationStyle}>
                {location
                    ? `${location.coords.latitude}, ${location.coords.longitude}`
                    : null}
            </Text>
        </View>

        {users && (
            <>
                <Text style={styles.userHeader}>Nearby Active Users</Text>
                <ScrollView
                    scrollEnabled={true}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}>
                    {users.map((item, index) => (
                        <View key={index} style={styles.userCard}>
                            <Text style={styles.userName}>{item.name}</Text>
                            <Text style={styles.userDist}>{`${item.distance}m away`}</Text>
                        </View>
                    ))}
                </ScrollView>
            </>
        )}

        <TouchableOpacity style={styles.refreshButton} onPress={sendLocation}>
            <Text style={styles.refreshBtn}>Refresh Users</Text>
        </TouchableOpacity>
    </View>
);
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6fa',
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 20,
    },

    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginLeft: '10%',
        marginBottom: 10,
    },

    locationIcon: {
        width: 28,
        height: 28,
        marginRight: 10,
    },

    locationStyle: {
        color: '#333',
        fontSize: 16,
        fontWeight: '400',
    },

    userHeader: {
        fontSize: 28,
        fontWeight: '600',
        color: '#222',
        alignSelf: 'flex-start',
        marginLeft: '10%',
        marginVertical: 20,
    },

    scrollView: {
        width: '100%',
        paddingHorizontal: 10,
    },

    scrollContent: {
        alignItems: 'center',
        gap: 15,
        paddingBottom: 20,
    },

    userCard: {
        width: '85%',
        backgroundColor: 'black',
        borderRadius: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },

    userName: {
        fontSize: 24,
        fontWeight: '500',
        color: '#fff',
        textAlign: 'center',
    },

    userDist: {
        fontSize: 16,
        fontWeight: '300',
        color: '#e0f7fa',
        textAlign: 'center',
        marginTop: 6,
    },

    refreshButton: {
        position: 'absolute',
        bottom: 30,
        width: '85%',
        borderRadius: 15,
        height: 55,
        backgroundColor: '#fff',
        borderWidth: 3,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
    },

    refreshBtn: {
        fontSize: 20,
        fontWeight: '600',
        color: 'black',
    },
});

export default Home;