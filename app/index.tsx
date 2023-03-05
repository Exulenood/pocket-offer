import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from './_layout';
import Header from './Header';

export default function Index() {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.logo}>
        <Header label="POCKET OFFER" />
      </View>
      <View style={styles.loginInputView}>
        <TextInput
          style={styles.loginTextInput}
          placeholder="Username"
          onChangeText={() => setUserName(userName)}
        />
      </View>
      <View style={styles.loginInputView}>
        <TextInput
          style={styles.loginTextInput}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={() => setUserPassword(userPassword)}
        />
      </View>
      <Pressable
        onPress={() => router.push('/screens/home')}
        style={styles.loginButton}
      >
        <Text style={styles.loginText}>LOGIN</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/screens/registration')}
        style={styles.registerButton}
      >
        <Text style={styles.registerText}>Sign up as new user</Text>
      </Pressable>
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
  logo: {
    marginBottom: 120,
  },
  loginInputView: {
    backgroundColor: colors.patternColorB,
    width: '70%',
    height: 50,
    marginBottom: 30,
    alignItems: 'center',
  },
  loginTextInput: {
    fontFamily: 'NotoSans_400Regular',
    flex: 1,
    height: 50,
  },
  loginButton: {
    marginTop: 50,
    width: '60%',
    height: 50,
    backgroundColor: colors.patternColorA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontFamily: 'NotoSans_600SemiBold',
    color: '#FFF',
    fontSize: 20,
  },
  registerButton: {
    marginTop: 50,
    width: '60%',
    height: 30,
    backgroundColor: colors.patternColorA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 15,
  },
});
