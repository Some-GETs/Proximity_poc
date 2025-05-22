// @ts-nocheck
import axios from 'axios';
import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    PermissionsAndroid,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';

const API_URL = 'http://34.220.144.31:8000/fetch-users-mg';
const API_URL2 = 'http://34.220.144.31:8000/update-location';

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3NDc4MTc4NzYsImV4cCI6MTc0NzgyMTQ3Nn0.U1hyEFPhxFyGeNCDMo9Xph7o4IBaih3zDNxKAijxOdg"
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

const Home = () => {
    // state to hold location
    const token = useSelector((state) => state.auth.token);
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
                }

                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }

                console.log(token);
                // console.log(headers);
                // console.log(body, "bodyyy");
                const updateLoc = await axios.post(
                    API_URL2,
                    body,
                    {
                        headers
                    }
                );

                console.log(updateLoc);

                const response = await axios.post(API_URL, {
                    rad: 1000,
                    lat: coords.latitude,
                    lng: coords.longitude,
                });

                console.log(response);
                setUsers(response.data);
                console.log('Success:');
            }
            else {
                console.log('error');
            }
        } catch (error) {
            console.error('Error sending API request:', error);
        }
    };
    // function to check permissions and get Location
    const getLocation =  async () => {
        setLoading(true)
        const res = await requestLocationPermission();

        if(res){
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
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
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