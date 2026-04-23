import React, {type FC, useState, useEffect} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Text,
  Pressable,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import {useRookAPISources} from 'react-native-rook-sdk';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {
  useRookAppleHealth,
  useRookPermissions,
  useRookSamsungHealth,
  useRookHealthConnect,
  useRookConfiguration,
  useRookAndroidStepCounter,
  type AuthorizedSource,
  APIDataSource,
} from 'react-native-rook-sdk';
import Provider from '../components/Provider';
import {ContinueButton} from '../components/ContinueButton';
import {RootStackParamList} from '../App';
import {AndroidStepsModal} from '../components/AndroidStepModal';
import {userPreferences} from '../utils/userPreferences';

type SourcesScreenRouteProp = RouteProp<RootStackParamList, 'Sources'>;

type SourceDetails = {
  name: string;
  connected: boolean;
};

type Props = {
  route: SourcesScreenRouteProp;
};

type Sources = {
  onPress?: () => Promise<void>;
} & AuthorizedSource;

const UNAVAILABLE = [
  'Dexcom',
  'Whoop',
  'Android',
  'Health Connect',
  'Apple Health',
  'Strava',
];

export const Sources: FC<Props> = ({route}) => {
  const [showSetup, setShowSetup] = useState(false);
  const [hasActivity, setHasActivity] = useState(false);
  const [hasAlarm, setHasAlarm] = useState(false);

  const {
    getAuthorizedDataSourcesV2,
    getDataSourceAuthorizer,
    revokeDataSource,
  } = useRookAPISources();

  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<AuthorizedSource[]>([]);

  const navigate =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {getUserID} = useRookConfiguration();

  const {
    ready,
    isBackgroundUpdatesEnabled,
    enableBackGroundUpdates,
    disableBackGroundUpdates,
  } = useRookAppleHealth();

  const {
    androidHasAlarmPermissions,
    androidHasBackgroundPermissions,
    checkHealthConnectAvailability,
    checkSamsungAvailability,
    requestAndroidAlarmPermissions,
    requestAndroidBackgroundPermissions,
    requestAppleHealthPermissions,
    requestHealthConnectPermissions,
    requestSamsungHealthPermissions,
  } = useRookPermissions();

  const {
    isStepsCounterAvailable,
    isStepsCounterActive,
    enableStepsCounter,
    disableStepsCounter,
  } = useRookAndroidStepCounter();

  const {isSamsungSyncEnabled, enableSamsungSync, disableSamsungSync} =
    useRookSamsungHealth();

  const {
    cancelBackgroundSync,
    scheduleBackgroundSync,
    isBackgroundSyncEnabled,
  } = useRookHealthConnect();

  useEffect(() => {
    loadDataSources();
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const androidPermission = await androidHasBackgroundPermissions();
      const alarmPermissions = await androidHasAlarmPermissions();

      setHasAlarm(alarmPermissions);
      setHasActivity(androidPermission);
    } catch (error) {
      console.log(error);
    }
  };

  const loadDataSources = async () => {
    try {
      const userId = await getUserID();
      const availableDataSources = await getAuthorizedDataSourcesV2(userId);

      const filtered = availableDataSources.filter(e => {
        return !UNAVAILABLE.includes(e.name);
      });

      setProviders([...filtered]);
    } catch (error) {
      console.error('An error occurred trying to fetch the sources:', error);
    } finally {
      const extra: AuthorizedSource[] = await addHealthKits();
      setProviders(provided => [...extra, ...provided]);

      setIsLoading(false);
    }
  };

  const addHealthKits = async (): Promise<AuthorizedSource[]> => {
    const extra: AuthorizedSource[] = [];

    if (Platform.OS === 'ios') {
      const result = await formAppleHealthSource();
      extra.push(result);
    } else {
      const healthConnectAvailability = await checkHealthConnectAvailability();
      const samsungAvailability = await checkSamsungAvailability();
      let androidAvailability = await isStepsCounterAvailable();

      if (healthConnectAvailability === 'INSTALLED') {
        const hc = await formHealthConnect();
        extra.push(hc);
      }

      console.log(samsungAvailability);

      /*if (samsungAvailability === 'INSTALLED') {
              const sh = await formSamsungHealth();
              extra.push(sh);
              }*/

      androidAvailability = true;
      if (androidAvailability) {
        const steps = await formAndroidSteps();
        extra.push(steps);
      }
    }
    return extra;
  };

  const formAndroidSteps = async (): Promise<Sources> => {
    let connected = false;

    try {
      connected = await isStepsCounterActive();
    } catch (error) {
      console.log(error);
    }

    return {
      name: 'Android Steps tracker',
      imageUrl: require('../../assets/images/android.png'),
      authorized: connected,
    };
  };

  const formHealthConnect = async (): Promise<Sources> => {
    let connected = false;

    try {
      connected = await isBackgroundSyncEnabled();
    } catch (error) {
      console.log(error);
    }

    return {
      name: 'Health Connect',
      imageUrl: require('../../assets/images/hc.png'),
      authorized: connected,
    };
  };

  const formSamsungHealth = async (): Promise<Sources> => {
    let connected = false;

    try {
      connected = await isSamsungSyncEnabled();
    } catch (error) {
      console.log(error);
    }

    return {
      name: 'Samsung Health',
      imageUrl: require('../../assets/images/sh.png'),
      authorized: connected,
    };
  };

  const formAppleHealthSource = async (): Promise<Sources> => {
    let connected = false;

    try {
      connected = await isBackgroundUpdatesEnabled();
      console.log({apple: connected});
    } catch (error) {
      console.log(error);
    }

    return {
      name: 'Apple Health',
      imageUrl: require('../../assets/images/apple.png'),
      authorized: connected,
    };
  };

  const handleApple = async (status: boolean): Promise<boolean> => {
    if (status) {
      await disableBackGroundUpdates();
    } else {
      await requestAppleHealthPermissions();
      await enableBackGroundUpdates();
    }

    return !status;
  };

  const handleHealthConnect = async (status: boolean) => {
    if (status) {
      await cancelBackgroundSync();
    } else {
      await requestHealthConnectPermissions();
      await scheduleBackgroundSync();
    }

    return !status;
  };

  const handleSamsung = async (status: boolean) => {
    let value = false;

    if (status) {
      await disableSamsungSync();
    } else {
      value = true;
      await requestSamsungHealthPermissions();
      await enableSamsungSync();
    }

    return !status;
  };

  const handleAndroidSteps = async (status: boolean): Promise<boolean> => {
    const androidPermission = await androidHasBackgroundPermissions();
    const alarmPermissions = await androidHasAlarmPermissions();

    setHasAlarm(alarmPermissions);
    setHasActivity(androidPermission);

    if (!androidPermission || !alarmPermissions) {
      setShowSetup(true);
      return false;
    }

    if (status) {
      await disableStepsCounter();
    } else {
      await enableStepsCounter();
    }

    await userPreferences.savePreference(
      'android_step_tracker',
      (!status).toString(),
    );
    return !status;
  };

  const handleAPISource = async ({name, connected}: SourceDetails) => {
    const userId = await getUserID();
    const type =
      APIDataSource[name.toUpperCase() as keyof typeof APIDataSource];
    console.log(type, name);

    if (connected) {
      const result = await revokeDataSource(userId, type);
      console.log(result);
    } else {
      const {authorizationUrl} = await getDataSourceAuthorizer({
        userID: userId,
        redirectURL: 'https://react.d1kx6n00xlijg7.amplifyapp.com/',
        dataSource: type,
      });

      if (authorizationUrl) Linking.openURL(authorizationUrl);
      else throw new Error('Not authorization url recieved');
    }

    return !connected;
  };

  const handleProviderPress = async ({
    connected,
    name,
  }: SourceDetails): Promise<void> => {
    try {
      let result = !connected;

      switch (name) {
        case 'Apple Health':
          result = await handleApple(connected);
          break;
        case 'Health Connect':
          result = await handleHealthConnect(connected);
          break;
        case 'Samsung Health':
          result = await handleSamsung(connected);
          break;
        case 'Android Steps tracker':
          result = await handleAndroidSteps(connected);
          break;
        default:
          result = await handleAPISource({name, connected});
          break;
      }

      const updatedSources = providers.map(source => {
        if (source.name === name) return {...source, authorized: result};
        return source;
      });

      setProviders(updatedSources);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.', [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ]);
    }
  };

  const requestActivity = async () => {
    try {
      await requestAndroidBackgroundPermissions();
    } catch (error) {
      console.error(error);
    }
  };

  const requestAlarm = async () => {
    try {
      await requestAndroidAlarmPermissions();
    } catch (error) {
      console.log(error);
    }
  };

  const onClose = async () => {
    try {
      const androidPermission = await androidHasBackgroundPermissions();
      const alarmPermissions = await androidHasAlarmPermissions();

      setHasAlarm(alarmPermissions);
      setHasActivity(androidPermission);

      if (!alarmPermissions && !androidPermission) {
        setShowSetup(false);
        return;
      }

      await enableStepsCounter();

      await userPreferences.savePreference('android_step_tracker', 'true');

      const updatedSources = providers.map(source => {
        if (source.name === 'Android Steps tracker')
          return {...source, authorized: androidPermission && alarmPermissions};
        return source;
      });

      setProviders(updatedSources);
    } catch (error) {
      console.log(error);
    } finally {
      setShowSetup(false);
    }
  };

  return isLoading || !ready ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <AndroidStepsModal
        visible={showSetup}
        onClose={onClose}
        activityGranted={hasActivity}
        alarmGranted={hasAlarm}
        onGrantActivity={requestActivity}
        onGrantAlarm={requestAlarm}
      />

      <View style={styles.navigation}>
        {route?.params?.prev === 'Settings' && (
          <Pressable onPress={() => navigate.goBack()}>
            <Ionicons name="chevron-back-outline" size={20} />
          </Pressable>
        )}

        <Text style={styles.title}>Get value of your data</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={providers}
          keyExtractor={item => item.name}
          contentContainerStyle={{gap: 10}}
          renderItem={({item}) => (
            <Provider
              imageURL={item.imageUrl}
              connected={item.authorized}
              name={item.name}
              onPress={handleProviderPress}
            />
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>There is not available sources</Text>
            </View>
          }
        />
      </View>

      {['Login', 'BateryOptimization'].includes(route?.params?.prev || '') && (
        <View style={styles.continue}>
          <ContinueButton onPress={() => navigate.navigate('Dashboard')} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  continue: {
    marginVertical: 35,
    marginHorizontal: '2.5%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    paddingHorizontal: 20,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  listContainer: {
    marginHorizontal: '2.5%',
    marginTop: 10,
    flex: 1,
  },
});

export default Sources;
