import React from 'react'
import { 
  Alert, 
  Text, 
  SafeAreaView, 
  Pressable, 
  StyleSheet, 
  Platform 
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useRookConfiguration, SDKDataSource} from 'react-native-rook-sdk'
import {RootStackParamList} from '../App';

export const Settings = () => {

  const navigate = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const {removeUserFromRook} = useRookConfiguration()

  const handleLogOut = () => {
    Alert.alert(
      "Log Out", 
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            const sources = Platform.OS === 'ios' 
              ? [SDKDataSource.APPLE_HEALTH]
              : [SDKDataSource.HEALTH_CONNECT, SDKDataSource.SAMSUNG_HEALTH]

            await removeUserFromRook(sources)

            navigate.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
          style: 'destructive',
        }
      ]
    );
  }

  return (
    <SafeAreaView style = { styles.container }>
      <Pressable 
        style = { styles.optionRow }
        onPress = {() => navigate.navigate("Sources", {
          prev: "Settings"
        })}
      >
        <Text style = { styles.title }>Manage connections</Text>

        <Ionicons 
          name="chevron-forward-outline" 
          size={24} 
          color="black" 
        />
      </Pressable>

      <Pressable 
        style = { styles.optionRow }
        onPress = {handleLogOut}
      >
        <Text style = {[ styles.title, styles.logOut ]}>Log out</Text>

        <Ionicons 
          name="log-out-outline" 
          size={24} 
          color="#F52222" 
        />
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "2.5%"
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e1e1e1',
    padding: 10,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 15,
  },
  logOut: {
    color: '#F52222'
  }
});

