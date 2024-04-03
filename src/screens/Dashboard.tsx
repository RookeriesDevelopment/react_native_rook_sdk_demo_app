/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRookAppleHealth} from 'react-native-rook-sdk';

export const Dashboard = () => {
  const {ready, enableBackgroundForSummaries, enableBackgroundForEvents} =
    useRookAppleHealth();

  useEffect(() => {
    if (ready) {
      enableBackgroundForEvents();
      enableBackgroundForSummaries();
    }
  }, [ready]);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Dashboard</Text>
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
