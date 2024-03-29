/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */
import { useRouter, useSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { apiUrl, colors } from '../../../globals/globalDataAndDefinitions';

type PositionDataResponse = {
  id: string;
  clientId: string;
  offerDefinedId: number;
  offerTitle: string;
  positionId: string;
  quantity: number | null;
  quantityUnit: string | null;
  positionIsOptional: boolean;
  itemId: string | null;
  itemTitle: string | null;
  itemText: string | null;
  itemSalesPrice: string | null;
  itemSalesDiscount: string | null;
  itemCost: string | null;
  itemIsModified: boolean | null;
};

type PositionDataResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      offerPositions: {
        id: string;
        clientId: string;
        offerDefinedId: number;
        offerTitle: string;
        positionId: string;
        quantity: number | null;
        quantityUnit: string | null;
        positionIsOptional: boolean;
        itemId: string | null;
        itemTitle: string | null;
        itemText: string | null;
        itemSalesPrice: string | null;
        itemSalesDiscount: string | null;
        itemCost: string | null;
        itemIsModified: boolean | null;
      }[];
      creationDate: string;
      clientName: string;
      maxExistingPosId: { max: string };
    };

export default function UserProfileAndSettings() {
  const { offerDefinedId } = useSearchParams();
  const router = useRouter();
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const [positionData, setPositionData] = useState<PositionDataResponse[]>([
    {
      id: '',
      clientId: '',
      offerDefinedId: parseInt(offerDefinedId),
      offerTitle: '',
      positionId: '',
      quantity: 1,
      quantityUnit: 'pc',
      positionIsOptional: false,
      itemId: '-',
      itemTitle: '',
      itemText: '',
      itemSalesPrice: '',
      itemSalesDiscount: '',
      itemCost: '',
      itemIsModified: false,
    },
  ]);
  const [creationDate, setCreationDate] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [offerDefIdTitle, setOfferDefIdTitle] = useState<string>('');
  const [maxExistingPosId, setMaxExistingPosId] = useState<string>('');
  const [refresh, setRefresh] = useState<boolean>(false);

  async function deletePosition(offerRowid: string) {
    const sessionToken = await SecureStore.getItemAsync('sessionToken');
    const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
    const keyObject = JSON.stringify({
      keyA: sessionToken,
      keyB: sessionSecret,
    });
    console.log(keyObject);
    await fetch(`${apiUrl}/deletePosition`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: keyObject,
      },
      body: JSON.stringify({
        offerRowId: offerRowid,
      }),
    });

    if (refresh) {
      setRefresh(false);
    } else {
      setRefresh(true);
    }
  }

  function deletePositionAlert(offerRowId: string, positionId: string) {
    Alert.alert(
      'Deleting Client',
      `Are you sure you want to delete Position ${positionId}?`,
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'OK', onPress: () => deletePosition(offerRowId) },
      ],
    );
  }
  function renderItem(item: { item: PositionDataResponse }) {
    const position = item.item;
    const data = JSON.stringify({
      offerRowId: position.id,
      offerDefinedId: position.offerDefinedId,
      maxPositionId: '',
      positionId: position.positionId,
      quantity: position.quantity ? position.quantity.toString() : '1',
      quantityUnit: position.quantityUnit ? position.quantityUnit : 'pc',
      positionIsOptional: position.positionIsOptional,
      itemId: position.itemId ? position.itemId : '-',
      itemTitle: position.itemTitle ? position.itemTitle : '',
      itemText: position.itemText ? position.itemText : '',
      itemSalesPrice: position.itemSalesPrice ? position.itemSalesPrice : '',
      itemSalesDiscount: position.itemSalesDiscount
        ? position.itemSalesDiscount
        : '',
      itemCost: position.itemCost ? position.itemCost : '',
      itemIsModified: false,
    });

    return (
      <View style={styles.positionContainer}>
        <View style={styles.positionIdContainer}>
          <Text style={styles.showPositionText}>{position.positionId}</Text>
        </View>
        <Pressable
          style={styles.positionInfoLink}
          onPress={() => router.push(`./editItem/?position=${data}`)}
        >
          <View style={styles.positionInfoContainer}>
            <View style={styles.positionUpperSubContainer}>
              <Text style={styles.itemTitleText}>{position.itemTitle}</Text>
              <Text style={styles.itemTextText}>{position.itemText}</Text>
              <Text style={styles.itemIdText}>
                {position.itemId ? `Item ID: ${position.itemId}` : ''}
              </Text>
            </View>
            <View style={styles.positionLowerSubContainer}>
              <Text style={styles.itemQuantityAndPriceText}>
                {position.quantity
                  ? `${position.quantity} ${position.quantityUnit}`
                  : ''}
              </Text>
              <Text style={styles.forEachTxt}>
                {position.quantity ? 'for' : ''}
              </Text>
              <Text style={styles.itemQuantityAndPriceText}>
                {position.itemSalesPrice ? `€ ${position.itemSalesPrice}` : ''}
              </Text>
              <Text style={styles.forEachTxt}>
                {position.quantity && position.itemSalesPrice ? 'each' : ''}
              </Text>
            </View>
          </View>
        </Pressable>
        <View style={styles.positionDeleteContainer}>
          <Pressable
            style={styles.deleteButton}
            onPress={() =>
              deletePositionAlert(position.id, position.positionId)
            }
          >
            <Text style={styles.deleteButtonX}>X</Text>
          </Pressable>
        </View>
      </View>
    );
    // style={styles.forEachTxt}
  }

  useEffect(() => {
    async function getPositions() {
      const sessionToken = await SecureStore.getItemAsync('sessionToken');
      const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
      const keyObject = JSON.stringify({
        keyA: sessionToken,
        keyB: sessionSecret,
      });
      console.log(keyObject);

      const response = await fetch(`${apiUrl}/getOfferPositions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: keyObject,
        },
        body: JSON.stringify({
          offerDefinedId: offerDefinedId,
        }),
      });
      const data: PositionDataResponseBody = await response.json();

      if ('errors' in data) {
        setErrors(data.errors);
        console.log(errors);
        return;
      }
      setPositionData(data.offerPositions);
      setCreationDate(data.creationDate);
      setClientName(data.clientName);
      setMaxExistingPosId(data.maxExistingPosId.max);
      setOfferDefIdTitle(`Offer ${offerDefinedId}`);
    }
    getPositions().catch((error) => console.error(error));
  }, [refresh]);

  function passToAddPosition() {
    const data = JSON.stringify({
      offerRowId: '',
      offerDefinedId: offerDefinedId,
      maxPositionId: maxExistingPosId,
      positionId: '',
      quantity: '1',
      quantityUnit: 'pc',
      positionIsOptional: false,
      itemId: '-',
      itemTitle: '',
      itemText: '',
      itemSalesPrice: '',
      itemSalesDiscount: '',
      itemCost: '',
      itemIsModified: false,
    });
    router.push({
      pathname: './addItem',
      params: {
        position: data,
      },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <View style={styles.idandTitleContainer}>
          <Text style={styles.headTextOfferDefNumber}>{offerDefIdTitle}</Text>
          <Text style={styles.headTextOfferTitle}>
            {positionData[0].offerTitle}
          </Text>
        </View>
        <View style={styles.listHeadContainer}>
          <View style={styles.clientAndDateContainer}>
            <Text style={styles.headTextClient}>{clientName}</Text>
            <Text style={styles.headTextDate}>{creationDate}</Text>
          </View>
          <View style={styles.columnDescriptionContainer}>
            <View style={styles.columnAContainer}>
              <Text style={styles.headTextClient}>Pos.</Text>
            </View>
            <View style={styles.columnBContainer}>
              <Text style={styles.headTextClient}>Item</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          style={styles.flatlist}
          data={positionData}
          extraData={positionData}
          renderItem={renderItem}
          keyExtractor={(item: PositionDataResponse) => item.positionId}
        />
      </View>
      <View style={styles.addButtonContainer}>
        <Pressable style={styles.addButton} onPress={() => passToAddPosition()}>
          <Text style={styles.addButtonText}>Add new item</Text>
        </Pressable>
      </View>
      <View style={styles.bottomMenuButtonContainer}>
        <Pressable
          style={styles.bottomMenuNegButton}
          onPress={() => router.push('../home')}
        >
          <Text style={styles.bottomMenuButtonText}>Back</Text>
        </Pressable>
        <Pressable style={styles.bottomMenuPosButton}>
          <Text style={styles.bottomMenuButtonText}>Pricing</Text>
        </Pressable>
        <Pressable
          style={styles.bottomMenuPosButton}
          onPress={() =>
            router.push(`../finishOffer/finishOffer?offer=${offerDefinedId}`)
          }
        >
          <Text style={styles.bottomMenuButtonText}>{'Finish \nOffer'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headContainer: {
    height: 150,
    marginTop: 40,
    marginBottom: 5,
    width: '80%',
    alignItems: 'center',
  },
  idandTitleContainer: {
    height: 70,
    width: '100%',
    alignItems: 'center',
  },
  headTextOfferDefNumber: {
    includeFontPadding: false,
    marginTop: 0,
    marginBottom: 0,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 22,
    color: colors.patternColorD,
  },
  headTextOfferTitle: {
    includeFontPadding: false,
    marginTop: 0,
    marginBottom: 0,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 20,
    color: colors.patternColorD,
  },
  listHeadContainer: {
    height: 72,
    width: '100%',
    rowGap: 10,
    backgroundColor: '#FFF',
    paddingBottom: 5,
  },
  clientAndDateContainer: {
    height: 35,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.patternColorE,
  },
  headTextClient: {
    includeFontPadding: false,
    marginTop: 0,
    marginBottom: 0,
    padding: 5,
    textAlign: 'left',
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 17,
    color: colors.patternColorD,
  },
  headTextDate: {
    includeFontPadding: false,
    marginTop: 0,
    marginBottom: 0,
    padding: 5,
    textAlign: 'right',
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 17,
    color: colors.patternColorD,
  },
  columnDescriptionContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.patternColorD,
    height: 30,
    width: '100%',
    flexDirection: 'row',
    columnGap: 3,
  },
  columnAContainer: {
    width: 45,
    justifyContent: 'flex-end',
    backgroundColor: colors.patternColorE,
  },
  columnBContainer: {
    flex: 5,
    justifyContent: 'flex-end',
    backgroundColor: colors.patternColorE,
  },
  listContainer: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
  },
  flatlist: {
    width: '100%',
  },

  positionContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    columnGap: 3,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  positionIdContainer: {
    width: 45,
    justifyContent: 'center',
    backgroundColor: colors.patternColorE,
  },
  showPositionText: {
    includeFontPadding: false,
    textAlign: 'center',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_800ExtraBold',
    fontSize: 20,
  },
  positionInfoLink: {
    flex: 4,
  },
  positionInfoContainer: {
    width: '100%',
    flexDirection: 'column',
    rowGap: 2,
    backgroundColor: '#FFF',
  },
  positionUpperSubContainer: {
    backgroundColor: colors.patternColorE,
    width: '100%',
  },
  itemTitleText: {
    includeFontPadding: false,
    textAlign: 'left',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 17,
  },
  itemTextText: {
    includeFontPadding: false,
    textAlign: 'left',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 13,
  },
  itemIdText: {
    includeFontPadding: false,
    textAlign: 'left',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 12,
  },
  forEachTxt: {
    includeFontPadding: false,
    textAlign: 'left',
    textAlignVertical: 'bottom',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 13,
  },
  itemQuantityAndPriceText: {
    includeFontPadding: false,
    textAlign: 'left',
    textAlignVertical: 'bottom',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 15,
  },
  positionLowerSubContainer: {
    backgroundColor: colors.patternColorE,
    width: '100%',
    flexDirection: 'row',
    columnGap: 5,
  },
  positionDeleteContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.patternColorE,
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

  addButtonContainer: {
    height: 60,
    marginTop: 15,
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
    textAlignVertical: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'NotoSans_600SemiBold',
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
    flex: 0.35,
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
