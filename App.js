import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "./src/views/mapView";
import TabViewExample from "./src/components/layout";
import InputScreen from "./src/views/routeInputScreen";
import SearchScreen from "./src/views/searchSCreens";
import * as TaskManager from 'expo-task-manager';
import { RecoilRoot } from 'recoil';
import { STORAGE_KEY } from "./src/helper/AsyncStorage";
import SplashScreen from "./src/views/splashscreen";
import { THEME_COLOR } from "./src/helper/colors";

TaskManager.defineTask('LOCATION_TASK', async ({ data, error }) => {
  if (error) {
    console.error('LOCATION_TASK Error:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    if (locations && locations.length > 0) {
      const coord = locations[0].coords;

      try {
        const existing = await AsyncStorage.getItem(STORAGE_KEY);
        const routeData = existing ? JSON.parse(existing) : [];
        routeData.push(coord);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routeData));
      } catch (e) {
        console.error('Failed to save background location:', e);
      }
    }
  }
});

const App = () => {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    StatusBar.setBackgroundColor(THEME_COLOR, true);
    StatusBar.setBarStyle('light-content', true);
  }, []);

  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'SplashScreen'}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="MapScreen" component={TabViewExample} />
          <Stack.Screen name="InputScreen" component={InputScreen} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="MapView" component={MapScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
};

export default App;
