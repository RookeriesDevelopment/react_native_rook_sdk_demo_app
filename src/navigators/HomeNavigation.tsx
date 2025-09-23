/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dashboard} from '../screens/Dashboard';
import {Settings} from '../screens/Settings'

const Tab = createBottomTabNavigator();

export const HomeNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#A0E984',
        tabBarInactiveTintColor: '#ABB7C2',
      })}>

      <Tab.Screen name="Home" component={Dashboard} />

      <Tab.Screen 
        name="Settings" 
        component={Settings} 
        options={{ headerShown: false}} 
      />
    </Tab.Navigator>
  );
};
