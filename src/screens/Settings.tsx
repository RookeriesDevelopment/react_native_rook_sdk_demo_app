import React from 'react'
import { Text, SafeAreaView, View, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Settings = () => {
  return (
    <SafeAreaView style = { styles.container }>
      <View style = { styles.optionRow }>
        <Text style = { styles.title }>Manage connections</Text>

        <Ionicons 
          name="chevron-forward-outline" 
          size={24} 
          color="black" 
        />
      </View>

      <View style = { styles.optionRow }>
        <Text style = {[ styles.title, styles.logOut ]}>Log out</Text>

        <Ionicons 
          name="log-out-outline" 
          size={24} 
          color="#F52222" 
        />
      </View>
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

