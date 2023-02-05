import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';


const MyGraph = ({ data }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handlePress = (index) => {
    setSelectedIndex(index);
  };

  return (
    <View>
      <TouchableWithoutFeedback onPress={() => handlePress(index)}>
        <View>
          {/* Render line chart */}
        </View>
      </TouchableWithoutFeedback>
      {selectedIndex >= 0 && (
        <View>
          <Text>{`X Value: ${data[selectedIndex].x}`}</Text>
          <Text>{`Y Value: ${data[selectedIndex].y}`}</Text>
        </View>
      )}
    </View>
  );
};

export default MyGraph;
