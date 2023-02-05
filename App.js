import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { Animated,  Dimensions } from 'react-native';
import { Constants } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, CalendarEvent } from 'react-native-calendar-events';
import {LineChart} from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';
import InputComponent from './InputComponent';
import Circle from './CircleComponent';
import MyGraph from './NewGraphComponent';
import Slider from '@react-native-community/slider';

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
const tempDay = new Date(currentDate.setDate(currentDate.getDate() - 40));
console.log(tempDay);
const currentDay = new Date().getDate();
const currentMonth = new Date().getMonth();

const days = [];

for (let i = 0; i < 21; i++) {
    const nextDay = new Date(tempDay.setDate(tempDay.getDate() + 1));
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
  let weight = await getData('weight');  //{"weight": "123"}
  let goal = await getData('goal');
  let time = await getData('time');
  let t = time.time * 60
  let predicted = []
  let curr = parseFloat(weight.weight)
  goal = goal.weight
  while(curr > goal){
    let lostWeight = ((t * 34.174 * (curr/2.205)) / 200) / 3500
    curr = curr - lostWeight
    predicted.push(curr)
  }
  return [parseFloat(weight.weight), ...predicted]
}


const ChartPage = ({ navigation }) => {
  const [dataArray, setDataArray] = useState([0,0,0]);
  useEffect(() => {
  const loadData = async () => {
    const result = await getDataArray();
    setDataArray(result);
  };

  loadData();
}, []);
        return (

                <View style={chartStyles.container}>
                <Text style={{fontSize: 40,fontWeight: 'bold', color:'#15D66F'}}>Your progress chart</Text>
                  <LineChart
                    data={{
                     // labels: [days[0], days[1],days[2], days[3], days[4], days[5], days[6]],
                      datasets: [
                        {
                          data:
                              dataArray? dataArray : []
                          ,
                        strokeWidth: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255,1)`
                        },
                        {
                          data: [
                              67.8,
                              67.9,
                              68.3,
                              68.4,
                              68.6,
                              68.6
                          ],
                          strokeWidth: 2,
                          color: (opacity = 1) => `rgba(255, 0, 0,1)`
                        },
                        {
                          data: [
                              67.8,
                              67.2,
                              66.8,
                              66.6,
                              66.5,
                              66.2
                          ],
                          strokeWidth: 2,
                          color: (opacity = 1) => `rgba(0, 255, 0, 1)`
                        }
                      ]
                    }}
                    width={Dimensions.get("window").width} // from react-native
                    height={Dimensions.get("window").height/2.5}
                   // yAxisLabel="$"
                    yAxisSuffix=""
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                      backgroundColor: "#00000",
                      backgroundGradientFrom: "#15D66F",
                      backgroundGradientTo: "#75FB7B",
                      decimalPlaces: 2, // optional, defaults to 2dp
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      style: {
                        borderRadius: 16
                      },
                      propsForDots: {
                        r: "2.5",
                        strokeWidth: "1",
                        stroke: "#ffa726"
                      }
                    }}
                    bezier
                    style={{
                      marginVertical: 16,
                      borderRadius: 16
                    }}
                
                  />
                <Circle/>
                <Timer />
                <AppButton
                  title="Back"
                  onPress={() => navigation.navigate('Page3')}
                />
                </View>
                
        );
      };

/*  return (


        <LinearGradient
          colors={['#43cea2', '#00b0ff']}
          style={{ flex: 1 }}
        >
        <View>
          <Text>Bezier Line Chart</Text>
          <LineChart
            data={{
             // labels: [days[0], days[1],days[2], days[3], days[4], days[5], days[6]],
              datasets: [
                {
                  data: dataArray? dataArray : [],
                strokeWidth: 1,
                color: (opacity = 1) => `rgba(255, 255, 255,1)`
                },
                // {
                //   data: [
                //       67.8,
                //       67.2,
                //       66.8,
                //       66.6,
                //       66.5,
                //       66.2
                //   ],
                //   strokeWidth: 2,
                //   color: (opacity = 1) => `rgba(0, 255, 0, 1)`
                // },
                // {
                //   data: [
                //       67.8,
                //       67.2,
                //       66.8,
                //       66.6,
                //       66.5,
                //       66.2
                //   ],
                //   strokeWidth: 2,
                //   color: (opacity = 1) => `rgba(0, 255, 0, 1)`
                // }
              ]
            }}
            width={Dimensions.get("window").width} // from react-native
            height={Dimensions.get("window").height/2.5}
           // yAxisLabel="$"
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#00b0ff",
              backgroundGradientFrom: "#00b0ff",
              backgroundGradientTo: "#43cea2",
                backgroundGradientFromOpacity:1.0,
                backgroundGradientToOpacity:0.0,
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
        <Circle/>
        <Timer />
        <Button
          title="Back"
          onPress={() => navigation.navigate('Page3')}
          style={styles.button}
        />
        </View>
        </LinearGradient>
        
);
};*/

const WeightPage = ({ navigation}) => {
  return(
  <View style={styles.container}>
    <Text style={styles.text}>How much do you weigh(in lbs) right now?</Text>
    <InputComponent key1={'weight'} />
    <Text style={styles.text}>What's your goal weight(in lbs)?</Text>
         <InputComponent key1={'goal'}/>
         <AppButton
          style={OnboardingStyles.button}
            title="Next"
            onPress={() => navigation.navigate('ChartPage')}
          />
  </View>

  )
};

const OnBoardingPage = ({ navigation }) => {
  return (
          <View style={styles.container}>
            <Text style={styles.text}>LTFit</Text>
          <AppButton
            title="Next"
            onPress={() => navigation.navigate('Page1')}

          />
          <MyGraph/>
          </View>
  );
};


const Page1 = ({ navigation }) => {
  return (
          <View style={styles.container}>

                <Text style={styles.text}>How many days per week do you want to spend on this goal?</Text>
          <View style ={OnboardingStyles.buttonContainer}>
                <AppButton
          style={OnboardingStyles.button}
                  title="3 Days"
                  onPress={() => {
                    storeData({"Per week":3}, 'perWeek');
                    navigation.navigate('Page2')}
                  }
                />
          <AppButton
          style={OnboardingStyles.button}
            title="5 Days"
            onPress={() => {
              storeData({"Per week" : 5}, 'perWeek');
              navigation.navigate('Page2')
            }}
          />
          <AppButton
          style={OnboardingStyles.button}
            title="7 Days"
            onPress={() => {
              storeData({"Per week" : 7},'perWeek');
              navigation.navigate('Page2')
            }}
          />
          </View>
          <AppButton
            title="Back"
            onPress={() => navigation.navigate('OnBoardingPage')}
          />
              </View>
  );
};

const Page2 = ({ navigation }) => {
    return (
            <View style={OnboardingStyles.container}>
                  <Text style={styles.text}>How much time per day can you put in?</Text>
            <View style ={OnboardingStyles.buttonContainer}>
                  <AppButton
                    title="30 mins"
                    onPress={() => 
                      {
                        navigation.navigate('Page3')
                        storeData({"time": 0.5}, 'time')
                    }}
                    
                  />
            <AppButton
            style={OnboardingStyles.button}
              title="1 hour"
              onPress={() =>                       {
                navigation.navigate('Page3')
                storeData({"time": 1}, 'time')
              }}
            />
            <AppButton
            style={OnboardingStyles.button}
              title="1.5 hours"
              onPress={() =>                       {
                navigation.navigate('Page3')
                storeData({"time": 1.5}, 'time')
              }}
            />
            </View>
            <AppButton
              title="Back"
              onPress={() => navigation.navigate('Page1')}
            />
                </View>
    );
};

const Page3 = ({ navigation }) => {
  return (
          <View style={OnboardingStyles.container}>
            <Text style={styles.text}>When do you want us to notify you?</Text>
          <AppButton
          style={OnboardingStyles.button}
            title="Next"
            onPress={() => navigation.navigate('WeightPage')}
          />
          <AppButton onPress={() => navigation.navigate('Page2')}
              title="Back"
              />
          </View>
  );
};

const PersonalGoalsPage = ({ navigation }) => {
    return (
            <View style={OnboardingStyles.container}>
              <Text style={styles.text}>Your current weight</Text>
            <Text style={styles.text}>67.8kg</Text>
            <Text style={styles.text}>Your 2 week target</Text>
            <Text style={styles.text}>66.2kg</Text>
            <AppButton
              title="Back"
              onPress={() => navigation.navigate('ChartPage')}
            />
              </View>

            
            )
};


const PAGE_WIDTH = Dimensions.get('window').width;

const AppButton = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={ButtonStyles.appButtonContainer}>
    <Text style={ButtonStyles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

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
        <Stack.Screen name="WeightPage" component={WeightPage} />
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
backgroundColor:'#F7FAE3'
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
    padding: 10,
    backgroundColor:'#F7FAE3'
},
text: {
  fontSize: 20,
  fontWeight: 'bold',
  color:'#15D66F',
    fontFamily: 'Arial'
},
button:{
alignItems: 'center',
justifyContent: 'center',
paddingVertical: 12,
paddingHorizontal: 32,
borderRadius: 4,
elevation: 3,
backgroundColor: 'black',
},

});

const TimerStyles = StyleSheet.create({
  timerContainer: {
    padding: 20,
    alignItems: 'center',
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
    color:'#15D66F'
  },
});

const ButtonStyles = StyleSheet.create({
  // ...
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color:'#15D66F',
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});

const chartStyles = StyleSheet.create(
{
container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
    padding: 10,
backgroundColor:'#F7FAE3'
},
});



