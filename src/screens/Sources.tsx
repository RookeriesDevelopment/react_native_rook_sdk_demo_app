import React, {type FC, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  Pressable,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import {useRookDataSources} from 'react-native-rook-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {
  DataSource,
  DataSourceType,
} from 'react-native-rook-sdk/lib/typescript/src/types/DataSource';
import {
  useRookAppleHealth,
  useRookPermissions,
  useRookConfiguration,
  useRookHealthConnect,
} from 'react-native-rook-sdk';
import Provider from '../components/Provider';
import {ContinueButton} from '../components/ContinueButton';
import {RootStackParamList} from '../App';
import {AuthorizedSource} from 'react-native-rook-sdk/lib/typescript/src/types/AuthorizedSources';

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
  const {
    getAuthorizedDataSourcesV2,
    getDataSourceAuthorizer,
    revokeDataSource,
  } = useRookDataSources();

  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<AuthorizedSource[]>([]);

  const navigate =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    ready,
    isBackGroundForSummariesEnable,
    enableBackGroundUpdates,
    disableBackGroundUpdates,
  } = useRookAppleHealth();

  const {
    checkAvailability,
    checkSamsungAvailability,
    requestAllAppleHealthPermissions,
    requestAllHealthConnectPermissions,
    requestSamsungHealthPermissions,
  } = useRookPermissions();

  const {isSamsungSyncEnabled, enableSamsungSync, disableSamsungSync} =
    useRookConfiguration();

  const {
    cancelBackgroundSync,
    scheduleBackgroundSync,
    isBackgroundSyncEnabled,
  } = useRookHealthConnect();

  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    try {
      const availableDataSources = await getAuthorizedDataSourcesV2();

      const filtered = availableDataSources.filter(e => {
        return !UNAVAILABLE.includes(e.name);
      });

      const extra: AuthorizedSource[] = [];

      if (Platform.OS === 'ios') {
        const result = await formAppleHealthSource();
        extra.push(result);
      } else {
        const healthConnectAvailability = await checkAvailability();
        const samsungAvailability = await checkSamsungAvailability();

        if (healthConnectAvailability === 'INSTALLED') {
          const hc = await formHealthConnect();
          extra.push(hc);
        }

        if (samsungAvailability === 'INSTALLED') {
          const sh = await formSamsungHealth();
          extra.push(sh);
        }
      }

      setProviders([...extra, ...filtered]);
    } catch (error) {
      console.error('An error occurred trying to fetch the sources:', error);
    } finally {
      setIsLoading(false);
    }
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
      connected = await isBackGroundForSummariesEnable();
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
    let value = false;

    if (status) {
      await disableBackGroundUpdates();
    } else {
      value = true;
      await requestAllAppleHealthPermissions();
      await enableBackGroundUpdates();
    }

    AsyncStorage.setItem('enableBackgroundSync', `${value}`)
      .then()
      .catch(console.log);

    return !status;
  };

  const handleHealthConnect = async (status: boolean) => {
    let value = false;

    if (status) {
      await cancelBackgroundSync();
    } else {
      value = true;
      await requestAllHealthConnectPermissions();
      await scheduleBackgroundSync();
    }

    AsyncStorage.setItem('enableBackgroundSync', `${value}`)
      .then()
      .catch(console.log);

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

    AsyncStorage.setItem('enableBackgroundSync', `${value}`)
      .then()
      .catch(console.log);

    return !status;
  };

  const handleAPISource = async ({name, connected}: SourceDetails) => {
    if (connected) {
      const result = await revokeDataSource(name as DataSourceType);
      console.log(result);
    } else {
      const { authorizationUrl } = await getDataSourceAuthorizer({
        redirectURL: 'https://react.d1kx6n00xlijg7.amplifyapp.com/',
        dataSource: name as DataSourceType,
      });

      if (authorizationUrl) Linking.openURL(authorizationUrl)
      else throw new Error("Not authorization url recieved"); 
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
      console.error(error)
      Alert.alert('Error', 'Something went wrong. Please try again.', [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ]);
    }
  };

  return isLoading || !ready ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

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

      {route?.params?.prev === 'Login' && (
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
