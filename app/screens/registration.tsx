import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../_layout';
import Header from '../Header';

type RegDataResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | { user: { username: string } };

export default function Registration() {
  const router = useRouter();
  const [newUserName, setNewUserName] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const apiUrl: string = 'http://192.168.0.141:3000/api';

  const successfulRegistrationAlert = () =>
    Alert.alert('Signed up!', 'You have successfully signed up!', [
      { text: 'back to login', onPress: () => router.push('../') },
    ]);

  async function createNewUser(userName: string, password: string) {
    const response = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
      }),
    });
    const data: RegDataResponseBody = await response.json();
    if ('errors' in data) {
      setErrors(data.errors);
      return;
    }
    successfulRegistrationAlert();
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.logo}>
        <Header label="POCKET OFFER" />
      </View>
      <Text style={styles.registrationText}>WELCOME!</Text>
      <Text style={styles.registrationText}>Please sign up here:</Text>
      <View style={styles.regInputView}>
        <TextInput
          style={styles.regTextInput}
          placeholder="new Username"
          onChangeText={setNewUserName}
          value={newUserName}
        />
      </View>
      <View style={styles.regInputView}>
        <TextInput
          style={styles.regTextInput}
          placeholder="new Password"
          secureTextEntry={true}
          onChangeText={setNewPassword}
          value={newPassword}
        />
      </View>
      {errors.map((error) => (
        <Text style={styles.errorMessageText} key={`error-${error.message}`}>
          {error.message}
        </Text>
      ))}
      <Pressable
        style={styles.signUpButton}
        onPress={() => createNewUser(newUserName, newPassword)}
      >
        <Text style={styles.signUpButtonText}>SIGN UP AS NEW USER</Text>
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
  registrationText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 30,
  },
  regInputView: {
    backgroundColor: colors.patternColorB,
    width: '70%',
    height: 50,
    marginBottom: 30,
    alignItems: 'center',
  },
  regTextInput: {
    fontFamily: 'NotoSans_400Regular',
    flex: 1,
    height: 50,
  },
  signUpButton: {
    marginTop: 50,
    width: '60%',
    height: 40,
    backgroundColor: colors.patternColorA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonText: {
    fontFamily: 'NotoSans_600SemiBold',
    color: '#FFF',
    fontSize: 20,
  },

  errorMessageText: {
    fontFamily: 'NotoSans_600SemiBold',
    color: '#9e3030',
    fontSize: 15,
    textAlign: 'center',
    width: '70%',
  },
});
