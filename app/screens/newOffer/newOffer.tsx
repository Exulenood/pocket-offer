/* eslint-disable no-restricted-syntax */
import { Link, useNavigation, useRouter, useSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { apiUrl, colors } from '../../../globals/globalDataAndDefinitions';

type Clientdata = {
  id: string;
  definedId: string;
  name: string;
  locality: string;
};

type CreateOfferResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      offer: {
        newOffer: string;
      };
    };

type GetMaxOfferDefinedIDResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      offer: {
        maxClientDefinedId: number;
      };
    };

export default function NewOffer() {
  const { client } = useSearchParams();
  const router = useRouter();
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const [selectedClientData, setSelectedClientData] = useState<Clientdata>({
    id: '',
    definedId: '',
    name: 'Please select client',
    locality: '',
  });
  const [offerDefinedIdPlaceholder, setOfferDefinedIdPlaceholder] =
    useState<string>('');
  const [offerTitle, setOfferTitle] = useState<string>('');
  const [offerDefinedId, setOfferDefinedId] = useState<string>('');
  const [selectedDefClientId, setSelectedDefClientId] = useState<string>('');

  // const [offerTitle, setOfferTitle] = useState<string>('')

  useEffect(() => {
    async function getMaxDefinedOfferId() {
      const sessionToken = await SecureStore.getItemAsync('sessionToken');
      const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
      const keyObject = JSON.stringify({
        keyA: sessionToken,
        keyB: sessionSecret,
      });
      console.log(keyObject);

      const response = await fetch(`${apiUrl}/getMaxOfferId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: keyObject,
        },
        body: JSON.stringify({
          request: 'maxOfferId',
        }),
      });
      const data: GetMaxOfferDefinedIDResponseBody = await response.json();

      if ('errors' in data) {
        setErrors(data.errors);
        console.log(errors);
        return;
      }

      if (!data.offer.maxClientDefinedId) {
        setOfferDefinedIdPlaceholder('Please enter a first Offer ID Number');
      } else {
        const proposedDefinedId = data.offer.maxClientDefinedId + 1;
        setOfferDefinedId(proposedDefinedId.toString());
      }
    }
    getMaxDefinedOfferId().catch((error) => console.error(error));

    const backAction = () => {
      Alert.alert(
        'Cancel Offer Creation',
        'Are you sure you want to go back to the Home Screen?',
        [
          {
            text: 'Stay',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => router.push('../home') },
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (client) {
      setSelectedClientData(JSON.parse(client));
      setSelectedDefClientId(`Client Id: ${selectedClientData.definedId}`);
    }
  }, [client]);

  async function createOffer() {
    const sessionToken = await SecureStore.getItemAsync('sessionToken');
    const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
    const keyObject = JSON.stringify({
      keyA: sessionToken,
      keyB: sessionSecret,
    });
    console.log(`Object: ${keyObject}`);

    const response = await fetch(`${apiUrl}/createOffer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: keyObject,
      },
      body: JSON.stringify({
        offerTitle: offerTitle,
        offerDefinedId: offerDefinedId,
        clientId: selectedClientData.id,
      }),
    });

    const data: CreateOfferResponseBody = await response.json();
    if ('errors' in data) {
      setErrors(data.errors);
      if (errors[0].message === 'Existing Defined Id') {
        Alert.alert(
          'Please select another ID',
          `The Client ID ${offerDefinedId} is already assigned`,
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

    if (data.offer.newOffer) {
      router.replace(
        `../../loginAndAuth/authorization?offer=${offerDefinedId}`,
      );
    } else {
      console.log('Did not receive dataset Id from Server');
      return;
    }
  }

  function confirmCreateOffer() {
    if (!selectedClientData.id) {
      Alert.alert('No client chosen', 'Please select a client', [
        {
          text: 'OK',
          onPress: () => null,
          style: 'cancel',
        },
      ]);
    } else if (!offerTitle || !offerDefinedId) {
      Alert.alert(
        'Some Information is missing',
        'Please fill in both fields for \n Offer Title and Offer ID Number ',
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
        'Create Offer:',
        `Offer Title: ${offerTitle} \nOffer ID Number: ${offerDefinedId} \nfor client \n${selectedClientData.name}`,
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'OK', onPress: () => createOffer() },
        ],
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <Text style={styles.headText}>Create a new offer</Text>
      </View>
      <ScrollView style={styles.inputsScrollview}>
        <View style={styles.selectClientContainer}>
          <Text style={styles.lableText}>Please select a client:</Text>
          <View style={styles.customerPreviewcontainer}>
            <View style={styles.customerPreviewSubcontainer}>
              <View style={styles.informationContainer}>
                <View style={styles.clientNameContainer}>
                  <Text style={styles.infoTextClientName}>
                    {selectedClientData.name}
                  </Text>
                </View>
                <View style={styles.idAndLocationContainer}>
                  <View style={styles.locationContainer}>
                    <Text style={styles.infoTextAdditional}>
                      {selectedClientData.locality}
                    </Text>
                  </View>
                  <View style={styles.idContainer}>
                    <Text style={styles.infoTextAdditional}>
                      {selectedDefClientId}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.selectButtonContainer}>
                <Link style={styles.selectButton} href="./selectClient">
                  Choose or Add client
                </Link>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.newOfferInputContainer}>
          <View style={styles.singleInputContainer}>
            <Text style={styles.lableText}>
              Please enter a title for the offer:
            </Text>
            <TextInput
              style={styles.textInputField}
              placeholder="New Title"
              onChangeText={setOfferTitle}
              value={offerTitle}
            />
          </View>
          <View style={styles.singleInputContainer}>
            <Text style={styles.lableText}>
              The new offer will have the ID-Number:
            </Text>
            <TextInput
              style={styles.textInputField}
              placeholder={offerDefinedIdPlaceholder}
              onChangeText={setOfferDefinedId}
              value={offerDefinedId}
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomMenuButtonContainer}>
        <Pressable
          style={styles.bottomMenuNegButton}
          onPress={() => router.push('../home')}
        >
          <Text style={styles.bottomMenuButtonText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={styles.bottomMenuPosButton}
          onPress={() => confirmCreateOffer()}
        >
          <Text style={styles.bottomMenuButtonText}>Create new offer</Text>
        </Pressable>
      </View>
    </View>
  );
}

// style={styles.headContainer}

const styles = StyleSheet.create({
  container: {
    flex: 7,
    flexdirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headContainer: {
    height: 70,
    justifyContent: 'center',
    marginTop: 60,
    width: '80%',
    alignItems: 'center',
  },
  headText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 32,
    color: colors.patternColorD,
  },

  inputsScrollview: {
    flex: 1,
    width: '80%',
  },
  selectClientContainer: {
    height: 180,
    width: '100%',
    alignItems: 'center',
  },
  customerPreviewSubcontainer: {
    marginTop: 15,
    flex: 4,
    flexDirection: 'row',
  },
  informationContainer: {
    flex: 3,
    flexDirection: 'column',
    height: 112,
    borderWidth: 4,
    borderColor: colors.patternColorA,
    backgroundColor: colors.patternColorF,
  },
  clientNameContainer: {
    flex: 0.8,
    borderBottomWidth: 4,
    borderColor: colors.patternColorA,
  },
  idAndLocationContainer: {
    flex: 1.2,
    flexDirection: 'column',
  },
  idContainer: {
    flex: 0.5,
  },
  locationContainer: {
    flex: 0.5,
  },

  infoTextClientName: {
    paddingLeft: 5,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 20,
    color: colors.patternColorD,
  },

  infoTextAdditional: {
    paddingLeft: 5,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 15,
    color: colors.patternColorD,
  },

  selectButtonContainer: {
    flex: 1,
    height: 112,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: colors.patternColorA,
  },
  selectButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.patternColorF,
    backgroundColor: colors.patternColorA,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#FFF',
    fontFamily: 'NotoSans_800ExtraBold',
    fontSize: 16,
  },
  selectButtonText: {
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'NotoSans_800ExtraBold',
    fontSize: 18,
  },

  customerPreviewcontainer: {
    flex: 1.7,
    width: '100%',
  },
  newOfferInputContainer: {
    width: '100%',
    alignItems: 'center',
    rowGap: 10,
    marginTop: 15,
  },
  singleInputContainer: {
    width: '100%',
    alignItems: 'center',
  },

  lableText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 18,
    color: colors.patternColorD,
    textAlign: 'center',
  },
  textInputField: {
    height: 50,
    width: '80%',
    backgroundColor: colors.patternColorB,
    textAlign: 'center',
  },

  bottomMenuButtonContainer: {
    height: 115,
    paddingTop: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    columnGap: 3,
  },
  bottomMenuPosButton: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.patternColorC,
  },
  bottomMenuNegButton: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.patternColorC,
  },
  bottomMenuButtonText: {
    textAlign: 'center',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_800ExtraBold',
    fontSize: 20,
  },
});
