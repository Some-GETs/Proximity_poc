// @ts-nocheck
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import UserCards from './user_card';
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
  ActivityIndicator
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
  const details = useSelector((state) => state.details);
  console.log(details);
  console.log(token);
  
  // State variables
  const [location, setLocation] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeUser, setActiveUser] = useState("")
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [activeUser,setActiveUser] = useState("");

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
    <View style={styles.topBar}>
      <TouchableOpacity onPress={handleAbout}>
        <Image source={require('../../account_icon.png')} style={styles.aboutIcon} />
      </TouchableOpacity>
      <View style={styles.locationContainer}>
        <Image source={require('../../location_pin.png')} style={styles.locationIcon} />
        <Text style={styles.locationText}>
          {location
            ? `${location.coords.latitude.toFixed(3)}, ${location.coords.longitude.toFixed(3)}`
            : 'Fetching...'}
        </Text>
      </View>
    </View>

{loading ? (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
) : users ? (
  users.length > 0 ? (
    <>
      
      <ScrollView
        scrollEnabled={true}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
    
       <UserCards users={users} /> 
      </ScrollView>
    </>
  ) : (
    <View style={styles.emptyState}>
      {/* <Image
        source={require('../../account_icon.png')}
        style={styles.emptyImage}
        resizeMode="contain"
      /> */}
      <Text style={styles.emptyText}>Discover users nearby!</Text>
    </View>
  )
) : null}
 

    <TouchableOpacity style={styles.refreshButton} onPress={sendLocation}>
      <Text style={styles.refreshBtn}>Discover</Text>
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

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  aboutIcon: {
    width: 32,
    height: 32,
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  locationIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },

  locationText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },

  userHeader: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginVertical: 20,
    textAlign: 'center',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    alignItems: 'center',
    paddingBottom: 100,
    gap: 16,
  },

  userCard: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },

  userDist: {
    fontSize: 15,
    fontWeight: '300',
    color: '#aee1f9',
    textAlign: 'center',
    marginTop: 6,
  },

  refreshButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 15,
    height: 55,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },

  refreshBtn: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
},

emptyImage: {
    width: 140,
    height: 140,
    marginBottom: 20,
    opacity: 0.8,
},

emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
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


export default Home;