import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {yourLoginService} from '../utils/yourLoginService';
import {useRookConfiguration} from 'react-native-rook-sdk';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export const Login = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState('');

  const {updateUserID} = useRookConfiguration();

  const handleLogin = async () => {
    try {
      Keyboard.dismiss();
      setLoading(true);

      await yourLoginService(`${userID}`);
      await updateUserID(userID);

      navigation.navigate('Sources', {prev: 'Login'});
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg.png')}
      style={styles.background}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Get Started</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            onChangeText={text => setUserID(text)}
          />

          {loading ? (
            <ActivityIndicator />
          ) : (
            <Pressable style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Next</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  formContainer: {
    paddingTop: '2.5%',
    paddingHorizontal: '5%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 26,
    fontWeight: 'bold',
  },
  input: {
    marginVertical: 20,
    color: 'black',
    borderColor: '#C8BEBE',
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#A0E984',
    paddingVertical: 15,
    paddingHorizontal: '5%',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontSize: 15,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
