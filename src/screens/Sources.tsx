import React, {type FC, useState, useEffect} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Text,
  Pressable
} from 'react-native';
import {useRookDataSources} from 'react-native-rook-sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RouteProp, useNavigation } from '@react-navigation/native'
import {DataSource} from 'react-native-rook-sdk/lib/typescript/src/types/DataSource';
import Provider from '../components/Provider';
import { ContinueButton } from '../components/ContinueButton'
import { RootStackParamList } from '../App'

type SourcesScreenRouteProp = RouteProp<RootStackParamList, 'Sources'>;

type Props = {
  route: SourcesScreenRouteProp;
};

export const Sources:FC<Props> = ({ route }) => {
  const {getAvailableDataSources} = useRookDataSources();

  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<DataSource[]>([]);

  const navigate = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  useEffect(() => {

    loadDataSources();

  }, []);

  const loadDataSources = async () => {
    try {
      const availableDataSources = await getAvailableDataSources();

      setProviders(availableDataSources);
    } catch (error) {
      console.error('An error occurred trying to fetch the sources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <View style = { styles.navigation }>
        { route?.params?.prev === "Settings" && (
          <Pressable onPress = {() => navigate.goBack()}>
            <Ionicons name="chevron-back-outline" size = {20}/>
          </Pressable>
        )}
        
        <Text style = { styles.title }>Get value of your data</Text>
      </View>

      <View style = { styles.listContainer }>
        <FlatList
          data={providers}
          keyExtractor={item => item.name}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({item}) => (
            <Provider
              imageURL={item.imageUrl}
              cta={item.authorizationURL}
              connected={item.connected}
              name={item.name}
            />
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>There is not available sources</Text>
            </View>
          }
        /> 
      </View>

      { route?.params?.prev === "Login" && (
        <ContinueButton onPress = {() => navigate.navigate("Dashboard")}/>
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
    backgroundColor: 'white'
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
  }
});

export default Sources;
