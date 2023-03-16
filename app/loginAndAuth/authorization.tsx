/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useRouter, useSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { apiUrl } from '../../globals/globalDataAndDefinitions';
import { colors } from '../_layout';

export default function AuthWrap() {
  const router = useRouter();
  const { reroute } = useSearchParams();
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  useEffect(() => {
    async function revalidateOnRoute() {
      const tokenForValidation = await SecureStore.getItemAsync('sessionToken');
      if (tokenForValidation) {
        const response = await fetch(`${apiUrl}/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: tokenForValidation,
          },
          body: null,
        });
        const data = await response.json();
        if ('errors' in data) {
          setErrors(data.errors);
          console.log(errors);
          router.replace('../');
        }
        await SecureStore.setItemAsync('sessionSecret', data.validation.cToken);

        const sessionSecret = await SecureStore.getItemAsync('sessionSecret');

        if (sessionSecret === data.validation.cToken) {
          router.replace(`../${reroute}`);
        } else {
          console.log('failed to store cToken');
          router.replace('../');
        }
      } else {
        console.log('failed to load Token');
        router.replace('../');
      }
    }
    revalidateOnRoute();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Loading</Text>
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
