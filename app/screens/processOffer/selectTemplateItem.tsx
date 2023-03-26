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

export type TemplateItemDataResponse = {
  id: number;
  itemId: string;
  itemTitle: string;
  itemText: string;
  itemSalesPrice: string;
  itemCost: string;
};

type PositionData = {
  toOrigin: string;
  offerRowId: string;
  offerDefinedId: string;
  positionId: string;
};

type TemplateItemDataResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      templateItems: {
        id: number;
        itemId: string;
        itemTitle: string;
        itemText: string;
        itemSalesPrice: string;
        itemCost: string;
      }[];
    };

export default function SelectTemplateItem() {
  const { originData } = useSearchParams();
  const router = useRouter();
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const [templateItemData, setTemplateItemData] = useState<
    TemplateItemDataResponse[]
  >([
    {
      id: 0,
      itemId: '',
      itemTitle: '',
      itemText: '',
      itemSalesPrice: '',
      itemCost: '',
    },
  ]);
  const [positionData, setPositionData] = useState<PositionData>({
    toOrigin: '',
    offerRowId: '',
    offerDefinedId: '',
    positionId: '',
  });
  const [itemId, setItemId] = useState<string>('');
  const [itemTitle, setItemTitle] = useState<string>('');
  const [itemText, setItemText] = useState<string>('');
  const [itemCost, setItemCost] = useState<string>('0');
  const [itemSalesPrice, setItemSalesPrice] = useState<string>('0');
  const [refresh, setRefresh] = useState<boolean>(false);
  const [itemIdFilterValue, setItemIdFilterValue] = useState<string>('');
  const [titleFilterValue, setTitleFilterValue] = useState<string>('');

  async function deleteTemplateItem(templateItemRowId: string) {
    const sessionToken = await SecureStore.getItemAsync('sessionToken');
    const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
    const keyObject = JSON.stringify({
      keyA: sessionToken,
      keyB: sessionSecret,
    });
    console.log(keyObject);
    await fetch(`${apiUrl}/deleteTemplateItem`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: keyObject,
      },
      body: JSON.stringify({
        templateItemRowId: templateItemRowId,
      }),
    });
    function filterById(item: TemplateItemDataResponse) {
      if (item.id !== parseInt(templateItemRowId)) {
        return true;
      }
    }
    setTemplateItemData(templateItemData.filter(filterById));
  }

  function deleteTemplateItemAlert(templateItemRowId: string, title: string) {
    Alert.alert(
      'Deleting Client',
      `Are you sure you want to delete Item ${title}? \n (This action cannot be undone)`,
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'OK', onPress: () => deleteTemplateItem(templateItemRowId) },
      ],
    );
  }

  useEffect(() => {
    if (originData) {
      const data = JSON.parse(originData);
      setPositionData(data);
    }
  }, []);

  useEffect(() => {
    if (!itemIdFilterValue) {
      if (refresh) {
        setRefresh(false);
      } else {
        setRefresh(true);
      }
    } else {
      function findMatch(item: TemplateItemDataResponse) {
        if (item.itemId === itemIdFilterValue) {
          return true;
        }
      }
      const doesExist = templateItemData.find(findMatch);
      if (doesExist) {
        function filterById(item: TemplateItemDataResponse) {
          if (item.itemId === itemIdFilterValue) {
            return true;
          }
        }
        setTemplateItemData(templateItemData.filter(filterById));
      }
    }
  }, [itemIdFilterValue]);

  useEffect(() => {
    if (!titleFilterValue) {
      if (refresh) {
        setRefresh(false);
      } else {
        setRefresh(true);
      }
    } else {
      function findMatch(item: TemplateItemDataResponse) {
        if (item.itemTitle === titleFilterValue) {
          return true;
        }
      }
      const doesExist = templateItemData.find(findMatch);
      if (doesExist) {
        function filterById(item: TemplateItemDataResponse) {
          if (item.itemTitle === titleFilterValue) {
            return true;
          }
        }
        setTemplateItemData(templateItemData.filter(filterById));
      }
    }
  }, [titleFilterValue]);

  useEffect(() => {
    async function getTemplateItems() {
      const sessionToken = await SecureStore.getItemAsync('sessionToken');
      const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
      const keyObject = JSON.stringify({
        keyA: sessionToken,
        keyB: sessionSecret,
      });
      console.log(keyObject);

      const response = await fetch(`${apiUrl}/getTemplateItems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: keyObject,
        },
        body: JSON.stringify({
          getAmount: 'all',
        }),
      });
      const data: TemplateItemDataResponseBody = await response.json();

      if ('errors' in data) {
        setErrors(data.errors);
        console.log(errors);
        return;
      }
      setTemplateItemData(data.templateItems);
    }
    getTemplateItems().catch((error) => console.error(error));

    if (itemIdFilterValue) {
      function filterById(item: TemplateItemDataResponse) {
        if (item.itemId === itemIdFilterValue) {
          return true;
        }
      }
      setTemplateItemData(templateItemData.filter(filterById));
    }
    if (titleFilterValue) {
      function filterById(item: TemplateItemDataResponse) {
        if (item.itemTitle === titleFilterValue) {
          return true;
        }
      }
      setTemplateItemData(templateItemData.filter(filterById));
    }
  }, [refresh]);

  function renderItem(item: { item: TemplateItemDataResponse }) {
    const template = item.item;
    const data = JSON.stringify({
      offerRowId: positionData.offerRowId ? positionData.offerRowId : 'new',
      offerDefinedId: positionData.offerDefinedId
        ? positionData.offerDefinedId
        : '',
      positionId: positionData.positionId,
      quantity: '1',
      quantityUnit: 'pc',
      positionIsOptional: false,
      itemId: template.itemId ? template.itemId : '-',
      itemTitle: template.itemTitle ? template.itemTitle : '',
      itemText: template.itemText ? template.itemText : '',
      itemSalesPrice: template.itemSalesPrice ? template.itemSalesPrice : '',
      itemCost: template.itemCost ? template.itemCost : '',
      itemIsModified: false,
    });
    return (
      <View style={styles.templateItemContainer}>
        <Pressable
          style={styles.templatePressableContainer}
          onPress={() =>
            router.push(`./${positionData.toOrigin}/?position=${data}`)
          }
        >
          <View>
            <Text style={styles.itemTitleText}>{template.itemTitle}</Text>
            <Text style={styles.itemInfoText}>{template.itemText}</Text>
            <Text
              style={styles.itemInfoText}
            >{`Sales Price: €${template.itemSalesPrice} / Item Cost: €${template.itemCost}`}</Text>
            <Text
              style={styles.itemIdText}
            >{`Item Id: ${template.itemId}`}</Text>
          </View>
        </Pressable>
        <View style={styles.deleteButtonContainer}>
          <Pressable style={styles.deleteButton}>
            <Text
              style={styles.deleteButtonX}
              onPress={() =>
                deleteTemplateItemAlert(template.id, template.itemTitle)
              }
            >
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
      <View style={styles.filterContainer}>
        <Text style={styles.lableText}>Filteroptions:</Text>
        <TextInput
          style={styles.textInputField}
          placeholder="Search for ID"
          onChangeText={setItemIdFilterValue}
          value={itemIdFilterValue}
        />
        <TextInput
          style={styles.textInputField}
          placeholder="Search for last Name"
          onChangeText={setTitleFilterValue}
          value={titleFilterValue}
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          style={styles.flatlist}
          data={templateItemData}
          extraData={templateItemData}
          renderItem={renderItem}
          keyExtractor={(item: TemplateItemDataResponse) => item.id.toString()}
        />
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
  filterContainer: {
    marginTop: 10,
    height: 140,
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
  templateItemContainer: {
    flex: 5,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.patternColorE,
    borderBottomWidth: 10,
    borderColor: '#FFF',
  },
  templatePressableContainer: {
    flex: 4,
    marginLeft: 15,
  },
  itemTitleText: {
    textAlign: 'left',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 17,
  },
  itemInfoText: {
    textAlign: 'left',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_400Regular',
    fontSize: 15,
  },
  itemIdText: {
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
});
