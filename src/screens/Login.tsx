import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  NativeEventEmitter,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard
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
      Keyboard.dismiss()
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

  return (
    <ImageBackground
      source = { require('../../assets/images/bg.png') }
      style = { styles.background }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={ styles.keyboardView } 
      >
        <View style = { styles.formContainer }>
          <Text style = { styles.title }>
            Get Started
          </Text>

          <TextInput
            style = { styles.input }
            placeholder = "Enter your phone number"
          /> 

          <Pressable style = { styles.button }>
            <Text style = { styles.buttonText }>Next</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  formContainer: { 
    paddingTop: "2.5%",
    paddingHorizontal: "5%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingBottom: 40,
  },
  title: {
    fontFamily: "Poppins",
    fontSize: 26,
    fontWeight: "bold"
  },
  input: {
    marginVertical: 20,
    borderColor: "#C8BEBE",
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#A0E984",
    paddingVertical: 15,
    paddingHorizontal: "5%",
    alignItems: 'center',
    borderRadius: 10
  },
  buttonText: {
    fontFamily: "Poppins",
    fontSize: 15,
  },
keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
