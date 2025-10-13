import React, { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login} from './screens/Login';
import {Sources} from './screens/Sources';
import {Splash} from './screens/Splash'
import {RookSyncGate} from 'react-native-rook-sdk';
import {credentials} from './utils/credentials';
import {HomeNavigation} from './navigators/HomeNavigation';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Splash: {id: number} | undefined
  Login: {id: number} | undefined;
  Dashboard: {id: number} | undefined;
  Sources: {prev?: string} | undefined;
};


export default function App() {
  const bgStatus = useRef(false)

  useEffect(() => {
    checkBackgroundSyncStatus()
  }, [])

  const checkBackgroundSyncStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('enableBackgroundSync');

      if (value === null) throw new Error("No value");
      
      bgStatus.current = JSON.parse(value!) as boolean
      console.log("finished. . .", value)
    } catch (error) {
      bgStatus.current = false
      console.log(error)
    }
  }

  return (
    <RookSyncGate
      environment="sandbox"
      clientUUID={credentials.uuid}
      password={credentials.pwd}
      enableLogs={true}
      enableBackgroundSync = {bgStatus.current}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Dashboard"
            component={HomeNavigation}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Sources"
            component={Sources}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RookSyncGate>
  );
}
