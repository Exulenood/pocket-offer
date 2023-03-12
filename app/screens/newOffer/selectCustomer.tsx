import { Link, useNavigation } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CustomerListModal() {
  return (
    <View style={styles.containerUc}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
        <Link style={styles.uCText} href="./newOffer/?customer=BoatyMcBoatface">
          BoatyMcBoatface
        </Link>
        <Link style={styles.uCText} href="./newOffer/?customer=Gowabunga">
          Gowabunga
        </Link>
        <Link style={styles.uCText} href="./newOffer/?customer=LeeroyJenkins">
          LeeroyJenkins
        </Link>
      </View>
    </View>
  );
}

// style={styles.uCText}

const styles = StyleSheet.create({
  containerUc: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uCText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 40,
    color: 'black',
    borderWidth: 2,
  },
});
