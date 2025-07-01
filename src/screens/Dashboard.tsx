/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Button, Platform} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {
  useRookEvents, 
  useRookSync,
  useRookAndroidBackgroundSteps,
  useRookAppleHealthVariables,
} from 'react-native-rook-sdk';
import {useIsFocused} from '@react-navigation/native';

export const Dashboard = () => {
  const [syncing, setSyncing] = useState(false);
  const [currentSteps, setCurrentSteps] = useState('');
  const [currentCalories, setCurrentCalories] = useState('');

  const isFocused = useIsFocused();

  const { syncTodayCaloriesCount } = useRookEvents() 

  const { sync } = useRookSync()

  const {syncTodayAndroidStepsCount, syncTodayHealthConnectStepsCount} =
    useRookAndroidBackgroundSteps();

  const {getTodaySteps} = useRookAppleHealthVariables();

  useEffect(() => {
    syncSteps();
    syncCalories();
  }, [isFocused]);

  const handleManualSync = async () => {
    try {
      setSyncing(true);

      sync((error, result) => {
        if (error) {
          console.error(error)
        }
        else {
          console.log("Data synced", result)
        } 

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
      if (Platform.OS === 'android') {
        const hcSteps = await syncTodayHealthConnectStepsCount();
        const deviceSteps = await syncTodayAndroidStepsCount();

        setCurrentSteps(
          `Health Connect ${hcSteps} and device steps ${deviceSteps}`,
        );
      } else {
        const steps = await getTodaySteps();
        setCurrentSteps(`Current steps ${steps}`);
      }
    } catch (error) {
      console.error(error);
      setCurrentSteps('An error occurred, grant permissions');
    }
  };

  const syncCalories = async () => {
    try {
      const result = await syncTodayCaloriesCount();
      setCurrentCalories(`Calories ${JSON.stringify(result)}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Dashboard</Text>
      <Text style={styles.message}>{currentSteps}</Text>
      <Text style={styles.message}>{currentCalories}</Text>

      <Button
        title={syncing ? 'Syncing' : 'Manual Sync'}
        disabled={syncing}
        onPress={handleManualSync}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  extra: {
    marginTop: 50,
  },
});
