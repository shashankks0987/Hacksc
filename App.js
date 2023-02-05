import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { Animated,  Dimensions } from 'react-native';
import { Constants } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, CalendarEvent } from 'react-native-calendar-events';
import {LineChart, BarChart} from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';
import InputComponent from './InputComponent';
import Circle from './CircleComponent';
import MyGraph from './NewGraphComponent';

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



async function getDataArray(delta) {
  let weight = await getData('weight');  //{"weight": "123"}
  let goal = await getData('goal');
  let time = await getData('time');
  let t = (time.time + delta) * 60
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

const PlusPage = ({navigation}) => {
  const [dataArray, setDataArray] = useState([0,0,0]);
  useEffect(() => {
  const loadData = async () => {
    const result = await getDataArray(0.25);
    setDataArray(result);
  };

  loadData();
}, []);
        return (
                <View style={chartStyles.container}>
                <Text style={{fontSize: 40,fontWeight: 'bold', color:'#15D66F'}}>Your predicted progress for +15 mins</Text>
                  <BarChart horizontal={true} showBarTops
                    data={{
                     // labels: [days[0], days[1],days[2], days[3], days[4], days[5], days[6]],
                      datasets: [
                        {
                          data:
                              dataArray? dataArray : []
                          ,
                        strokeWidth: 50,
                        color: (opacity = 1) => `rgba(57,255,20,1)`
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
                      backgroundGradientTo: "#fff",
                        backgroundGradientToOpacity:0,
                        backgroundGradientFromOpacity:0,
                      decimalPlaces: 2, // optional, defaults to 2dp
                      color: (opacity = 1) => `rgba(100, 149, 237, ${opacity})`,
                      labelColor: (opacity = 1) => "#2D2D2D",
                      propsForDots: {
                        r: "2.5",
                        strokeWidth: "100",
                        stroke: "#ffa726"
                      }
                    }}
                  />
                <Text style={{fontSize: 20, color:'#15D66F'}}>At this rate, you're going to reach your goal in {dataArray.length} days</Text>
                <AppButton
                  title="Back"
                  onPress={() => navigation.navigate('ChartPage')}
                />
                </View>
                
        );
}

const MinusPage = ({navigation}) => {
  const [dataArray, setDataArray] = useState([0,0,0]);
  useEffect(() => {
  const loadData = async () => {
    const result = await getDataArray(-0.25);
    setDataArray(result);
  };

  loadData();
}, []);
        return (
                <View style={chartStyles.container}>
                <Text style={{fontSize: 40,fontWeight: 'bold', color:'#15D66F'}}>Your predicted progress for -15 mins</Text>
                <BarChart horizontal={true} showBarTops
                    data={{
                     // labels: [days[0], days[1],days[2], days[3], days[4], days[5], days[6]],
                      datasets: [
                        {
                          data:
                              dataArray? dataArray : []
                          ,
                        strokeWidth: 50,
                        color: (opacity = 1) => `rgba(57,255,20,1)`
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
                      backgroundGradientTo: "#fff",
                        backgroundGradientToOpacity:0,
                        backgroundGradientFromOpacity:0,
                      decimalPlaces: 2, // optional, defaults to 2dp
                      color: (opacity = 1) => `rgba(100, 149, 237, ${opacity})`,
                      labelColor: (opacity = 1) => "#2D2D2D",
                      propsForDots: {
                        r: "2.5",
                        strokeWidth: "100",
                        stroke: "#ffa726"
                      }
                    }}
                  />
                <Text style={{fontSize: 20, color:'#15D66F'}}>At this rate, you're going to reach your goal in {dataArray.length} days</Text>
                <AppButton
                  title="Back"
                  onPress={() => navigation.navigate('ChartPage')}
                />
                </View>
                
        );
}

const ChartPage = ({ navigation }) => {
  const [dataArray, setDataArray] = useState([0,0,0]);
  useEffect(() => {
  const loadData = async () => {
    const result = await getDataArray(0);
    setDataArray(result);
  };

  loadData();
}, []);
        return (

                <View style={chartStyles.container}>
                <Text style={{fontSize: 40,fontWeight: 'bold', color:'#15D66F'}}>Your progress chart</Text>
                <BarChart horizontal={true} showBarTops
                    data={{
                     // labels: [days[0], days[1],days[2], days[3], days[4], days[5], days[6]],
                      datasets: [
                        {
                          data:
                              dataArray? dataArray : []
                          ,
                        strokeWidth: 50,
                        color: (opacity = 1) => `rgba(57,255,20,1)`
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
                      backgroundGradientTo: "#fff",
                        backgroundGradientToOpacity:0,
                        backgroundGradientFromOpacity:0,
                      decimalPlaces: 2, // optional, defaults to 2dp
                      color: (opacity = 1) => `rgba(100, 149, 237, ${opacity})`,
                      labelColor: (opacity = 1) => "#2D2D2D",
                      propsForDots: {
                        r: "2.5",
                        strokeWidth: "100",
                        stroke: "#ffa726"
                      }
                    }}
                  />
                <Text style={{fontSize: 20, color:'#15D66F'}}>At this rate, you're going to reach your goal in {dataArray.length} days</Text>
                <AppButton
                  title="Add 15 mins everyday"
                  onPress={() => navigation.navigate('PlusPage')}
                />
                <AppButton
                  title="Reduce 15 mins everyday"
                  onPress={() => navigation.navigate('MinusPage')}
                />
                </View>
                
        );
      };


const WeightPage = ({ navigation}) => {
  return(
  <View style={styles.container}>
    <Text style={styles.text}>How much do you weigh(in lbs) right now?</Text>
    <InputComponent key1={'weight'} number-pad />
         <AppButton
          style={OnboardingStyles.button}
            title="Next"
            onPress={() => navigation.navigate('GoalPage')}
          />
  </View>
  )
};

const GoalPage = ({ navigation}) => {
  return(
  <View style={styles.container}>
    <Text style={styles.text}>What's your goal(in lbs)?</Text>
    <InputComponent key1={'goal'} number-pad />
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
          <AppButton style = {OnboardingStyles.button}
            title="Next"
            onPress={() => navigation.navigate('Page2')}

          />
          <MyGraph/>
          </View>
  );
};


// const Page1 = ({ navigation }) => {
//   return (
//           <View style={styles.container}>

//                 <Text style={styles.text}>How many days per week do you want to spend on this goal?</Text>
//           <View style={styles.smallSpace} />
//           <Text style={styles.subtitle}>More goals More Progress                           </Text>
//           <View style ={OnboardingStyles.buttonContainer}>
//                 <AppButton
//           style={OnboardingStyles.button}
//                   title="3 Days"
//                   onPress={() => {
//                     storeData({"Per week":3}, 'perWeek');
//                     navigation.navigate('Page2')}
//                   }
//                 />
//           <View style={OnboardingStyles.space} />
//           <AppButton
//           style={OnboardingStyles.button}
//             title="5 Days"
//             onPress={() => {
//               storeData({"Per week" : 5}, 'perWeek');
//               navigation.navigate('Page2')
//             }}
//           />
//           <View style={OnboardingStyles.space} />
//           <AppButton
//           style={OnboardingStyles.button}
//             title="7 Days"
//             onPress={() => {
//               storeData({"Per week" : 7},'perWeek');
//               navigation.navigate('Page2')
//             }}
//           />
//           </View>
//           <AppButton
//             title="Back"
//             onPress={() => navigation.navigate('OnBoardingPage')}
//           />
//               </View>
//   );
// };

const Page2 = ({ navigation }) => {
    return (
            <View style={styles.container}>
                  <Text style={styles.text}>How much time per day can you put in?</Text>
            <View style={styles.smallSpace} />
            <Text style={styles.subtitle}>Consider it an investment :)                         </Text>
            <View style ={OnboardingStyles.buttonContainer}>
                  <AppButton
                    title="30 mins"
                    onPress={() => 
                      {
                        navigation.navigate('WeightPage')
                        storeData({"time": 0.5}, 'time')
                    }}
                    
                  />
            <View style={OnboardingStyles.space} />
            <AppButton
            style={OnboardingStyles.button}
              title="1 hour"
              onPress={() =>                       {
                navigation.navigate('WeightPage')
                storeData({"time": 1}, 'time')
              }}
            />
            <View style={OnboardingStyles.space} />
            <AppButton
            style={OnboardingStyles.button}
              title="1.5 hours"
              onPress={() =>                       {
                navigation.navigate('WeightPage')
                storeData({"time": 1.5}, 'time')
              }}
            />
            </View>
            <AppButton
              title="Back"
              onPress={() => navigation.navigate('OnboardingPage')}
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
        <Stack.Screen name="Page2" component={Page2} />
        <Stack.Screen name="WeightPage" component={WeightPage} />
        <Stack.Screen name="GoalPage" component={GoalPage} />
        <Stack.Screen name="ChartPage" component={ChartPage} />
        <Stack.Screen name="PlusPage" component={PlusPage} />
        <Stack.Screen name="MinusPage" component={MinusPage} />
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
backgroundColor:'#FFF4D9'
},
buttonContainer: {
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '95%',
    paddingVertical:200,
},
button: {
elevation: 5,
backgroundColor: '#2D2D2D',
padding: 15,
borderRadius: 10,
},
    space:{
        width:25,
        height:25,
    },
    squareButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    paddingVertical:200
    },
    redSquareButton:{
        width:250,
        height:250,
    elevation: 5,
    backgroundColor: '#2D2D2D',
    padding: 15,
    borderRadius: 50
    }
});

const styles = StyleSheet.create({
container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
    padding: 10,
    backgroundColor:'#FFF4D9'
},
text: {
  fontSize: 22,
  fontWeight: 'bold',
  color:'#2D2D2D',
    fontFamily: 'Arial',
    paddingHorizontal:3,
    
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
        
subtitle: {
      fontSize: 18,
      color:'#0F9D58',
        fontFamily: 'Arial',
        paddingHorizontal:3,
        
    },
    smallSpace:{
        width:10,
        height:10,
    }

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
    backgroundColor: "#2D2D2D",
    borderRadius: 5,
    paddingVertical: 9,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color:'#fff',
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
    LoginButtonContainer: {
      elevation: 8,
      backgroundColor: "#79F765",
      borderRadius: 5,
      paddingVertical: 9,
      paddingHorizontal: 12
    },
    LoginButtonText: {
      fontSize: 18,
      color:'#2D2D2D',
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
backgroundColor:'#FFF4D9'
},
});
                       
const homePage = StyleSheet.create({
    logInButton:{
    fontSize: 18,
    color:'#79F765',
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
 
    }
    });



