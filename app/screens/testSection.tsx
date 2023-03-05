import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function TestSection() {
  // const firstTestGET =

  return (
    <View style={styles.container}>
      <Text>TESTSECTION</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 140,
    alignItems: 'center',
  },
});
