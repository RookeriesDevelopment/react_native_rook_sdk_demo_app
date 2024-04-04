/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Button} from 'react-native';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {
  useRookAppleHealth,
  useRookEvents,
  useRookSummaries,
} from 'react-native-rook-sdk';

export const Dashboard = () => {
  const [syncing, setSyncing] = useState(false);

  const {ready, enableBackgroundForSummaries, enableBackgroundForEvents} =
    useRookAppleHealth();

  const {syncYesterdaySummaries} = useRookSummaries();
  const {syncYesterdayEvents} = useRookEvents();

  useEffect(() => {
    if (ready && Platform.OS === 'ios') {
      enableBackgroundForEvents();
      enableBackgroundForSummaries();
    }
  }, [ready]);

  const handleManualSync = async () => {
    try {
      setSyncing(true);

      // This function will be deprecated in the version 1.0.0
      // we hard recommend to use the background synchronization
      await syncYesterdaySummaries();
      await syncYesterdayEvents();
    } catch (error) {
      console.log(error);
    } finally {
      setSyncing(false);
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
