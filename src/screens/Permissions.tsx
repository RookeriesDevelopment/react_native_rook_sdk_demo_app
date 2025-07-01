/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Platform} from 'react-native';
import {useRookPermissions, useRookDataSources} from 'react-native-rook-sdk';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export const Permissions = () => {
  const [available, setAvailable] = useState(true);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    ready,
    requestAllPermissions,
    requestAndroidBackgroundPermissions,
    checkAvailability,
    appleHealthHasPermissions,
  } = useRookPermissions();

  useEffect(() => {
    if (ready) {
      checkAvailability().then(response => {
        setAvailable(response === 'INSTALLED');
      });
    }
  }, [ready]);

  const handleRequestPermissions = async () => {
    try {
      // if you need to know if the user has requested permissions you need to save it on your localState
      // Like async Storage to save it
      await requestAllPermissions();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequestBackgroundPermissions = async () => {
    try {
      await requestAndroidBackgroundPermissions();
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatus = async () => {
    try {
      const status = await appleHealthHasPermissions();
      console.log(status);
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
        <Button title="Apple Permissions status" onPress={handleStatus} />
        <Button
          title="Connect Other sources"
          onPress={() => navigation.navigate('Sources')}
        />

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
