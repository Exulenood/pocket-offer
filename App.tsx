import {
  FredokaOne_400Regular,
  useFonts,
} from '@expo-google-fonts/fredoka-one';
import {
  NotoSans_400Regular,
  NotoSans_600SemiBold,
  NotoSans_800ExtraBold,
} from '@expo-google-fonts/noto-sans';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Header from './components/Header';
import { colors } from './styles/constants';

// import { colors } from './styles/constants';

export default function App() {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const [fontsLoaded] = useFonts({
    FredokaOne_400Regular,
    NotoSans_400Regular,
    NotoSans_800ExtraBold,
    NotoSans_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

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
      <View style={styles.loginButton}>
        <Pressable>
          <Text style={styles.loginText}>LOGIN</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 80,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 180,
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
});
