// @ts-nocheck
import axios from 'axios';
import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';

const API_URL = 'http://34.220.144.31:8000/fetch-users-mg';
const API_URL2 = 'http://34.220.144.31:8000/update-location';

// const AUTH_TOKEN =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuYW50MDEiLCJpYXQiOjE3NDc1ODkzNTUsImV4cCI6MTc0NzU5Mjk1NX0.jLoQZ7pYhfAUTQa4up9z4yXDT1s17_8l8c6o1j_0OXQ';
// Function to get permission for location
const requestLocationPermission = async () => {
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
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

const Home = ({navigation}) => {
  // state to hold location
  const token = useSelector(state => state.auth.token);
  console.log(token);
  // const { token } = route.params;
  // console.log("tokennnn", route.params);
  // const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3NDc2MzUyMTEsImV4cCI6MTc0NzYzODgxMX0.5tcFnPLLCQln5b6giay8SBfKek8ct4cJIrAk5K2TStQ";
  // console.log(AUTH_TOKEN);
  const [location, setLocation] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const sendLocation = async () => {
    const coords = await getLocation();
    try {
      if (coords) {
        console.log(coords);

        const body = {
          lat: coords.latitude,
          lng: coords.longitude,
        };

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        console.log(token);
        // console.log(headers);
        // console.log(body, "bodyyy");
        const updateLoc = await axios.post(API_URL2, body, {
          headers,
        });

        console.log(updateLoc);

        const response = await axios.post(API_URL, {
          rad: 1000,
          lat: coords.latitude,
          lng: coords.longitude,
        });

        console.log(response);
        setUsers(response.data);
        console.log('Success:');
      } else {
        console.log('error');
      }
    } catch (error) {
      console.error('Error sending API request:', error);
    }
  };
  // function to check permissions and get Location
  const getLocation = async () => {
    setLoading(true);
    const res = await requestLocationPermission();

    if (res) {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(position);
            resolve(coords);
          },
          error => {
            setLocation(false);
            reject(error);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      });
    }
    // console.log('res is:', res);
    //     if (res) {
    //         // console.log("starteddd");
    //         await Geolocation.getCurrentPosition(
    //             position => {
    //                 console.log(position);
    //                 setLocation(position);
    //             },
    //             error => {
    //                 console.log(error.code, error.message);
    //                 setLocation(false);
    //             },
    //             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    //         );
    //     }
    // console.log(location);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          width: '80%',
          margin: 20,
          borderRadius: 15,
          height: '8%',
          backgroundColor: 'black',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          padding: 20,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 50,
        }}
        onPress={sendLocation}>
        <Text style={styles.refreshBtn}>Refresh Users</Text>
      </TouchableOpacity>
      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: '10%',
          flexDirection: 'row',
        }}>
        <Image
          source={require('../../location_pin.png')}
          style={{width: 30, height: 30, marginHorizontal: 15}}
        />
        <Text style={styles.locationStyle}>
          {location
            ? `${location.coords.latitude}, ${location.coords.longitude}`
            : null}
        </Text>
      </View>
      {/* <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="Send Location" onPress={sendLocation} />
      </View> */}
      {users && (
        <>
          <Text style={styles.userHeader}>Active Users</Text>
          <ScrollView
            scrollEnabled={true}
            style={{width: '100%'}}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            {users.map((item, index) => (
              <View
                key={index}
                style={{
                  padding: 20,
                  borderRadius: 20,
                  backgroundColor: '#000',
                  marginVertical: 5,
                  width: '80%',
                  height: 150,
                  elevation: 35,
                }}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userDist}>{`${item.distance}m away`}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => navigation.navigate('Account')}>
            <Text>account Settings</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  scroll: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  userHeader: {
    fontSize: 36,
    fontWeight: 500,
    color: 'black',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginVertical: 20,
  },
  locationStyle: {
    color: 'black',
    fontWeight: 300,
    fontSize: 18,
  },
  userName: {
    fontWeight: 300,
    fontSize: 32,
    color: 'white',
  },
  userDist: {
    fontWeight: 300,
    fontSize: 24,
    color: 'white',
  },
  refreshBtn: {
    fontWeight: 300,
    fontSize: 16,
    color: 'white',
  },
});
export default Home;
