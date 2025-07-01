import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import {useRookDataSources} from 'react-native-rook-sdk';

import Provider from '../components/Provider';
import {DataSource} from 'react-native-rook-sdk/lib/typescript/src/types/DataSource';

export const Sources = () => {
  const {getAvailableDataSources} = useRookDataSources();

  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<DataSource[]>([]);

  useEffect(() => {

    loadDataSources();

  }, []);

  const loadDataSources = async () => {
    try {
      const availableDataSources = await getAvailableDataSources();

      setProviders(availableDataSources);
    } catch (error) {
      console.error('Error al obtener las fuentes de datos:', error);
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
      <FlatList
        data={providers}
        keyExtractor={item => item.name}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Provider
              imageURL={item.imageUrl}
              cta={item.authorizationURL}
              connected={item.connected}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>There is not available sources</Text>
          </View>
        }
      />
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
    backgroundColor: 'black',
  },
  itemContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'black',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#e0e0e0',
  },
});

export default Sources;
