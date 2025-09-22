 import React from 'react';
 import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
 import {useNavigation} from '@react-navigation/native';
 import { ContinueButton } from '../components/ContinueButton'
 import {RootStackParamList} from '../App';
 import {NativeStackNavigationProp} from '@react-navigation/native-stack';

 export const Splash = () => {
   const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

   return (
     <View style = { styles.container }>
       <SafeAreaView style = { styles.formContainer }>
         <Text style = { styles.title }>Unlock your potencial</Text>
         <Text style = { styles.description }>
           Take control of your health journey with the right tools at your fingertips.
         </Text>

         <ContinueButton onPress = { () => navigation.navigate("Login") }/>

         <View style = { styles.spacer }/>
       </SafeAreaView>
     </View>
   );
 };

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#D2F1C6',
   },
   formContainer: {
     flex: 1,
     marginHorizontal: '2.5%',
     justifyContent: 'flex-end',
   },
   title: {
     fontFamily: 'Poppins',
     fontSize: 40,
     fontWeight: 'bold',
   },
   description: {
     fontFamily: 'Poppins',
     fontSize: 15,
     marginVertical: 16,
   },
   spacer: {
     height: 130
   }
 });


