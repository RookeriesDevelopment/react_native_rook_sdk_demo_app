import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
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
  const [password, setPassword] = useState('');

  const {ready, updateUserID} = useRookConfiguration();

  const handleLogin = async () => {
    try {
      setLoading(true);

      await yourLoginService(`${userID}:${password}`);
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
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
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
