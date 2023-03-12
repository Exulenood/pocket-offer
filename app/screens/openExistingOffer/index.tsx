import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function OpenExistingOffer() {
  return (
    <View style={styles.containerUc}>
      <Text style={styles.uCText}>Under Construction</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  containerUc: {
    flex: 1,
    backgroundColor: '#f3ef00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uCText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 40,
    color: 'black',
  },
});
