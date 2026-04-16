import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RookSyncGate, RookSdk} from 'react-native-rook-sdk';
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
  useEffect(() => {
    /*
    const listener = RookSdk.onRookMessage(e =>
      handleRookNotification({
        type: e.type,
        value: e.value,
        message: e.message,
      }),
    );

    return () => {
      listener.remove();
    };
  */
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

  return (
    <RookSyncGate
      environment="sandbox"
      clientUUID={credentials.uuid}
      secret={credentials.pwd}
      packageName={credentials.app}
      bundleId={credentials.app}
      enableLogs={true}
      enableBackgroundSync>
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
