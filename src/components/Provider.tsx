import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
 } from 'react-native';

interface Props {
  imageURL: string;
  cta: string;
  connected: boolean
}

const Provider: React.FC<Props> = ({ imageURL, cta, connected }) => {
  const handlePress = () => {
    Linking.openURL(cta);
  };

  return (
    <View style = { styles.container }>
      <Image
        source={{ uri: imageURL }}
        style={{ width: 50, height: 50, marginRight: 10 }}
      />

      { !connected && (
        <TouchableOpacity
          onPress={handlePress}
          style={{
            backgroundColor: 'blue',
            padding: 10,
            borderRadius: 5,
            marginTop: 5,
          }}
        >
          <Text style={{ color: 'white' }}>Conectar</Text>
        </TouchableOpacity>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default Provider;

