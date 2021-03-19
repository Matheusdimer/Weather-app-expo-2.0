import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import Home from "./pages/Home";
import Details from "./pages/Details";
import { WeatherProvider } from "./contexts/WeatherContext";

export type RootStackParamList = {
  Home: undefined;
  Details: { index: number };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <WeatherProvider>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
      </NavigationContainer>
    </WeatherProvider>
  );
}
