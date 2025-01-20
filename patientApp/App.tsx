import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationPage from './components/Navigation'; // Path to your NavigationPage component
import Innsyn from './screens/Innsyn';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={NavigationPage} />
        <Stack.Screen name="Innsyn" component={Innsyn} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
