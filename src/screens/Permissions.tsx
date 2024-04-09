/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Platform} from 'react-native';
import {useRookPermissions} from 'react-native-rook-sdk';

export const Permissions = () => {
  const [available, setAvailable] = useState(true);

  const {
    ready,
    requestAllPermissions,
    requestAndroidBackgroundPermissions,
    checkAvailability,
  } = useRookPermissions();

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

      // localStorage.setItem('permissionsRequested', true)
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequestBackgroundPermissions = async () => {
    try {
      // if you need to know if the user has requested permissions you need to save it on your localState
      // Like async Storage to save it
      await requestAndroidBackgroundPermissions();

      // localStorage.setItem('permissionsRequested', true)
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
        <Button title="Solicitar Permisos" onPress={handleRequestPermissions} />

        {Platform.OS === 'android' && (
          <View style={styles.extra}>
            <Text style={styles.message}>
              Please grant the necessary permissions, to access to background
              services
            </Text>
            <Button
              title="Solicitar Permisos"
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
