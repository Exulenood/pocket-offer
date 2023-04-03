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
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { apiUrl, colors } from '../../../globals/globalDataAndDefinitions';

type ApplyResponse =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      isAdded: boolean;
      offerDefinedId: string;
    };

type SaveTemplateResponse =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      isAdded: boolean;
      newTemplateItemRow: string;
    };

export default function AddItem() {
  const { position } = useSearchParams();
  const router = useRouter();
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const [offerDefinedId, setOfferDefinedId] = useState<string>('');
  const [positionNumber, setPositionNumber] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [quantityUnit, setQuantityUnit] = useState<string>('pc');
  const [isOptional, setIsOptional] = useState<boolean>(false);
  const [itemId, setItemId] = useState<string>('');
  const [itemTitle, setItemTitle] = useState<string>('');
  const [itemText, setItemText] = useState<string>('');
  const [itemCost, setItemCost] = useState<string>('0');
  const [itemSalesPrice, setItemSalesPrice] = useState<string>('0');
  const [itemSalesDiscount, setItemSalesDiscount] = useState<string>('0');

  useEffect(() => {
    if (position) {
      const data = JSON.parse(position);

      if (data.offerRowId === 'new') {
        setOfferDefinedId(data.offerDefinedId);
        setPositionNumber(data.positionId);
        setItemId(data.itemId);
        setItemTitle(data.itemTitle);
        setItemText(data.itemText);
        setItemSalesPrice(data.itemSalesPrice);
        setItemCost(data.itemCost);
      } else {
        const maxPosId = parseInt(data.maxPositionId) + 10;
        setPositionNumber(maxPosId.toString());

        setOfferDefinedId(data.offerDefinedId);
      }
    }
  }, [position]);

  async function addPosition() {
    const sessionToken = await SecureStore.getItemAsync('sessionToken');
    const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
    const keyObject = JSON.stringify({
      keyA: sessionToken,
      keyB: sessionSecret,
    });
    console.log(keyObject);
    const response = await fetch(`${apiUrl}/addPosition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: keyObject,
      },
      body: JSON.stringify({
        offerDefinedId: offerDefinedId,
        positionId: positionNumber,
        quantity: parseInt(quantity),
        quantityUnit: quantityUnit,
        positionIsOptional: isOptional,
        itemId: itemId,
        itemTitle: itemTitle,
        itemText: itemText,
        itemSalesPrice: parseFloat(itemSalesPrice),
        itemSalesDiscount: parseFloat(itemSalesDiscount),
        itemCost: parseInt(itemCost),
        itemIsModified: false,
      }),
    });
    const data: ApplyResponse = await response.json();

    if ('errors' in data) {
      setErrors(data.errors);
      console.log(errors);
      return;
    }
    if (data.isAdded) {
      router.replace(`./mainOffer?offerDefinedId=${offerDefinedId}`);
    } else {
      console.log('Failed to update position');
    }
  }

  async function saveTemplateItem() {
    const sessionToken = await SecureStore.getItemAsync('sessionToken');
    const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
    const keyObject = JSON.stringify({
      keyA: sessionToken,
      keyB: sessionSecret,
    });
    console.log(keyObject);
    const response = await fetch(`${apiUrl}/addTemplateItem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: keyObject,
      },
      body: JSON.stringify({
        itemId: itemId ? itemId : '',
        itemTitle: itemTitle ? itemTitle : '',
        itemText: itemText ? itemText : '',
        itemSalesPrice: itemSalesPrice ? parseFloat(itemSalesPrice) : 0,
        itemCost: itemCost ? parseFloat(itemCost) : 0,
      }),
    });
    const data: SaveTemplateResponse = await response.json();

    if ('errors' in data) {
      setErrors(data.errors);
      return;
    }
    if (!data.isAdded) {
      console.log('Failed to add Template');
    } else {
      Alert.alert('Success', `Item has been added to your templates list`, [
        { text: 'OK', onPress: () => null },
      ]);
    }
  }

  function passToLoadTemplate() {
    const data = JSON.stringify({
      toOrigin: 'addItem',
      offerRowId: '',
      offerDefinedId: offerDefinedId,
      positionId: positionNumber,
    });
    console.log(data);
    router.push({
      pathname: './selectTemplateItem',
      params: {
        originData: data,
      },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.positionAndQuantityContainer}>
        <View style={styles.posNumberContainer}>
          <Text style={styles.posNumberLabel}>Position No.:</Text>
          <TextInput
            style={styles.posNumberInput}
            onChangeText={setPositionNumber}
            value={positionNumber}
            keyboardType="numeric"
          />
        </View>
      </View>

      <ScrollView style={styles.inputsScrollview}>
        <View style={styles.textInfoContainer}>
          <Text style={styles.inputLabelText}>Item Id:</Text>
          <TextInput
            placeholder="-"
            style={styles.normalTextInput}
            onChangeText={setItemId}
            value={itemId}
          />
          <Text style={styles.inputLabelText}>Item Designation:</Text>
          <TextInput
            style={styles.normalTextInput}
            onChangeText={setItemTitle}
            value={itemTitle}
          />
          <Text style={styles.inputLabelText}>Item Text:</Text>
          <View style={styles.multilineTextInputContainer}>
            <TextInput
              style={styles.multilineTextInput}
              multiline
              numberOfLines={4}
              onChangeText={setItemText}
              value={itemText}
            />
          </View>
        </View>
        <View style={styles.inputRowContainer}>
          <View style={styles.narrowInputContainer}>
            <Text style={styles.narrowInputLabels}>Item Cost €</Text>
            <TextInput
              style={styles.narrowInput}
              placeholder="0"
              onChangeText={setItemCost}
              value={itemCost}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.narrowInputContainer}>
            <Text style={styles.narrowInputLabels}>Sales Price €</Text>
            <TextInput
              style={styles.narrowInput}
              placeholder="0"
              onChangeText={setItemSalesPrice}
              value={itemSalesPrice}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.narrowInputContainer}>
            <Text style={styles.narrowInputLabels}>Discount %</Text>
            <TextInput
              style={styles.narrowInput}
              placeholder="0"
              onChangeText={setItemSalesDiscount}
              value={itemSalesDiscount}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.inputRowContainer}>
          <View style={styles.narrowInputContainer}>
            <Text style={styles.narrowInputLabels}>Quanity:</Text>
            <TextInput
              style={styles.narrowInput}
              placeholder="1"
              onChangeText={setQuantity}
              value={quantity}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.narrowInputContainer}>
            <Text style={styles.narrowInputLabels}>Unit:</Text>
            <TextInput
              style={styles.narrowInput}
              placeholder="pc"
              onChangeText={setQuantityUnit}
              value={quantityUnit}
            />
          </View>
          <View style={styles.optionalContainer}>
            <Text style={styles.narrowInputLabels}>optional Position</Text>
            <BouncyCheckbox
              disableText={true}
              size={35}
              fillColor={colors.patternColorA}
              unfillColor="#FFFFFF"
              isChecked={false}
              iconStyle={{ borderColor: colors.patternColorA }}
              innerIconStyle={{ borderWidth: 2 }}
              textStyle={{ fontFamily: 'FredokaOne_400Regular' }}
              onPress={(value: boolean) => {
                setIsOptional(value);
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.templateButtonContainer}>
        <Pressable
          style={styles.templateButton}
          onPress={() => passToLoadTemplate()}
        >
          <Text style={styles.templateButtonText}>Load Template</Text>
        </Pressable>
        <Pressable
          style={styles.templateButton}
          onPress={() => saveTemplateItem()}
        >
          <Text style={styles.templateButtonText}>Save Template</Text>
        </Pressable>
      </View>
      <View style={styles.applyButtonConainer}>
        <Pressable style={styles.applyButton} onPress={() => addPosition()}>
          <Text style={styles.applyButtonText}>Add Position</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 7,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  positionAndQuantityContainer: {
    height: 50,
    flexDirection: 'column',
    width: '80%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  posNumberContainer: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 10,
  },
  posNumberLabel: {
    paddingLeft: 5,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 25,
    color: colors.patternColorD,
  },
  posNumberInput: {
    height: 42,
    width: 50,
    backgroundColor: colors.patternColorB,
    fontFamily: 'NotoSans_800ExtraBold',
    fontSize: 22,
    color: colors.patternColorD,
    textAlign: 'center',
  },

  inputRowContainer: {
    height: 90,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 10,
  },
  narrowInputContainer: {
    flex: 1,
    height: 65,
    flexDirection: 'column',
    alignItems: 'center',
  },
  narrowInputLabels: {
    includeFontPadding: false,
    paddingBottom: 1,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 15,
    textAlign: 'center',
    color: colors.patternColorD,
  },
  narrowInput: {
    includeFontPadding: false,
    height: 42,
    width: '100%',
    backgroundColor: colors.patternColorB,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 20,
    color: colors.patternColorD,
    textAlign: 'center',
  },
  optionalContainer: {
    flex: 1,
    height: 75,
    flexDirection: 'column',
    alignItems: 'center',
  },

  inputsScrollview: {
    flex: 3,
    width: '80%',
  },
  textInfoContainer: {
    height: 250,
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputLabelText: {
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 15,
    color: colors.patternColorD,
    marginLeft: 5,
  },
  normalTextInput: {
    height: 40,
    width: '100%',
    backgroundColor: colors.patternColorB,
    paddingLeft: 5,
    textAlign: 'center',
  },
  multilineTextInputContainer: {
    height: 80,
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.patternColorB,
  },
  multilineTextInput: {
    height: 80,
    width: '60%',
    backgroundColor: colors.patternColorB,
    textAlign: 'left',
  },
  costAndPriceConainer: {
    height: 85,
    marginTop: 5,
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateButtonContainer: {
    height: 70,
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    columnGap: 10,
  },

  templateButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.patternColorA,
  },
  templateButtonText: {
    textAlignVertical: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 18,
  },
  applyButtonConainer: {
    height: 100,
    flexDirection: 'column',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButton: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.patternColorA,
  },
  applyButtonText: {
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 20,
  },
});
