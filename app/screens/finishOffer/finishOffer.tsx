/* eslint-disable no-restricted-syntax */
import { printToFileAsync } from 'expo-print';
import { Link, useNavigation, useRouter, useSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { shareAsync } from 'expo-sharing';
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

type GetDocCreationData =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      client: {
        clientDefinedId: number;
        clientFirstName: string;
        clientLastName: string;
        clientAddrStreet: string;
        clientAddrHouseNo: string;
        clientAddrL2: string;
        clientAddrPostCode: string;
        clientAddrLocality: string;
      };
      user: {
        userCompanyNameL1: string;
        userCompanyNameL2: string;
        userFirstName: string;
        userLastName: string;
        userAddrStreet: string;
        userAddrHouseNo: string;
        userAddrL2: string;
        userPostCode: string;
        userLocation: string;
        userEmail: string;
        userPhone: string;
      };
      offerPositions: {
        id: string;
        clientId: number;
        offerDefinedId: string;
        offerTitle: string;
        positionId: string;
        quantity: number;
        quantityUnit: string;
        positionIsOptional: boolean;
        itemId: string;
        itemTitle: string;
        itemText: string;
        itemSalesPrice: string;
        itemSalesDiscount: string;
        itemCost: string;
        itemIsModified: boolean;
        positionTotal: number;
        effItemSalesPrice: number;
      }[];
      terms: {
        termTitle: string;
        termUpper: string;
        termLower: string;
        leadTime: string;
      };
      creationDate: string;
    };

type EditTermsResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      isEdited: boolean;
    };

type OfferData = {
  client: {
    clientDefinedId: number;
    clientFirstName: string;
    clientLastName: string;
    clientAddrStreet: string;
    clientAddrHouseNo: string;
    clientAddrL2: string;
    clientAddrPostCode: string;
    clientAddrLocality: string;
  };
  user: {
    userCompanyNameL1: string;
    userCompanyNameL2: string;
    userFirstName: string;
    userLastName: string;
    userAddrStreet: string;
    userAddrHouseNo: string;
    userAddrL2: string;
    userPostCode: string;
    userLocation: string;
    userEmail: string;
    userPhone: string;
  };
  offerPositions: {
    id: string;
    clientId: number;
    offerDefinedId: string;
    offerTitle: string;
    positionId: string;
    quantity: number;
    quantityUnit: string;
    positionIsOptional: boolean;
    itemId: string;
    itemTitle: string;
    itemText: string;
    itemSalesPrice: string;
    itemSalesDiscount: string;
    itemCost: string;
    itemIsModified: boolean;
    positionTotal: number;
    effItemSalesPrice: number;
  }[];
  terms: {
    termTitle: string;
    termUpper: string;
    termLower: string;
    leadTime: string;
  };
  creationDate: string;
};

