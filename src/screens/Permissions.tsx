/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Platform} from 'react-native';
import {useRookPermissions, useRookDataSources} from 'react-native-rook-sdk';
import {storage} from '../utils/storage';

export const Permissions = () => {
  const [available, setAvailable] = useState(true);

  const {
    ready,
    requestAllPermissions,
    requestAndroidBackgroundPermissions,
    checkAvailability,
  } = useRookPermissions();

  const {presentDataSourceView} = useRookDataSources();

  useEffect(() => {
    checkAvailability().then(response => {
      setAvailable(response === 'INSTALLED');
    });
  }, [ready]);

  const handleRequestPermissions = async () => {
    try {
      // if you need to know if the user has requested permissions you need to save it on your localState
      // Like async Storage to save it
      await requestAllPermissions();

      storage.set('ACCEPTED_PERMISSIONS', true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequestBackgroundPermissions = async () => {
    try {
      await requestAndroidBackgroundPermissions();

      storage.set('ACCEPTED_YESTERDAY_SYNC', true);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePresent = async () => {
    try {
      await presentDataSourceView({redirectURL: 'https://example.com'});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    available && (
      <View style={styles.container}>
        <Text style={styles.message}>
          Please grant the necessary permissions
        </Text>
        <Button
          title="Request Permissions"
          onPress={handleRequestPermissions}
        />
        <Button title="Connect Other sources" onPress={handlePresent} />

        {Platform.OS === 'android' && (
          <View style={styles.extra}>
            <Text style={styles.message}>
              Please grant the necessary permissions, to access to background
              services
            </Text>
            <Button
              title="Request Android Background Permissions"
              onPress={handleRequestBackgroundPermissions}
            />
          </View>
        )}
      </View>
    )
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
