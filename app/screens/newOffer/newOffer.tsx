/* eslint-disable no-restricted-syntax */
import { Link, useRouter, useSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../_layout';

type Clientdata = { id: string; name: string; locality: string };

export default function NewOffer() {
  const [selectedClientData, setSelectedClientData] = useState<Clientdata>({
    id: '-',
    name: 'Please select client',
    locality: '-',
  });
  const { client } = useSearchParams();
  const router = useRouter();

  useEffect(() => {
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
    }
  }, [client]);

  return (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <Text style={styles.headText}>Create a new offer</Text>
      </View>
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
                    {`Client Id: ${selectedClientData.id}`}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.SelectButtonContainer}>
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
          <TextInput style={styles.textInputField} placeholder="New Title" />
        </View>
        <View style={styles.singleInputContainer}>
          <Text style={styles.lableText}>
            The new offer will have the ID-Number:
          </Text>
          <TextInput
            style={styles.textInputField}
            placeholder="New Id-Number"
          />
        </View>
      </View>
      <View style={styles.bottomMenuButtonContainer}>
        <Pressable
          style={styles.bottomMenuNegButton}
          onPress={() => router.push('../home')}
        >
          <Text style={styles.bottomMenuButtonText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={styles.bottomMenuPosButton}
          onPress={() => router.push('../../')}
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
    flex: 1,
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
  selectClientContainer: {
    flex: 2.2,
    width: '80%',
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

  SelectButtonContainer: {
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
    fontSize: 18,
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
    flex: 2.8,
    width: '80%',
    alignItems: 'center',
    rowGap: 10,
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
    flex: 1,
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

// squareButtonContainer: {
//   flex: 5,
//   justifyContent: 'space-evenly',
// },
// squareButton: {
//   width: '40%',
//   aspectRatio: 1 / 1,
//   justifyContent: 'center',
//   alignItems: 'center',
//   backgroundColor: colors.patternColorA,
// },
// squareButtonText: {
//   textAlign: 'center',
//   color: '#FFF',
//   fontFamily: 'NotoSans_600SemiBold',
//   fontSize: 20,
// },
