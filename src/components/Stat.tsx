import React, {type FC} from 'react'
import {Text, View, StyleSheet} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  value: string,
  icon: string
}

export const Stat: FC<Props> = ({ value, icon }) => {
  return (
    <View style = { styles.container }>
      <Ionicons
        name={icon}
        size={ 46 }
      />

      <Text style = { styles.title }>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minWidth: 120,
    backgroundColor: "#E0E8DE",
    padding: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 24,
    marginTop: 10
  }
});

