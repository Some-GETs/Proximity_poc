import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';

const DistanceSlider = ({value, setValue}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{`Search Radius ${Math.round(value)} m`}</Text>
      <Slider
        style={styles.slider}
        minimumValue={20}
        maximumValue={400}
        step={10}
        value={value}
        onValueChange={setValue}
        minimumTrackTintColor="green"
        maximumTrackTintColor="black"
        thumbTintColor="black"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignItems: 'center',
    // marginVertical: 70,
    alignSelf: 'center',
  },
  label: {
    fontSize: 18,
    alignSelf: 'flex-start',
    paddingLeft: '5%',
    color: 'black',
    fontWeight: 500,
  },
  slider: {
    width: '100%',
    height: 30,
  },
});

export default DistanceSlider;
