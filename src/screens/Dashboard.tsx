/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Button } from 'react-native';
import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {
  useRookSync,
  useRookVariables,
  useRookPermissions,
  SDKDataSource
} from 'react-native-rook-sdk';
import {useIsFocused} from '@react-navigation/native';

export const Dashboard = () => {
  const [syncing, setSyncing] = useState(false);
  const [currentSteps, setCurrentSteps] = useState('');
  const [currentCalories, setCurrentCalories] = useState('');

  const isFocused = useIsFocused();
  
  const { checkSamsungAvailability } = useRookPermissions()
  const { getTodaySteps, getTodayCalories } = useRookVariables()

  const { sync } = useRookSync()

  useEffect(() => {
    syncSteps();
    syncCalories();
  }, [isFocused]);

  const handleManualSync = async () => {
    try {
      setSyncing(true);

      sync((result) => {
        console.log(result)
      
        setSyncing(false)
      })

    } catch (error) {
      console.log(error);
    } finally {
      setSyncing(false);
    }
  };

  const syncSteps = async () => {
    try {
      setCurrentSteps('loading...');

      const samsungAvailability = await checkSamsungAvailability()

      if (samsungAvailability === "INSTALLED") {
        const steps = await getTodaySteps(SDKDataSource.SAMSUNG_HEALTH)

        setCurrentSteps(
          `Samsung Health steps: ${steps}`,
        );
      } else {
        setCurrentSteps(`Samsung health is not available`);
      }
    } catch (error) {
      console.error(error);
      setCurrentSteps('An error occurred, grant permissions');
    }
  };

  const syncCalories = async () => {
    try {
      const samsungAvailability = await checkSamsungAvailability()

      if (samsungAvailability === "INSTALLED") {
        const calories = await getTodayCalories(SDKDataSource.SAMSUNG_HEALTH)

        setCurrentCalories(
          `Samsung Health calories: ${JSON.stringify(calories)}`,
        );
      } else {
        setCurrentCalories(`Samsung health is not available`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>How your journey goes...</Text>
      <Text style={styles.message}>Move, rest, charge and repeat every day</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: "2.5%",
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
