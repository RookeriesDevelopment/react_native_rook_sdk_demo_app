import React, {useEffect, useState} from 'react';
import {NativeEventEmitter} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RookSyncGate, getRookModule} from 'react-native-rook-sdk';
import {credentials} from './utils/credentials';
import {Login} from './screens/Login';
import {Sources} from './screens/Sources';
import {Splash} from './screens/Splash';
import {HomeNavigation} from './navigators/HomeNavigation';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Splash: {id: number} | undefined;
  Login: {id: number} | undefined;
  Dashboard: {id: number} | undefined;
  Sources: {prev?: string} | undefined;
};

export default function App() {
  const [bgStatus, setBgStatus] = useState(false)

  useEffect(() => {
    checkBackgroundSyncStatus();

    const eventEmitter = new NativeEventEmitter(getRookModule());
    const subscription = eventEmitter.addListener(
      "ROOK_NOTIFICATION",
      handleRookNotification
    );

    return (() => {
      subscription.remove()
    })
  }, []);

  const handleRookNotification = (notification: {
    type: any;
    value: any;
    message: any;
  }) => {
    const {type, value, message} = notification;

    switch (type) {
      case 'ROOK_BACKGROUND_ANDROID_PERMISSIONS':
        console.log(`Background permissions on Android: ${value}`);
        break;
      case 'ROOK_BACKGROUND_ANDROID_PERMISSIONS_DIALOG_DISPLAYED':
        console.log(
          `Background permissions on Android was displayed: ${value}`,
        );
        break;
      case 'ROOK_HEALTH_CONNECT_PERMISSIONS':
        console.log(`Health Connect permissions: ${value}`);
        break;
      case 'ROOK_HEALTH_CONNECT_PERMISSIONS_PARTIALLY_GRANTED':
        console.log(`Health Connect has partially permissions: ${value}`);
        break;
      case 'ROOK_SAMSUNG_HEALTH_PERMISSIONS':
        console.log(`Samsung Health permissions: ${value}`);
        break;
      case 'ROOK_SAMSUNG_HEALTH_PERMISSIONS_PARTIALLY_GRANTED':
        console.log(`Samsung Health has partially permissions: ${value}`);
        break;
      case 'ROOK_BACKGROUND_ENABLED':
        console.log(`Background services enabled: ${value}`);
        break;
      default:
        console.log(`Unknown notification: ${message}`);
    }
  };

  const checkBackgroundSyncStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('enableBackgroundSync');

      if (value === null) throw new Error('No value');

      setBgStatus(JSON.parse(value!) as boolean);
      console.log('finished. . .', value);
    } catch (error) {
      setBgStatus(false)
    }
  };

  return (
    <RookSyncGate
      environment="sandbox"
      clientUUID={credentials.uuid}
      password={credentials.pwd}
      enableLogs={true}
      enableBackgroundSync={bgStatus.current}>
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