export default function NewOffer() {
  const { offer } = useSearchParams();
  const router = useRouter();
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const [offerData, setOfferData] = useState<OfferData>({
    client: {
      clientDefinedId: 0,
      clientFirstName: '',
      clientLastName: '',
      clientAddrStreet: '',
      clientAddrHouseNo: '',
      clientAddrL2: '',
      clientAddrPostCode: '',
      clientAddrLocality: '',
    },
    user: {
      userCompanyNameL1: '',
      userCompanyNameL2: '',
      userFirstName: '',
      userLastName: '',
      userAddrStreet: '',
      userAddrHouseNo: '',
      userAddrL2: '',
      userPostCode: '',
      userLocation: '',
      userEmail: '',
      userPhone: '',
    },
    offerPositions: [
      {
        id: '',
        clientId: 0,
        offerDefinedId: '',
        offerTitle: '',
        positionId: '',
        quantity: 0,
        quantityUnit: '',
        positionIsOptional: false,
        itemId: '',
        itemTitle: '',
        itemText: '',
        itemSalesPrice: '',
        itemSalesDiscount: '',
        itemCost: '',
        itemIsModified: false,
        positionTotal: 0,
        effItemSalesPrice: 0,
      },
    ],
    terms: {
      termTitle: '',
      termUpper: '',
      termLower: '',
      leadTime: '',
    },
    creationDate: '',
  });
  const [termTitle, setTermTitle] = useState<string>('');
  const [termUpper, setTermUpper] = useState<string>('');
  const [termLower, setTermLower] = useState<string>('');
  const [leadTime, setLeadTime] = useState<string>('');
  const [offerDefinedId, setOfferDefinedId] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalPriceInclVAT, setTotalPriceInclVAT] = useState<number>(0);
  const [vATValue, setVATValue] = useState<number>(0);

  // const [offerTitle, setOfferTitle] = useState<string>('')

  useEffect(() => {
    if (offer) {
      async function getOfferData() {
        const sessionToken = await SecureStore.getItemAsync('sessionToken');
        const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
        const keyObject = JSON.stringify({
          keyA: sessionToken,
          keyB: sessionSecret,
        });
        console.log(keyObject);

        const response = await fetch(`${apiUrl}/getDocCreationData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: keyObject,
          },
          body: JSON.stringify({
            offerDefinedId: offer,
            termsId: 'default',
          }),
        });
        const data: GetDocCreationData = await response.json();

        if ('errors' in data) {
          setErrors(data.errors);
          console.log(errors);
          return;
        }

        const wholeData = data;
        let totalPriceAdd = 0;

        function setPrices() {
          for (const position of wholeData.offerPositions) {
            position.positionTotal = 0;
            if (!position.positionIsOptional) {
              const effPricePpx100 =
                parseFloat(position.itemSalesPrice) *
                100 *
                (1 - parseFloat(position.itemSalesDiscount) / 100);
              const posPricex100 = effPricePpx100 * position.quantity;
              totalPriceAdd = totalPriceAdd + Math.round(posPricex100) / 100;
              position.positionTotal = Math.round(posPricex100) / 100;
              position.effItemSalesPrice = Math.round(effPricePpx100) / 100;
            }
          }
        }

        await setPrices();

        setOfferData(wholeData);
        setTotalPrice(totalPriceAdd);
        setTermTitle('default');
        setTermUpper(data.terms.termUpper);
        setTermLower(data.terms.termLower);
        setLeadTime(data.terms.leadTime);
      }
      getOfferData().catch((error) => console.error(error));

      setOfferDefinedId(offer);
    }
  }, [offer]);

  useEffect(() => {
    const totalPriceInclVATAddx100 = totalPrice * 100 * 1.2;
    const vatValueAddx100 = totalPriceInclVATAddx100 - totalPrice * 100;

    setTotalPriceInclVAT(Math.round(totalPriceInclVATAddx100) / 100);
    setVATValue(Math.round(vatValueAddx100) / 100);
  }, [totalPrice]);

  async function saveTermsAsDefault() {
    const sessionToken = await SecureStore.getItemAsync('sessionToken');
    const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
    const keyObject = JSON.stringify({
      keyA: sessionToken,
      keyB: sessionSecret,
    });
    console.log(`Object: ${keyObject}`);

    const response = await fetch(`${apiUrl}/editTerms`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: keyObject,
      },
      body: JSON.stringify({
        termTitle: termTitle,
        termUpper: termUpper,
        termLower: termLower,
        leadTime: leadTime,
      }),
    });

    const data: EditTermsResponseBody = await response.json();

    if ('errors' in data) {
      setErrors(data.errors);
      return;
    }
    if (!data.isEdited) {
      console.log('Failed to save default template');
    } else {
      Alert.alert('Success', `Terms have been saved as default`, [
        { text: 'OK', onPress: () => null },
      ]);
    }
  }

  function printOfferPositions() {
    return offerData.offerPositions.map(
      ({
        itemId,
        itemTitle,
        itemText,
        effItemSalesPrice,
        quantityUnit,
        quantity,
        positionTotal,
        positionIsOptional,
        positionId,
      }) => {
        return `
          <tr class ="positionInfo">
            <th rowspan="2">${positionId}</th>
            <td >${itemTitle} (${itemId})</td>
            <td>€ ${effItemSalesPrice.toFixed(2)}</td>
            <td rowspan="2">${quantity} ${quantityUnit}</td>
            <td rowspan="2">${
              positionIsOptional ? 'option' : '€ ' + positionTotal.toFixed(2)
            }</td>
          </tr>
          <tr class ="subPositionInfo">
            <td colspan="2">${itemText} </td>
          </tr>
        `;
      },
    );
  }

  const html = `
    <html>
    <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 12pt;
        line-height: 1;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        box-sizing: border-box;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        padding: 10px;
        border: 1px solid #000;
        text-align: left;
      }
      th {
        background-color: #ddd;
      }
      .total {
        text-align: right;
        font-family: Arial, sans-serif;
        font-size: 10pt;
      }
      .priceColumn {
        width: 85px;
      }
      .positionInfo{
        font-family: Arial, sans-serif;
        font-size: 10pt;
        border-top: 4px solid #000;
      }
      .terms{
        font-family: Arial, sans-serif;
        font-size: 10pt;
      }
      .subPositionInfo{
        font-family: Arial, sans-serif;
        font-size: 8pt;
      }
      .footer {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
      }
      .userContact{
        align-self: flex-end;
      }

    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <h1>Offer ${offerDefinedId}</h1>
        <p>${offerData.client.clientFirstName} ${
    offerData.client.clientLastName
  }<br>
        ${offerData.client.clientAddrStreet} ${
    offerData.client.clientAddrHouseNo
  } ${offerData.client.clientAddrL2}<br>
        ${offerData.client.clientAddrPostCode} ${
    offerData.client.clientAddrLocality
  }</p>
        <p>Date: ${new Date().toLocaleDateString('de-DE')}<br>
        Customer No: ${offerData.client.clientDefinedId}</p>
      <p class="terms">${termUpper}</p>
      </header>
      <main>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Item Designation</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th class="priceColumn">I. Price</th>
            </tr>
          </thead>
          <tbody>
            ${printOfferPositions()}
            <tr class="total">
              <td colspan="4">Net Total:</td>
              <td>€ ${totalPrice.toFixed(2)}</td>
            </tr>
            <tr class="total">
              <td colspan="4">Tax (20%):</td>
              <td>€ ${vATValue.toFixed(2)}</td>
            </tr>
            <tr class="total">
              <td colspan="4">Grand Total:</td>
              <td>€ ${totalPriceInclVAT.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </main>
      <p class="terms">${termLower}</p>
      <p class="terms">Delivery Time: ${leadTime}</p>
      <footer class="footer">
        <div>
        <p>${offerData.user.userCompanyNameL1}<br>
        ${offerData.user.userCompanyNameL2}<br>
        ${offerData.user.userFirstName} ${offerData.user.userLastName}<br>
        </div>
        <div class="userContact">
        ${offerData.user.userAddrStreet} ${offerData.user.userAddrL2}<br>
        ${offerData.user.userPostCode} ${offerData.user.userLocation}<br>
        Phone: ${offerData.user.userPhone}<br>
        E-Mail: ${offerData.user.userEmail}</p>
        </div>
      </footer>
    </html>
  `;

  async function generateDocument() {
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(file.uri);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <Text style={styles.headText}>Finish offer</Text>
      </View>
      <ScrollView style={styles.inputsScrollview}>
        <View style={styles.finishOfferInputContainer}>
          <View style={styles.doubleInputContainer}>
            <Text style={styles.lableText}>Header Terms:</Text>
            <View style={styles.multilineTextInputContainer}>
              <TextInput
                style={styles.multilineTextInput}
                placeholder="Terms to be printed above the offer items"
                onChangeText={setTermUpper}
                value={termUpper}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
          <View style={styles.doubleInputContainer}>
            <Text style={styles.lableText}>Bottom Terms:</Text>
            <View style={styles.multilineTextInputContainer}>
              <TextInput
                style={styles.multilineTextInput}
                placeholder="Terms to be printed below the offer items"
                onChangeText={setTermLower}
                value={termLower}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
          <View style={styles.singleInputContainer}>
            <Text style={styles.lableText}>Lead Time:</Text>
            <TextInput
              style={styles.textInputField}
              placeholder="Lead Time"
              onChangeText={setLeadTime}
              value={leadTime}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.saveButtonContainer}>
        <Pressable
          style={styles.saveButton}
          onPress={() => saveTermsAsDefault()}
        >
          <Text style={styles.saveButtonText}>save terms as default</Text>
        </Pressable>
      </View>
      <View style={styles.bottomMenuButtonContainer}>
        <Pressable
          style={styles.bottomMenuNegButton}
          onPress={() =>
            router.replace(
              `../../loginAndAuth/authorization?offer=${offerDefinedId}`,
            )
          }
        >
          <Text style={styles.bottomMenuButtonText}>Back</Text>
        </Pressable>

        <Pressable
          style={styles.bottomMenuPosButton}
          onPress={() => generateDocument()}
        >
          <Text style={styles.bottomMenuButtonText}>Create Document</Text>
        </Pressable>
      </View>
    </View>
  );
}

// style={styles.multilineTextInputContainer}

const styles = StyleSheet.create({
  container: {
    flex: 7,
    flexdirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headContainer: {
    height: 60,
    justifyContent: 'center',
    marginTop: 40,
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

  finishOfferInputContainer: {
    width: '100%',
    alignItems: 'center',
    rowGap: 10,
    marginTop: 15,
  },
  doubleInputContainer: {
    width: '100%',
    alignItems: 'center',
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
    width: '100%',
    backgroundColor: colors.patternColorB,
    textAlign: 'center',
  },
  multilineTextInputContainer: {
    height: 130,
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.patternColorB,
  },
  multilineTextInput: {
    height: 130,
    width: '80%',
    backgroundColor: colors.patternColorB,
    textAlign: 'left',
  },
  saveButtonContainer: {
    height: 60,
    marginTop: 15,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.patternColorA,
  },
  saveButtonText: {
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
