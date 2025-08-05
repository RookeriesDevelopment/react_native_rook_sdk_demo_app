import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  NativeEventEmitter,
} from 'react-native';
import {yourLoginService} from '../utils/yourLoginService';
import {getRookModule, useRookConfiguration} from 'react-native-rook-sdk';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export const Login = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState('');

  const {ready, getUserID, updateUserID} = useRookConfiguration();

  useEffect(() => {
    if(ready) {isAlreadyLoggedIn();}
  }, [ready]);


  useEffect(() => {
    const rookModule = getRookModule();
    const eventEmitter = new NativeEventEmitter(rookModule);

    // Subscribe to the event
    const subscription = eventEmitter.addListener(
      'ROOK_NOTIFICATION',
      handleRookNotification,
    );

    // Clean up subscription when the component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  const handleRookNotification = (notification: any) => {
    const {type, value, message, ...rest} = notification;

    switch (type) {
      case 'ROOK_BACKGROUND_ANDROID_PERMISSIONS':
        console.log(`Background permissions on Android: ${value}`);
        break;
      case 'ROOK_HEALTH_CONNECT_PERMISSIONS':
        console.log(`Health Connect permissions: ${value}`);
        break;
      case 'ROOK_BACKGROUND_ENABLED':
        console.log(`Background services enabled: ${value}`);
        break;
      case 'ROOK_APPLE_HEALTH_BACKGROUND_ERROR':
        console.log('Background services enabled: ', rest);
        break;
      default:
        console.log(`Unknown notification: ${{rest, message, value, type}}`);
    }
  };

  const isAlreadyLoggedIn = async () => {
    try {

      const user = await getUserID();

      if (user) {navigation.navigate('Dashboard');}

    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      await yourLoginService(`${userID}`);
      await updateUserID(userID);

      navigation.navigate('Dashboard');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return ready ? (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="User ID"
        keyboardType="email-address"
        onChangeText={text => setUserID(text)}
      />

      <Button
        title={loading ? 'Loading . . .' : 'Log in'}
        disabled={loading}
        onPress={handleLogin}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>Loading</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '100%',
    height: 40,
    color: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
