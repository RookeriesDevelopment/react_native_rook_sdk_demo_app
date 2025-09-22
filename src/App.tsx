import * as React from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login} from './screens/Login';
import {Sources} from './screens/Sources';
import {RookSyncGate} from 'react-native-rook-sdk';
import {credentials} from './utils/credentials';
import {HomeNavigation} from './navigators/HomeNavigation';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: {id: number} | undefined;
  Dashboard: {id: number} | undefined;
  Sources: {id: number} | undefined;
};


export default function App() {
  return (
    <RookSyncGate
      environment="sandbox"
      clientUUID={credentials.uuid}
      password={credentials.pwd}
      enableLogs={true}
      enableBackgroundSync>
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
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
            options={{headerShown: true}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RookSyncGate>
  );
}
