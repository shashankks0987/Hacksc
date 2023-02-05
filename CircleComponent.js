import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Circle = () => {
  return (
          <View>
    <View style={styles.container}>
      <View style={[styles.circle, styles.redCircle]} />
      <View style={[styles.circle, styles.whiteCircle]} />
      <View style={[styles.circle, styles.greenCircle]} />
    </View>
          <View style = {styles.container}>
          <Text>-30 mins</Text>
          <Text> Curr </Text>
          <Text>  +30 mins</Text>
          </View>
    </View>


  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
textContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
},
    
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 25,
  },
  redCircle: {
    backgroundColor: 'red',
  },
  whiteCircle: {
    backgroundColor: 'white',
  },
  greenCircle: {
    backgroundColor: 'green',
  },
});

export default Circle;
