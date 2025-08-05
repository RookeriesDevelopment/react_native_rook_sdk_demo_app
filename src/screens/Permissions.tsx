
import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Platform} from 'react-native';
import {useRookPermissions} from 'react-native-rook-sdk';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export const Permissions = () => {
  const [available, setAvailable] = useState(true);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { ready, checkSamsungAvailability, requestSamsungHealthPermissions  } = useRookPermissions();

  useEffect(() => {
    if (ready) {
      checkSamsungAvailability().then(response => {
        setAvailable(response === 'INSTALLED');
      });
    }
  }, [ready]);

  const handleRequestPermissions = async () => {
    try {
      // if you need to know if the user has requested permissions you need to save it on your localState
      // Like async Storage to save it
      await requestSamsungHealthPermissions();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    available ? (
      <View style={styles.container}>
        <Text style={styles.message}>
          Please grant the necessary permissions
        </Text>

        <Button
          title="Request Samsung Permissions"
          onPress={handleRequestPermissions}
        />

        <Button
          title="Connect Other sources"
          onPress={() => navigation.navigate('Sources')}
        />
      </View>
    ) : (
      <View style = { styles.container}>
        <Text style = { styles.message }>Samsung is not available</Text>
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
