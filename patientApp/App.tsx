import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types/screens';  // Ensure this path is correct
import Homepage from './screens/Homepage';
import Endringslogg from './screens/Endringslogg';
import Tilganger from './screens/Tilganger';
import Innsyn from './screens/Innsyn';
import Foresporsel from './screens/Foresporsel';
import DetailedForesporsel from './screens/DetailedForesporsel';
import NotatLogg from './screens/NotatLogg';

// Create the stack navigator
const Stack = createStackNavigator();  

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false, cardStyle: {backgroundColor: "#FFFFFF" }}} initialRouteName="Home">
        <Stack.Screen name="Home" component={Homepage} />
        <Stack.Screen name="Tilganger" component={Tilganger} />
        <Stack.Screen name="Innsyn" component={Innsyn} />
        <Stack.Screen name="Endringslogg" component={Endringslogg} />
        <Stack.Screen name="NotatLogg" component={NotatLogg} />
        <Stack.Screen name="Foresporsel" component={Foresporsel} />
        <Stack.Screen name="DetailedForesporsel" component={DetailedForesporsel} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
