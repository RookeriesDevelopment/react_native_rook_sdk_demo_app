/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Button} from 'react-native';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {
  useRookAppleHealth,
  useRookConfiguration,
  useRookEvents,
  useRookSummaries,
} from 'react-native-rook-sdk';
import {storage} from '../utils/storage';

export const Dashboard = () => {
  const [syncing, setSyncing] = useState(false);

  const {ready, enableBackGroundUpdates} = useRookAppleHealth();

  const {scheduleAndroidYesterdaySync} = useRookConfiguration();

  const {syncSummaries} = useRookSummaries();
  const {syncEvents} = useRookEvents();

  useEffect(() => {
    if (ready && Platform.OS === 'ios') {
      enableBackGroundUpdates();
    } else {
      tryToEnableYesterdaySync();
    }
  }, [ready]);

  const handleManualSync = async () => {
    try {
      setSyncing(true);

      // This function will be deprecated in the version 1.0.0
      // we hard recommend to use the background synchronization
      await syncSummaries();
      await syncEvents();
    } catch (error) {
      console.log(error);
    } finally {
      setSyncing(false);
    }
  };

  const tryToEnableYesterdaySync = async () => {
    console.log('Attempting to enable yesterday sync...');

    try {
      const accepted = storage.getBoolean('ACCEPTED_YESTERDAY_SYNC') || false;

      if (accepted) {
        console.log('User accepted yesterday sync');
        await scheduleAndroidYesterdaySync('oldest');
      } else {
        console.log('User did not accept yesterday sync');
      }
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Dashboard</Text>
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
