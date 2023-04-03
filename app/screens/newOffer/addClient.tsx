/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter, useSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { apiUrl, colors } from '../../../globals/globalDataAndDefinitions';

type AddClientDataResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      client: {
        clientId: string;
        clientDefinedId: number;
        clientFirstName: string;
        clientLastName: string;
        clientAddrPostCode: string;
        clientAddLocality: string;
      };
    };

export default function ClientListModal() {
  const router = useRouter();
  const { maxClientDefinedId } = useSearchParams();
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const [clientDefinedId, setClientDefinedId] = useState<string>('');
  const [clientDefinedIdPlaceholder, setClientDefinedIdPlaceholder] =
    useState<string>('');
  const [clientFirstName, setClientFirstName] = useState<string>('');
  const [clientLastName, setClientLastName] = useState<string>('');
  const [clientAddrStreet, setClientAddrStreet] = useState<string>('');
  const [clientAddrHouseNo, setClientAddrHouseNo] = useState<string>('');
  const [clientAddrL2, setClientAddrL2] = useState<string>('');
  const [clientAddrPostCode, setClientAddrPostCode] = useState<string>('');
  const [clientAddrLocality, setClientAddrLocality] = useState<string>('');
  const [isFormComplete, setIsFormComplete] = useState<boolean>(false);

  useEffect(() => {
    if (!maxClientDefinedId) {
      setClientDefinedIdPlaceholder('Please enter a first Customer ID Number');
    } else {
      const proposedDefinedId = parseInt(maxClientDefinedId) + 1;
      setClientDefinedId(proposedDefinedId.toString());
    }
  }, []);

  useEffect(() => {
    if (
      clientDefinedId &&
      clientFirstName &&
      clientLastName &&
      clientAddrStreet &&
      clientAddrHouseNo &&
      clientAddrPostCode &&
      clientAddrLocality
    ) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }, [
    clientDefinedId,
    clientAddrLocality,
    clientAddrHouseNo,
    clientAddrPostCode,
    clientAddrStreet,
    clientFirstName,
    clientLastName,
    isFormComplete,
  ]);

  function providePrompt(input: string) {
    if (!input) {
      return 'Please provide:';
    } else {
      return '';
    }
  }

  async function addClient() {
    const sessionToken = await SecureStore.getItemAsync('sessionToken');
    const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
    const keyObject = JSON.stringify({
      keyA: sessionToken,
      keyB: sessionSecret,
    });
    console.log(`Object: ${keyObject}`);

    const response = await fetch(`${apiUrl}/createClient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: keyObject,
      },
      body: JSON.stringify({
        clientDefinedId: clientDefinedId,
        clientFirstName: clientFirstName,
        clientLastName: clientLastName,
        clientAddrStreet: clientAddrStreet,
        clientAddrHouseNo: clientAddrHouseNo,
        clientAddrL2: clientAddrL2,
        clientAddrPostCode: clientAddrPostCode,
        clientAddrLocality: clientAddrLocality,
      }),
    });
    const data: AddClientDataResponseBody = await response.json();
    if ('errors' in data) {
      setErrors(data.errors);
      if (errors[0].message === 'Existing Defined Id') {
        Alert.alert(
          'Please select another ID',
          `The Client ID ${clientDefinedId} is already assigned`,
          [
            {
              text: 'OK',
              onPress: () => null,
              style: 'cancel',
            },
          ],
        );
        return;
      }
      return;
    }

    router.replace({
      pathname: './newOffer',
      params: {
        client: `{ "id": "${data.client.clientId}","definedId": "${data.client.clientDefinedId}", "name": "${data.client.clientFirstName} ${data.client.clientLastName}", "locality": "${data.client.clientAddrPostCode} ${data.client.clientAddLocality}" }`,
      },
    });
  }

  function confirmAddClient() {
    if (!isFormComplete) {
      Alert.alert(
        'Some Information is missing',
        'Please fill in all required fields',
        [
          {
            text: 'OK',
            onPress: () => null,
            style: 'cancel',
          },
        ],
      );
    } else {
      Alert.alert(
        'Adding client:',
        `${clientFirstName} ${clientLastName} \n ${clientAddrStreet} ${clientAddrHouseNo} ${clientAddrL2} \n ${clientAddrPostCode} ${clientAddrLocality}`,
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'OK', onPress: () => addClient() },
        ],
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Client Information:</Text>
      </View>
      <View style={styles.inputsContainer}>
        <ScrollView style={styles.inputsScrollview}>
          <View style={styles.singleinputContainer}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.emptyInputText}>
                {providePrompt(clientDefinedId)}
              </Text>
              <Text style={styles.inputLabelText}>New Client ID Number</Text>
            </View>
            <TextInput
              style={styles.textInputField}
              placeholder={clientDefinedIdPlaceholder}
              onChangeText={setClientDefinedId}
              value={clientDefinedId}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.singleinputContainer}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.emptyInputText}>
                {providePrompt(clientFirstName)}
              </Text>
              <Text style={styles.inputLabelText}>First Name</Text>
            </View>
            <TextInput
              style={styles.textInputField}
              placeholder="Enter first name"
              onChangeText={setClientFirstName}
              value={clientFirstName}
            />
          </View>
          <View style={styles.singleinputContainer}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.emptyInputText}>
                {providePrompt(clientLastName)}
              </Text>
              <Text style={styles.inputLabelText}>Last Name</Text>
            </View>
            <TextInput
              style={styles.textInputField}
              placeholder="Enter last name"
              onChangeText={setClientLastName}
              value={clientLastName}
            />
          </View>
          <View style={styles.singleinputContainer}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.emptyInputText}>
                {providePrompt(clientAddrStreet)}
              </Text>
              <Text style={styles.inputLabelText}>Street</Text>
            </View>
            <TextInput
              style={styles.textInputField}
              placeholder="Enter street"
              onChangeText={setClientAddrStreet}
              value={clientAddrStreet}
            />
          </View>
          <View style={styles.singleinputContainer}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.emptyInputText}>
                {providePrompt(clientAddrHouseNo)}
              </Text>
              <Text style={styles.inputLabelText}>House Number</Text>
            </View>
            <TextInput
              style={styles.textInputField}
              placeholder="Enter house number"
              onChangeText={setClientAddrHouseNo}
              value={clientAddrHouseNo}
            />
          </View>
          <View style={styles.singleinputContainer}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.inputLabelText}>Additional Address Line</Text>
            </View>
            <TextInput
              style={styles.textInputField}
              placeholder="additional line (optional)"
              onChangeText={setClientAddrL2}
              value={clientAddrL2}
            />
          </View>
          <View style={styles.singleinputContainer}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.emptyInputText}>
                {providePrompt(clientAddrPostCode)}
              </Text>
              <Text style={styles.inputLabelText}>Post Code</Text>
            </View>
            <TextInput
              style={styles.textInputField}
              placeholder="Enter post code"
              onChangeText={setClientAddrPostCode}
              value={clientAddrPostCode}
            />
          </View>
          <View style={styles.singleinputContainer}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.emptyInputText}>
                {providePrompt(clientAddrLocality)}
              </Text>
              <Text style={styles.inputLabelText}>Town / City</Text>
            </View>
            <TextInput
              style={styles.textInputField}
              placeholder="Enter town / city"
              onChangeText={setClientAddrLocality}
              value={clientAddrLocality}
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.addButtonContainer}>
        <Pressable style={styles.addButton} onPress={() => confirmAddClient()}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 8,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleContainer: {
    flex: 0.7,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 18,
    color: colors.patternColorD,
    textAlign: 'center',
  },
  inputsContainer: {
    flex: 6.5,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputsScrollview: {
    flex: 1,
    width: '100%',
  },
  singleinputContainer: {
    height: 65,
    width: '100%',
    justifyContent: 'center',
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  emptyInputText: {
    fontFamily: 'NotoSans_800ExtraBold',
    fontSize: 15,
    textDecorationLine: 'underline',
    color: colors.patternColorD,
  },
  inputLabelText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 15,
    color: colors.patternColorD,
    marginLeft: 5,
  },
  textInputField: {
    height: 40,
    width: '100%',
    backgroundColor: colors.patternColorB,
    paddingLeft: 5,
    textAlign: 'left',
  },
  addButtonContainer: {
    flex: 0.8,
    margin: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.patternColorA,
  },
  addButtonText: {
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 20,
  },
});
