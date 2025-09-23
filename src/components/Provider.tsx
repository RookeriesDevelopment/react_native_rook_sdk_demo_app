import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Linking,
  StyleSheet,
 } from 'react-native';

interface Props {
  imageURL: string;
  cta: string;
  name: string;
  connected: boolean
}

const Provider: React.FC<Props> = ({ imageURL, cta, connected, name }) => {
  const handlePress = () => {
    Linking.openURL(cta);
  };

  return (
    <View style = { styles.container }>
      <View style ={ styles.nameContainer }>
        <Image
          source={{ uri: imageURL }}
          style={{ width: 50, height: 50, marginRight: 10 }}
        />

        <Text style = { styles.title }>{name}</Text>
      </View>

      { !connected && (
        <Pressable
          onPress={handlePress}
          style={ styles.button }
        >
          <Text>Conectar</Text>
        </Pressable>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#C8BEBE',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 16
  },
  button:{
    backgroundColor: '#A0E984',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  }
});

export default Provider;

