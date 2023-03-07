import { useRouter, useSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../_layout';
import Header from '../Header';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.logo}>
        <Header label="POCKET OFFER" />
      </View>
      <View>
        <Pressable onPress={() => router.back} style={styles.openOfferButton}>
          <Text style={styles.openOfferButtonText}>Create new Offer</Text>
        </Pressable>
        <Pressable onPress={() => router.back} style={styles.openOfferButton}>
          <Text style={styles.openOfferButtonText}>Open existing Offer</Text>
        </Pressable>
      </View>
      <Pressable onPress={() => router.back} style={styles.settingsButton}>
        <Text style={styles.settingsButtonText}>Settings</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('./testSection')}
        style={styles.testRouteButton}
      >
        <Text style={styles.testRouteButtonText}>TESTSECTION</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 60,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 5,
  },
  openOfferButton: {
    marginTop: 50,
    width: 150,
    height: 150,
    backgroundColor: colors.patternColorA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openOfferButtonText: {
    fontFamily: 'NotoSans_600SemiBold',
    color: '#FFF',
    fontSize: 20,
  },
  settingsButton: {
    marginTop: 50,
    width: '90%',
    height: 40,
    backgroundColor: colors.patternColorA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonText: {
    fontFamily: 'NotoSans_600SemiBold',
    color: '#FFF',
    fontSize: 20,
  },
  testRouteButton: {
    marginTop: 50,
    width: '90%',
    height: 40,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testRouteButtonText: {
    fontFamily: 'monospace',
    color: 'black',
    fontSize: 20,
  },
});
