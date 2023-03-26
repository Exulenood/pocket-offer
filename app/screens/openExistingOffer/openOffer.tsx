/* eslint-disable no-restricted-syntax */
import { Link, useNavigation, useRouter, useSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { apiUrl, colors } from '../../../globals/globalDataAndDefinitions';

// import ClientItems from './clientItems';

export type OfferDataResponse = {
  offerDefinedId: number;
  offerTitle: string;
  clientId: string;
  dateOfCreation: string;
  clientFirstName: string;
  clientLastName: string;
};

type OfferDataResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      offers: {
        offerDefinedId: number;
        offerTitle: string;
        clientId: string;
        dateOfCreation: string;
        clientFirstName: string;
        clientLastName: string;
      }[];
    };

export default function OpenOffer() {
  const router = useRouter();
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const [definedIdFilterValue, setDefinedIdFilterValue] = useState<string>('');
  const [lastNameFilterValue, setLastNameFilterValue] = useState<string>('');
  const [titleFilterValue, setTitleFilterValue] = useState<string>('');
  const [refresh, setRefresh] = useState<boolean>(false);
  const [offerData, setOfferData] = useState<OfferDataResponse[]>([
    {
      offerDefinedId: 0,
      offerTitle: '',
      clientId: '',
      dateOfCreation: '',
      clientFirstName: '',
      clientLastName: '',
    },
  ]);

  async function deleteOffer(offerDefinedId: string) {
    const sessionToken = await SecureStore.getItemAsync('sessionToken');
    const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
    const keyObject = JSON.stringify({
      keyA: sessionToken,
      keyB: sessionSecret,
    });
    console.log(keyObject);
    await fetch(`${apiUrl}/deleteOffer`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: keyObject,
      },
      body: JSON.stringify({
        offerDefinedId: offerDefinedId,
      }),
    });
    if (refresh) {
      setRefresh(false);
    } else {
      setRefresh(true);
    }
  }

  function deleteOfferAlert(offerDefinedId: string) {
    Alert.alert(
      'Deleting Offer',
      `Are you sure you want to delete Offer ${offerDefinedId}? \n (This action cannot be undone)`,
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'OK', onPress: () => deleteOffer(offerDefinedId) },
      ],
    );
  }

  function renderItem(item: { item: OfferDataResponse }) {
    const offer = item.item;
    return (
      <View style={styles.clientItemContainer}>
        <Pressable
          style={styles.clientLinkContainer}
          onPress={() =>
            router.push(
              `../../loginAndAuth/authorization?offer=${offer.offerDefinedId}`,
            )
          }
        >
          <View style={styles.upperClientLinkContainer}>
            <Text
              style={styles.itemTitleText}
            >{`${offer.clientFirstName} ${offer.clientLastName}`}</Text>
            <Text style={styles.itemClientText}>{offer.offerTitle}</Text>
          </View>
          <View style={styles.lowerClientLinkContainer}>
            <Text style={styles.itemIdAndDateText}>
              {offer.offerDefinedId ? offer.offerDefinedId : ''}
            </Text>
            <Text style={styles.itemIdAndDateText}>{offer.dateOfCreation}</Text>
          </View>
        </Pressable>
        <View style={styles.deleteButtonContainer}>
          <Pressable style={styles.deleteButton}>
            <Text
              style={styles.deleteButtonX}
              onPress={() => deleteOfferAlert(offer.offerDefinedId.toString())}
            >
              X
            </Text>
          </Pressable>
        </View>
      </View>
    );

    // style={styles.itemIdAndDateText}
  }

  useEffect(() => {
    async function getOffers() {
      const sessionToken = await SecureStore.getItemAsync('sessionToken');
      const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
      const keyObject = JSON.stringify({
        keyA: sessionToken,
        keyB: sessionSecret,
      });
      console.log(keyObject);

      const response = await fetch(`${apiUrl}/getOffers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: keyObject,
        },
        body: JSON.stringify({
          getAmount: 'all',
        }),
      });
      const data: OfferDataResponseBody = await response.json();

      if ('errors' in data) {
        setErrors(data.errors);
        console.log(errors);
        return;
      }
      setOfferData(data.offers);
    }
    getOffers().catch((error) => console.error(error));

    if (definedIdFilterValue) {
      function filterById(item: OfferDataResponse) {
        if (item.offerDefinedId === parseInt(definedIdFilterValue)) {
          return true;
        }
      }
      setOfferData(offerData.filter(filterById));
    }
    if (lastNameFilterValue) {
      function filterById(item: OfferDataResponse) {
        if (item.clientLastName === lastNameFilterValue) {
          return true;
        }
      }
      setOfferData(offerData.filter(filterById));
    }
    if (titleFilterValue) {
      function filterById(item: OfferDataResponse) {
        if (item.offerTitle === titleFilterValue) {
          return true;
        }
      }
      setOfferData(offerData.filter(filterById));
    }
  }, [refresh]);

  useEffect(() => {
    if (!definedIdFilterValue) {
      if (refresh) {
        setRefresh(false);
      } else {
        setRefresh(true);
      }
    } else {
      function findMatch(item: OfferDataResponse) {
        if (item.offerDefinedId === parseInt(definedIdFilterValue)) {
          return true;
        }
      }
      const doesExist = offerData.find(findMatch);
      if (doesExist) {
        function filterById(item: OfferDataResponse) {
          if (item.offerDefinedId === parseInt(definedIdFilterValue)) {
            return true;
          }
        }
        setOfferData(offerData.filter(filterById));
      }
    }
  }, [definedIdFilterValue]);

  useEffect(() => {
    if (!lastNameFilterValue) {
      if (refresh) {
        setRefresh(false);
      } else {
        setRefresh(true);
      }
    } else {
      function findMatch(item: OfferDataResponse) {
        if (item.clientLastName === lastNameFilterValue) {
          return true;
        }
      }
      const doesExist = offerData.find(findMatch);
      if (doesExist) {
        function filterById(item: OfferDataResponse) {
          if (item.clientLastName === lastNameFilterValue) {
            return true;
          }
        }
        setOfferData(offerData.filter(filterById));
      }
    }
  }, [lastNameFilterValue]);

  useEffect(() => {
    if (!titleFilterValue) {
      if (refresh) {
        setRefresh(false);
      } else {
        setRefresh(true);
      }
    } else {
      function findMatch(item: OfferDataResponse) {
        if (item.offerTitle === titleFilterValue) {
          return true;
        }
      }
      const doesExist = offerData.find(findMatch);
      if (doesExist) {
        function filterById(item: OfferDataResponse) {
          if (item.offerTitle === titleFilterValue) {
            return true;
          }
        }
        setOfferData(offerData.filter(filterById));
      }
    }
  }, [titleFilterValue]);

  return (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <Text style={styles.headText}>Existing Offers</Text>
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.lableText}>Filteroptions:</Text>
        <TextInput
          style={styles.textInputField}
          placeholder="Search for ID"
          onChangeText={setDefinedIdFilterValue}
          value={definedIdFilterValue}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.textInputField}
          placeholder="Search for last Name"
          onChangeText={setLastNameFilterValue}
          value={lastNameFilterValue}
        />
        <TextInput
          style={styles.textInputField}
          placeholder="Search for Title"
          onChangeText={setTitleFilterValue}
          value={titleFilterValue}
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          style={styles.flatlist}
          data={offerData}
          extraData={offerData}
          renderItem={renderItem}
          keyExtractor={(item: OfferDataResponse) =>
            item.offerDefinedId.toString()
          }
        />
      </View>
      <View style={styles.bottomMenuButtonContainer}>
        <Pressable
          style={styles.bottomMenuNegButton}
          onPress={() => router.push('../home')}
        >
          <Text style={styles.bottomMenuButtonText}>Cancel</Text>
        </Pressable>

        <Pressable style={styles.bottomMenuPosButton} onPress={() => null}>
          <Text style={styles.bottomMenuButtonText}>Create new offer</Text>
        </Pressable>
      </View>
    </View>
  );
}

// style={styles.addButtonText}

const styles = StyleSheet.create({
  container: {
    flex: 8,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headContainer: {
    height: 60,
    justifyContent: 'center',
    marginTop: 50,
    width: '80%',
    alignItems: 'center',
  },
  headText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 32,
    color: colors.patternColorD,
  },
  filterContainer: {
    height: 180,
    width: '80%',
    alignItems: 'center',
    rowGap: 3,
  },
  lableText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 18,
    color: colors.patternColorD,
    textAlign: 'center',
    marginBottom: 5,
  },
  textInputField: {
    height: 40,
    width: '100%',
    backgroundColor: colors.patternColorB,
    textAlign: 'center',
  },
  listContainer: {
    flex: 5,
    width: '80%',
    alignItems: 'center',
  },
  flatlist: {
    width: '100%',
  },
  clientItemContainer: {
    flex: 5,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.patternColorE,
    borderBottomWidth: 10,
    borderColor: '#FFF',
  },
  clientLinkContainer: {
    flex: 4,
    marginLeft: 15,
  },
  upperClientLinkContainer: {
    flex: 3,
    width: '100%',
  },
  itemTitleText: {
    includeFontPadding: false,
    textAlign: 'left',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 17,
  },
  itemClientText: {
    includeFontPadding: false,
    textAlign: 'left',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 15,
  },
  lowerClientLinkContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '98%',
    justifyContent: 'space-between',
  },
  itemIdAndDateText: {
    marginTop: 1,
    includeFontPadding: false,
    textAlign: 'left',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 14,
  },
  deleteButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 3,
    borderColor: '#FFF',
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: colors.patternColorD,
  },
  deleteButtonX: {
    textAlign: 'center',
    color: colors.patternColorD,
    fontFamily: 'FredokaOne_400Regular',
    fontSize: 20,
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
