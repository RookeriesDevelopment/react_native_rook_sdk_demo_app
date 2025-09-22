import React, { type FC } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  onPress: () => void
}

export const ContinueButton: FC<Props> = ({ onPress }) => {
  return (
   <Pressable style = { styles.button } onPress = {onPress}>
     <Ionicons
       name="chevron-forward-outline"
       size={ 16 }
       color="white"
     />
   </Pressable>
  )
}

const styles = StyleSheet.create({
   button: {
     backgroundColor: '#404040',
     width: 56,
     height: 56,
     borderTopLeftRadius: 12,
     borderTopRightRadius: 12,
     borderBottomLeftRadius: 12,
     justifyContent: 'center',
     alignItems: 'center',
   },
});


