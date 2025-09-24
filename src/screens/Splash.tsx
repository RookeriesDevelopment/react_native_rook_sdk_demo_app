 import React, {useEffect} from 'react';
 import { StatusBar, Text, View, StyleSheet, SafeAreaView } from 'react-native';
 import {useNavigation} from '@react-navigation/native';
 import {NativeStackNavigationProp} from '@react-navigation/native-stack';
 import { useRookConfiguration } from 'react-native-rook-sdk'
 import { ContinueButton } from '../components/ContinueButton'
 import {RootStackParamList} from '../App';

 export const Splash = () => {
   const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

   const {ready, getUserID } = useRookConfiguration();

   useEffect(() => {
     if(ready) isAlreadyLoggedIn()
   }, [ready])

   const isAlreadyLoggedIn = async () => {
      try {

        const user = await getUserID();

        if (user) {navigation.navigate('Dashboard');}

      } catch (error) {
        console.error(error);
      }
    };

   return (
     <View style = { styles.container }>

      <StatusBar 
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
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


