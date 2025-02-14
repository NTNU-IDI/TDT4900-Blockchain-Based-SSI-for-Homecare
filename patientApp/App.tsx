import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-get-random-values";

import Homepage from "./screens/Homepage";
import Tilganger from "./screens/Tilganger";
import Innsyn from "./screens/Innsyn";
import Foresporsel from "./screens/Foresporsel";
import DetailedForesporsel from "./screens/DetailedForesporsel";
import Notater from "./screens/Notater";
import Oppdateringer from "./screens/Oppdateringer";
import { RootStackParamList } from "./types/Screens";

// Create the stack navigator
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
        initialRouteName="Home"
      >
        <Stack.Screen name="Home" component={Homepage} />
        <Stack.Screen name="Tilganger" component={Tilganger} />
        <Stack.Screen name="Innsyn" component={Innsyn} />
        <Stack.Screen name="Oppdateringer" component={Oppdateringer} />
        <Stack.Screen name="Notater" component={Notater} />
        <Stack.Screen name="Foresporsel" component={Foresporsel} />
        <Stack.Screen
          name="DetailedForesporsel"
          component={DetailedForesporsel}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
