import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
 } from 'react-native';

type Params = {
  name: string, 
  connected: boolean,
}

interface Props {
  imageURL: string;
  name: string;
  connected: boolean;
  onPress: (params: Params) => Promise<void>
}

const Provider: React.FC<Props> = ({ imageURL, connected, name, onPress }) => {
  const handlePress = async () => {
    await onPress({name, connected})
  };

  return (
    <View style = { styles.container }>
      <View style ={ styles.nameContainer }>
        <Image
          source={typeof imageURL === 'number' ? imageURL : { uri: imageURL }}
          style={{ width: 50, height: 50, marginRight: 10 }}
        />

        <Text style = { styles.title }>{name}</Text>
      </View>

      <Pressable
        onPress={handlePress}
        style={[ styles.button, connected ? styles.disconect : styles.connect]}
      >
        <Text>{ connected ? "Disconnect" : "Connect" }</Text>
      </Pressable>

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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  connect: {
    backgroundColor: '#A0E984',
  },
  disconect: {
    backgroundColor: '#F52222'
  }
});

export default Provider;

