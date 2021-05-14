 import React from 'react';
 import {NavigationContainer} from "@react-navigation/native";
 import {createStackNavigator} from "@react-navigation/stack";
 import OnBoardingScreen from './src/pages/OnBoardingScreen';
 import MainScreen from "./src/pages/MainScreen";
 import EnteranceScreen from "./src/pages/EnteranceScreen";
 import auth from '@react-native-firebase/auth';
 import firestore from '@react-native-firebase/firestore';

 const AppStack = createStackNavigator();
 const App = () => {
   return (
       <NavigationContainer>
           <AppStack.Navigator headerMode={"none"} screenOptions={{gestureEnabled: true, gestureDirection: "horizontal", animationEnabled: true}}>
               {auth().currentUser == null &&
                   <>
                    <AppStack.Screen name={'OnBoarding'} component={OnBoardingScreen}/>
                    <AppStack.Screen name={'Main'} component={MainScreen}/>
                   </>
               }
               <AppStack.Screen name={'Enterance'} component={EnteranceScreen}/>
           </AppStack.Navigator>
       </NavigationContainer>
   );
 };

 export default App;
