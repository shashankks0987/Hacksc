import React, { useState } from 'react';
import { View, Text, Slider, StyleSheet } from 'react-native';

const WeightLossSlider = () => {
  const [weightLoss, setWeightLoss] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Choose your weight loss goal (0-100):
      </Text>
      <Slider
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={weightLoss}
        onValueChange={val => setWeightLoss(val)}
        style={styles.slider}
      />
      <Text style={styles.text}>{weightLoss} kg</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20
  },
  text: {
    fontSize: 20,
    marginBottom: 20
  },
  slider: {
    width: '80%'
  }
});

export default WeightLossSlider;
