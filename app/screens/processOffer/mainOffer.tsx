/* eslint-disable no-restricted-syntax */
import { Link, useRouter, useSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { apiUrl, colors } from '../../../globals/globalDataAndDefinitions';

type PositionDataResponse = {
  clientId: string;
  offerDefinedId: number;
  offerTitle: string;
  positionId: string;
  quantity: number | null;
  quantityUnit: string | null;
  positionIsOptional: boolean;
  itemId: number | null;
  itemTitle: string | null;
  itemText: string | null;
  itemSalesPrice: number | null;
  itemSalesDiscount: number | null;
  itemCost: number | null;
  itemIsModified: boolean | null;
  createdAt: string;
};

type PositionDataResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      clients: {
        clientId: string;
        offerDefinedId: number;
        offerTitle: string;
        positionId: string;
        quantity: number | null;
        quantityUnit: string | null;
        positionIsOptional: boolean;
        itemId: number | null;
        itemTitle: string | null;
        itemText: string | null;
        itemSalesPrice: number | null;
        itemSalesDiscount: number | null;
        itemCost: number | null;
        itemIsModified: boolean | null;
        createdAt: string;
      }[];
      maxClientDefinedId: number;
    };

export default function UserProfileAndSettings() {
  const { offerDefinedId } = useSearchParams();
  const router = useRouter();
  const [positionData, setPositionData] = useState<PositionDataResponse[]>([
    {
      clientId: '',
      offerDefinedId: parseInt(offerDefinedId),
      offerTitle: '',
      positionId: '',
      quantity: null,
      quantityUnit: null,
      positionIsOptional: false,
      itemId: null,
      itemTitle: null,
      itemText: '',
      itemSalesPrice: null,
      itemSalesDiscount: null,
      itemCost: null,
      itemIsModified: null,
      createdAt: '',
    },
  ]);

  function renderItem(item: { item: PositionDataResponse }) {
    const position = item.item;
    return (
      <View style={styles.positionContainer}>
        <View style={styles.showPositionContainer}>
          <Text style={styles.showPositionText}>10</Text>
        </View>
        <Link style={styles.itemLinkContainer} href="../home">
          <View>
            <Text style={styles.itemLinkTitle}>{position.itemTitle}</Text>
            <Text style={styles.itemLinkText}>{position.itemText}</Text>
            <Text style={styles.clientLinkTextId}>
              {position.itemId ? `Item ID: ${position.itemId}` : ''}
            </Text>
          </View>
        </Link>
        <View style={styles.deleteButtonContainer}>
          <Pressable style={styles.deleteButton}>
            <Text style={styles.deleteButtonX} onPress={() => null}>
              X
            </Text>
          </Pressable>
        </View>
      </View>
    );

    // return <ClientItems client={item.item} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <View style={styles.idandTitleContainer}>
          <Text style={styles.headTextOfferDefNumber}>Offer 23030001</Text>
          <Text style={styles.headTextOfferTitle}>New first Offer</Text>
        </View>
        <View style={styles.listHeadContainer}>
          <View style={styles.clientAndDateContainer}>
            <Text style={styles.headTextClient}>Rodney McKay</Text>
            <Text style={styles.headTextDate}>2023-03-18</Text>
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
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>Add new item</Text>
        </Pressable>
      </View>
      <View style={styles.bottomMenuButtonContainer}>
        <Pressable
          style={styles.bottomMenuNegButton}
          onPress={() => router.push('../home')}
        >
          <Text style={styles.bottomMenuButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.bottomMenuPosButton}>
          <Text style={styles.bottomMenuButtonText}>Pricing</Text>
        </Pressable>
        <Pressable style={styles.bottomMenuPosButton}>
          <Text style={styles.bottomMenuButtonText}>{'Finish \nOffer'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

// style={styles.columnAContainer}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headContainer: {
    height: 145,
    marginTop: 40,
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
    height: 30,
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
    // flex: 1,
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
    flex: 6,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FFF',
    borderBottomWidth: 10,
    borderColor: '#FFF',
    columnGap: 3,
  },
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  showPositionContainer: {
    // flex: 1,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.patternColorE,
  },

  showPositionText: {
    textAlign: 'center',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_800ExtraBold',
    fontSize: 20,
    paddingBottom: 2,
  },
  //
  itemLinkContainer: {
    flex: 3.7,
    backgroundColor: colors.patternColorE,
  },
  itemLinkTitle: {
    textAlign: 'left',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 17,
  },
  itemLinkText: {
    textAlign: 'left',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 15,
  },
  clientLinkTextId: {
    textAlign: 'left',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 14,
  },
  deleteButtonContainer: {
    flex: 1.3,
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

// headContainer: {

// },

//
// borderWidth: 2,
// borderColor: 'red'
