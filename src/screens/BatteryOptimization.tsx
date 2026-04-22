import React, {Activity, FC} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {ContinueButton} from '../components/ContinueButton';
import {RootStackParamList} from '../App';
import {useOptimizations} from '../hooks/useOptimizations';
import {useRookPermissions} from 'react-native-rook-sdk';

type BateryScreenRouteProp = RouteProp<
  RootStackParamList,
  'BateryOptimization'
>;

type Props = {
  route: BateryScreenRouteProp;
};

export const BatteryOptimization: FC<Props> = ({route}) => {
  const {showBatteryButton, showAutoStartAlert, refreshStatuses} =
    useOptimizations();

  const {requestUnrestrictedBatteryUsage, openAutoStartSettings} =
    useRookPermissions();

  const navigate =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleDisableBatteryOptimization = async () => {
    try {
      await requestUnrestrictedBatteryUsage();
      await refreshStatuses();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnableAutoLaunch = async () => {
    try {
      await openAutoStartSettings();
      await refreshStatuses();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <View style={styles.navigation}>
        {route?.params?.prev === 'Settings' && (
          <Pressable onPress={() => navigate.goBack()}>
            <Ionicons name="chevron-back-outline" size={20} />
          </Pressable>
        )}

        <Text style={styles.navTitle}>Get value of your data</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Improve Performance</Text>
        <Text style={styles.description}>
          To ensure your data are tracked accurately and the app runs smoothly
          in the background, it is necessary to adjust your device settings.
        </Text>

        <View style={styles.buttonContainer}>
          <Activity mode={showBatteryButton ? 'visible' : 'hidden'}>
            <View style={styles.buttonWrapper}>
              <Pressable
                style={styles.button}
                onPress={handleDisableBatteryOptimization}>
                <Text style={styles.buttonText}>
                  Disable Battery Optimization
                </Text>
              </Pressable>
            </View>
          </Activity>

          <Activity mode={showAutoStartAlert ? 'visible' : 'hidden'}>
            <View style={styles.buttonWrapper}>
              <Pressable style={styles.button} onPress={handleEnableAutoLaunch}>
                <Text style={styles.buttonText}>Enable Autolaunch</Text>
              </Pressable>{' '}
            </View>
          </Activity>
        </View>

        <Activity
          mode={
            !showAutoStartAlert && !showBatteryButton ? 'visible' : 'hidden'
          }>
          <Text style={styles.title}>All configurations applied</Text>
        </Activity>
      </View>

      {['Login'].includes(route?.params?.prev || '') && (
        <View style={styles.continue}>
          <ContinueButton
            onPress={() =>
              navigate.navigate('Sources', {prev: 'BateryOptimization'})
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  navTitle: {
    fontSize: 24,
    paddingHorizontal: 20,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 15,
    fontFamily: 'Poppins',
    lineHeight: 22,
    color: '#3A3A3C',
    textAlign: 'center',
    marginBottom: 20,
  },
  bold: {
    fontWeight: '700',
    color: '#1C1C1E',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  buttonWrapper: {
    marginVertical: 8,
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
  navigation: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  continue: {
    marginVertical: 35,
    marginHorizontal: '2.5%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
