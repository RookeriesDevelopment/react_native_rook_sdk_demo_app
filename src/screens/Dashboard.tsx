/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Button, Platform} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {
  useRookSummaries,
  useRookAndroidBackgroundSteps,
  useRookAppleHealthVariables,
} from 'react-native-rook-sdk';
import {getYesterdayDate} from '../utils/getYesterdayDate';
import {useIsFocused} from '@react-navigation/native';

export const Dashboard = () => {
  const [syncing, setSyncing] = useState(false);
  const [currentSteps, setCurrentSteps] = useState('');

  const isFocused = useIsFocused();

  const {syncBodySummary, syncPhysicalSummary, syncSleepSummary} =
    useRookSummaries();

  const {syncTodayAndroidStepsCount, syncTodayHealthConnectStepsCount} =
    useRookAndroidBackgroundSteps();

  const {getTodaySteps} = useRookAppleHealthVariables();

  useEffect(() => {
    syncSteps();
  }, [isFocused]);

  const handleManualSync = async () => {
    try {
      setSyncing(true);

      const yesterdayDate = getYesterdayDate();

      // we hardly recommend to use the background synchronization
      // just set in true the flag of enableBackgroundSync in the RookSyncGate
      const [body, physical, sleep] = await Promise.all([
        syncBodySummary(yesterdayDate),
        syncPhysicalSummary(yesterdayDate),
        syncSleepSummary(yesterdayDate),
      ]);

      console.log({body, physical, sleep});
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
      console.log(error);
      setCurrentSteps('An error occurred, grant permissions');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Dashboard</Text>
      <Text style={styles.message}>{currentSteps}</Text>

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
