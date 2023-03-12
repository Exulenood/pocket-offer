/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useRouter, useSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../_layout';

export default function Logout() {
  const router = useRouter();
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const apiUrl: string = 'http://192.168.0.141:3000/api/logout';

  useEffect(() => {
    async function LogoutOnRoute() {
      const tokenToClearSession = await SecureStore.getItemAsync(
        'sessionToken',
      );
      async function clearSecureStorage() {
        await SecureStore.deleteItemAsync('loggedInAs');
        await SecureStore.deleteItemAsync('sessionToken');
        await SecureStore.deleteItemAsync('sessionSecret');

        const loggedInAs = await SecureStore.getItemAsync('loggedInAs');
        const sessionToken = await SecureStore.getItemAsync('sessionToken');
        const sessionSecret = await SecureStore.getItemAsync('sessionSecret');

        if (loggedInAs || sessionToken || sessionSecret) {
          console.log('Client-Side Session Cleanup Failed');
        }
      }
      if (tokenToClearSession) {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: tokenToClearSession,
          },
          body: null,
        });
        const data = await response.json();
        if ('errors' in data) {
          setErrors(data.errors);
          console.log(errors);
          clearSecureStorage();
          router.replace('../../');
        }
        router.replace('../../');
      } else {
        console.log('failed to load Token');
        clearSecureStorage();
        router.replace('../../');
      }
    }
    LogoutOnRoute();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Logging you out</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 30,
    color: colors.patternColorA,
  },
});
