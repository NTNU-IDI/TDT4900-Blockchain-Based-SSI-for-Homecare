import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationPage from './components/Navigation'; // Path to your NavigationPage component
import Innsyn from './screens/Innsyn';
import Tilganger from './screens/Tilganger';
import Homepage from './screens/Homepage';
import DetailedInnsyn from './screens/DetailedInnsyn';




const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* <Stack.Screen name="Home" component={Homepage} /> */}
        <Stack.Screen name="Innsyn" component={DetailedInnsyn} />
        {/* <Stack.Screen name="Tilganger" component={Tilganger} /> */}


      </Stack.Navigator>
    </NavigationContainer>
  );
}
