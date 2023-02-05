import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { Animated,  Dimensions } from 'react-native';
import { Constants } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, CalendarEvent } from 'react-native-calendar-events';
import {LineChart} from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';


const Stack = createStackNavigator();

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return  JSON.parse(jsonValue);
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






const currentDate = new Date();
const currentDay = new Date().getDate();
const currentMonth = new Date().getMonth();

const days = [];

for (let i = 0; i < 21; i++) {
    const nextDay = new Date(currentDate.setDate(currentDate.getDate() + 1));
    const month = nextDay.getMonth() + 1; // add 1 since getMonth is 0-based
    const day = nextDay.getDate();
    days.push(`${month}/${day}`);
}

console.log(days);


const endDate = new Date('2023-03-01'); // set end date here


const calculateTimeLeft = () => {
  const currentTime = new Date();
  const timeDiff = endDate - currentTime;
  const diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return {
    days: diffDays,
    hours: diffHours,
    minutes: diffMinutes,
    seconds: diffSeconds
  };
};

const currentTime = new Date();
const timeDiff = endDate - currentTime;
const diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
const diffHours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const diffMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
          <View style={TimerStyles.timerContainer}>
          <Text style={TimerStyles.timerText}>Time Left:</Text>
          <Text>{timeLeft.days}</Text>
          <Text>days</Text>
      <Text>{timeLeft.hours}:{timeLeft.minutes}.{timeLeft.seconds}</Text>
    </View>
  );
};

async function getDataArray() {
  let weight = await getData('weight');
  let goal = await getData('goal');
  let time = await getData('time');
  time = time.time * 60
  let predicted = []
  currWeightDate = weight.date
  curr = weight.weight[weight.weight.length - 1]
  while(curr >= goal){
    lostWeight = ((time * 34.174 * (curr/2.205)) / 200) / 3500
    curr = curr - lostWeight
    predicted.push(curr)
  }
  return {
    'predictedWeights' : predicted, 'prevWeights' : weight.weight
  }
}

const ChartPage = ({ navigation }) => {
  
  return (
          <LinearGradient
            colors={['#43cea2', '#00b0ff']}
            style={{ flex: 1 }}
          >
          <View>
            <Text>Bezier Line Chart</Text>
            <LineChart
              data={{
                labels: [days[0], days[1],days[2], days[3], days[4], days[5], days[6]],
                datasets: [
                  {
                    data: getDataArray()
                  }
                ]
              }}
              width={Dimensions.get("window").width} // from react-native
              height={Dimensions.get("window").height/2.5}
             // yAxisLabel="$"
              yAxisSuffix="lbs"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726"
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
          
            />
          <Button
            title="Track Weight"
            onPress={() => navigation.navigate('PersonalGoalsPage')}
            style={styles.button}
          />
          <Timer />
          <Button
            title="Back"
            onPress={() => navigation.navigate('Page3')}
            style={styles.button}
          />
          </View>
          </LinearGradient>
          
  );
};

const OnBoardingPage = ({ navigation }) => {
  return (
          <LinearGradient
            colors={['#43cea2', '#00b0ff']}
            style={{ flex: 1 }}
          >
          <View style={styles.container}>
            <Text style={styles.text}>Welcome to the app!</Text>
            <Text style={styles.text}>This is your onboarding page.</Text>
          <Button
            title="Next"
            onPress={() => navigation.navigate('Page1')}
            style={styles.button}
          />
          </View>
          </LinearGradient>
  );
};


const Page1 = ({ navigation }) => {
  return (
          <LinearGradient
            colors={['#43cea2', '#00b0ff']}
            style={{ flex: 1 }}
          >
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
          <Button
            title="Back"
            onPress={() => navigation.navigate('OnBoardingPage')}
            style={styles.button}
          />
              </View>
          </LinearGradient>
  );
};

const Page2 = ({ navigation }) => {
    return (
            <LinearGradient
              colors={['#43cea2', '#00b0ff']}
              style={{ flex: 1 }}
            >
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
            <Button
              title="Back"
              onPress={() => navigation.navigate('Page1')}
              style={styles.button}
            />
                </View>
            </LinearGradient>
    );
};

const Page3 = ({ navigation }) => {
  return (
          <LinearGradient
            colors={['#43cea2', '#00b0ff']}
            style={{ flex: 1 }}
          >
          <View style={OnboardingStyles.container}>
            <Text style={styles.text}>When do you want us to notify you?</Text>
          <Button
          style={OnboardingStyles.button}
            title="Next"
            onPress={() => navigation.navigate('ChartPage')}
            style={OnboardingStyles.button}
          />
          <Button
            title="Back"
            onPress={() => navigation.navigate('Page2')}
            style={styles.button}
          />
          </View>
          </LinearGradient>
  );
};

const PersonalGoalsPage = ({ navigation }) => {
    return (
            <LinearGradient
              colors={['#43cea2', '#00b0ff']}
              style={{ flex: 1 }}
            >
            <View style={OnboardingStyles.container}>
              <Text style={styles.text}>Your current weight</Text>
            <Text style={styles.text}>67.8kg</Text>
            <Text style={styles.text}>Your 2 week target</Text>
            <Text style={styles.text}>66.2kg</Text>
            <Button
              title="Back"
              onPress={() => navigation.navigate('ChartPage')}
              style={styles.button}
            />
              </View>

            </LinearGradient>
            
            )
};


const PAGE_WIDTH = Dimensions.get('window').width;



export default function App() {
    return (
            <NavigationContainer>
      <Stack.Navigator   screenOptions={{
      headerShown: false
    }}>
        <Stack.Screen name="OnBoardingPage" component={OnBoardingPage} />
        <Stack.Screen name="Page1" component={Page1} />
        <Stack.Screen name="Page2" component={Page2} />
        <Stack.Screen name="Page3" component={Page3} />
        <Stack.Screen name="ChartPage" component={ChartPage} />
        <Stack.Screen name="PersonalGoalsPage" component={PersonalGoalsPage} />
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

const TimerStyles = StyleSheet.create({
  timerContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});



