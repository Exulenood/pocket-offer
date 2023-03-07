import { useRouter, useSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AuthWrap() {
  const router = useRouter();
  const { reroute } = useSearchParams();
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const apiUrl: string = 'http://192.168.0.141:3000/api';

  useEffect(() => {
    async function revalidateOnRoute() {
      const tokenForValidation = await SecureStore.getItemAsync('sessionToken');

      const response = await fetch(`${apiUrl}/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: tokenForValidation,
        }),
      });
      const data = await response.json();
      if ('errors' in data) {
        setErrors(data.errors);
        console.log(errors);
        router.push('../../');
      }

      await SecureStore.setItemAsync('sessionSecret', data.validation.cToken);

      const sessionSecret = await SecureStore.getItemAsync('sessionSecret');

      if (sessionSecret === data.validation.cToken) {
        router.push(`../${reroute}`);
      } else {
        console.log('failed to store cToken');
        router.push('../../');
      }
    }
    revalidateOnRoute();
  }, []);

  return (
    <View>
      <Text>Processing</Text>
    </View>
  );
}
