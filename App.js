import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Animated,  Dimensions } from 'react-native';
import { Constants } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.log("Error retrieving");
  }
}

const storeData = async (value, storage_Key) => {
  try {
     const jsonValue = JSON.stringify(value)
     console.log("Data stored", value)
     await AsyncStorage.setItem(storage_Key, jsonValue)
   } catch (e) {
     // saving error
   }
 }

const OnBoardingPage = ({ navigation }) => {
  return (
          <View style={styles.container}>
            <Text style={styles.text}>Welcome to the app!</Text>
            <Text style={styles.text}>This is your onboarding page.</Text>
          <Button
            title="Next"
            onPress={() => navigation.navigate('Page1')}
            style={styles.button}
          />
          </View>
  );
};


const Page1 = ({ navigation }) => {
  return (
          <View style={OnboardingStyles.container}>
                <Text style={styles.text}>How many days per week do you want to spend on this goal?</Text>
          <View style ={OnboardingStyles.buttonContainer}>
                <Button
          style={OnboardingStyles.button}
                  title="3 Days"
                  onPress={() => {
                    storeData({"Per week":3}, 'perWeek');
                    navigation.navigate('Page2')}
                  }
                />
          <Button
          style={OnboardingStyles.button}
            title="5 Days"
            onPress={() => {
              storeData({"Per week" : 5}, 'perWeek');
              navigation.navigate('Page2')
            }}
            style={OnboardingStyles.button}
          />
          <Button
          style={OnboardingStyles.button}
            title="7 Days"
            onPress={() => {
              storeData({"Per week" : 7},'perWeek');
              navigation.navigate('Page2')
            }}
            style={OnboardingStyles.button}
          />
          </View>
              </View>
  );
};

const Page2 = ({ navigation }) => {
    return (
            <View style={OnboardingStyles.container}>
                  <Text style={styles.text}>How much time per day can you put in?</Text>
            <View style ={OnboardingStyles.buttonContainer}>
                  <Button
            style={OnboardingStyles.button}
                    title="30 mins"
                    onPress={() => 
                      {
                        navigation.navigate('Page3')
                        storeData({"time": 0.5}, 'time')
                    }}
                    
                  />
            <Button
            style={OnboardingStyles.button}
              title="1 hour"
              onPress={() =>                       {
                navigation.navigate('Page3')
                storeData({"time": 1}, 'time')
              }}
              style={OnboardingStyles.button}
            />
            <Button
            style={OnboardingStyles.button}
              title="1.5 hours"
              onPress={() =>                       {
                navigation.navigate('Page3')
                storeData({"time": 1.5}, 'time')
              }}
              style={OnboardingStyles.button}
            />
            </View>
                </View>
    );
};

const Page3 = () => {
  return (
          <View style={OnboardingStyles.container}>
            <Text style={styles.text}>When do you want us to notify you?</Text>
          </View>
  );
};


const PAGE_WIDTH = Dimensions.get('window').width;


export default function App() {
    return (
            <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="OnBoardingPage" component={OnBoardingPage} />
        <Stack.Screen name="Page1" component={Page1} />
        <Stack.Screen name="Page2" component={Page2} />
        <Stack.Screen name="Page3" component={Page3} />
      </Stack.Navigator>
            </NavigationContainer>
    );
  
}

const OnboardingStyles = StyleSheet.create({
container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '80%',
},
button: {
elevation: 5,
backgroundColor: '#fff',
padding: 15,
borderRadius: 10,
},
})

const styles = StyleSheet.create({
container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},
text: {
  fontSize: 20,
  fontWeight: 'bold',
},

});
