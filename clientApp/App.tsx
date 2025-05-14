import "react-native-get-random-values";

import AccessPage from "./screens/AccessPage";
import ChangeLogPage from "./screens/ChangeLogPage";
import DetailedRequestPage from "./screens/DetailedRequestPage";
import Homepage from "./screens/Homepage";
import InsightPage from "./screens/InsightPage";
import { NavigationContainer } from "@react-navigation/native";
import NotesPage from "./screens/NotesPage";
import { Pages } from "./types/screens";
import { Provider } from "react-redux";
import React from "react";
import RequestPage from "./screens/RequestPage";
import { createStackNavigator } from "@react-navigation/stack";
import {store} from "./redux/store";

const Stack = createStackNavigator<Pages>();

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
          <Stack.Screen name="Access" component={AccessPage} />
          <Stack.Screen name="Insight" component={InsightPage} />
          <Stack.Screen name="ChangeLog" component={ChangeLogPage} />
          <Stack.Screen name="Notes" component={NotesPage} />
          <Stack.Screen name="Request" component={RequestPage} />
          <Stack.Screen
            name="DetailedRequest"
            component={DetailedRequestPage}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
