import "react-native-get-random-values";

import DetailedForesporsel from "./screens/DetailedForesporsel";
import Foresporsel from "./screens/Foresporsel";
import Homepage from "./screens/Homepage";
import Innsyn from "./screens/Innsyn";
import { NavigationContainer } from "@react-navigation/native";
import Notater from "./screens/Notater";
import Oppdateringer from "./screens/Oppdateringer";
import { Provider } from "react-redux";
import React from "react";
import { RootStackParamList } from "./types/screens";
import Tilganger from "./screens/Tilganger";
import { createStackNavigator } from "@react-navigation/stack";
import {store} from "./redux/store";

// Create the stack navigator
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          id={undefined}
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
    </Provider>
  );
}
