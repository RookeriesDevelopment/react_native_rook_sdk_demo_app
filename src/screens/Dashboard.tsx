/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  StatusBar
} from 'react-native';
import {
  useRookSync,
  useRookVariables,
  useRookPermissions,
  SDKDataSource
} from 'react-native-rook-sdk';
import {useIsFocused} from '@react-navigation/native';
import {Stat} from '../components/Stat'

export const Dashboard = () => {
  const [currentSteps, setCurrentSteps] = useState('');
  const [currentCalories, setCurrentCalories] = useState('');

  const isFocused = useIsFocused();
  
  const { 
    checkAvailability, 
    checkSamsungAvailability,
    healthConnectHasPartialPermissions,
    samsungHealthHasPartialPermissions
  } = useRookPermissions()
  const { getTodaySteps, getTodayCalories } = useRookVariables()

  const { sync } = useRookSync()

  useEffect(() => {
    syncSteps();
    syncCalories();
    sync(console.log)
  }, [isFocused]);

  const syncSteps = async () => {
    try {
      if (Platform.OS === 'ios') {
        const steps = await getTodaySteps(SDKDataSource.APPLE_HEALTH)
        setCurrentSteps(steps)
      } else {
        let steps = ''

        if (await checkSamsungHealth()) 
          steps = await getTodaySteps(SDKDataSource.SAMSUNG_HEALTH)

        if (await checkHealhConnect()) 
          steps = await getTodaySteps(SDKDataSource.HEALTH_CONNECT)

        setCurrentSteps(steps)
      }


    } catch (error) {
      console.error(error);
    }
  };

  const checkHealhConnect = async (): Promise<boolean> => {
    try { 
      const available = await checkAvailability()
      const hasPermissions = await healthConnectHasPartialPermissions()

      return available === "INSTALLED" && hasPermissions
    } catch (error) {
      console.error(error) 
      return false
    }
  } 

  const checkSamsungHealth = async (): Promise<boolean> => {
    try { 
      const available = await checkSamsungAvailability()

      if (available !== "INSTALLED") return false

      const hasPermissions = await samsungHealthHasPartialPermissions()
      return hasPermissions
    } catch (error) {
      console.error(error) 
      return false
    }
  } 
  const syncCalories = async () => {
    try {
      if (Platform.OS === 'ios') {
        const calories = await getTodayCalories(SDKDataSource.APPLE_HEALTH)
        setCurrentCalories(`${calories.active + calories.basal}`)
      } else {
        let calories = {active: 0, basal: 0}

        if (await checkSamsungHealth()) 
          calories = await getTodayCalories(SDKDataSource.SAMSUNG_HEALTH)

        if (await checkHealhConnect()) 
          calories = await getTodayCalories(SDKDataSource.HEALTH_CONNECT)

        setCurrentCalories(`${Math.round(calories.active + calories.basal)}`)
      }


    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor = "white"
        barStyle="dark-content"
      />

      <Text style={styles.title}>How your journey goes...</Text>
      <Text style={styles.message}>Move, rest, charge and repeat every day</Text>

      <View style = { styles.statsContainer }>
        <Stat 
          value={currentSteps}
          icon="footsteps-outline"
        /> 

        <Stat 
          value={currentCalories}
          icon="flame-outline"
        /> 
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "2.5%",
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  extraContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12
  },
  title: {
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    fontSize: 24
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
});
