/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { apiUrl, colors } from '../../../globals/globalDataAndDefinitions';

export type ClientDataResponse = {
  id: string;
  clientDefinedId: number;
  clientFirstName: string;
  clientLastName: string;
  clientAddrStreet: string;
  clientAddrHouseNo: string;
  clientAddrL2: any;
  clientAddrPostCode: string;
  clientAddrLocality: string;
};

type ClientDataResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      clients: {
        id: string;
        clientDefinedId: number;
        clientFirstName: string;
        clientLastName: string;
        clientAddrStreet: string;
        clientAddrHouseNo: string;
        clientAddrL2: any;
        clientAddrPostCode: string;
        clientAddrLocality: string;
      }[];
      maxClientDefinedId: number;
    };

export default function ClientListModal() {
  const router = useRouter();
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const [maxClientDefinedId, setMaxClientDefinedId] = useState<number>(0);
  const [definedIdFilterValue, setDefinedIdFilterValue] = useState<string>('');
  const [lastNameFilterValue, setLastNameFilterValue] = useState<string>('');
  const [refresh, setRefresh] = useState<boolean>(false);
  const [clientData, setClientData] = useState<ClientDataResponse[]>([
    {
      id: '',
      clientDefinedId: 0,
      clientFirstName: 'Loading...',
      clientLastName: '',
      clientAddrStreet: '',
      clientAddrHouseNo: '',
      clientAddrL2: '',
      clientAddrPostCode: '',
      clientAddrLocality: '',
    },
  ]);

  async function deleteClient(clientId: string) {
    const sessionToken = await SecureStore.getItemAsync('sessionToken');
    const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
    const keyObject = JSON.stringify({
      keyA: sessionToken,
      keyB: sessionSecret,
    });
    console.log(keyObject);
    await fetch(`${apiUrl}/deleteClient`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: keyObject,
      },
      body: JSON.stringify({
        clientId: clientId,
      }),
    });
    function filterById(item: ClientDataResponse) {
      if (item.id !== clientId) {
        return true;
      }
    }
    setClientData(clientData.filter(filterById));
  }

  function deleteClientAlert(clientId: string, clientWholeName: string) {
    Alert.alert(
      'Deleting Client',
      `Are you sure you want to delete Client ${clientWholeName}? \n (This action cannot be undone)`,
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'OK', onPress: () => deleteClient(clientId) },
      ],
    );
  }

  function renderItem(item: { item: ClientDataResponse }) {
    const client = item.item;
    return (
      <View style={styles.clientItemContainer}>
        <Link
          style={styles.clientLinkContainer}
          href={`./newOffer/?client={"id":"${client.id}","definedId":"${client.clientDefinedId}","name":"${client.clientFirstName} ${client.clientLastName}","locality":"${client.clientAddrPostCode} ${client.clientAddrLocality}"}`}
        >
          <View>
            <Text
              style={styles.clientLinkTextName}
            >{`${client.clientFirstName} ${client.clientLastName}`}</Text>
            <Text
              style={styles.clientLinkTextAddress}
            >{`${client.clientAddrStreet} ${client.clientAddrHouseNo}`}</Text>
            <Text
              style={styles.clientLinkTextAddress}
            >{`${client.clientAddrPostCode} ${client.clientAddrLocality}`}</Text>
            <Text
              style={styles.clientLinkTextId}
            >{`Client Id: ${client.clientDefinedId}`}</Text>
          </View>
        </Link>
        <View style={styles.deleteButtonContainer}>
          <Pressable style={styles.deleteButton}>
            <Text
              style={styles.deleteButtonX}
              onPress={() =>
                deleteClientAlert(
                  client.id,
                  `${client.clientFirstName} ${client.clientLastName}`,
                )
              }
            >
              X
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  useEffect(() => {
    if (!definedIdFilterValue) {
      if (refresh) {
        setRefresh(false);
      } else {
        setRefresh(true);
      }
    } else {
      function findMatch(item: ClientDataResponse) {
        if (item.clientDefinedId === parseInt(definedIdFilterValue)) {
          return true;
        }
      }
      const doesExist = clientData.find(findMatch);
      if (doesExist) {
        function filterById(item: ClientDataResponse) {
          if (item.clientDefinedId === parseInt(definedIdFilterValue)) {
            return true;
          }
        }
        setClientData(clientData.filter(filterById));
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
      function findMatch(item: ClientDataResponse) {
        if (item.clientLastName === lastNameFilterValue) {
          return true;
        }
      }
      const doesExist = clientData.find(findMatch);
      if (doesExist) {
        function filterById(item: ClientDataResponse) {
          if (item.clientLastName === lastNameFilterValue) {
            return true;
          }
        }
        setClientData(clientData.filter(filterById));
      }
    }
  }, [lastNameFilterValue]);

  useEffect(() => {
    async function getClients() {
      const sessionToken = await SecureStore.getItemAsync('sessionToken');
      const sessionSecret = await SecureStore.getItemAsync('sessionSecret');
      const keyObject = JSON.stringify({
        keyA: sessionToken,
        keyB: sessionSecret,
      });
      console.log(keyObject);

      const response = await fetch(`${apiUrl}/getClients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: keyObject,
        },
        body: JSON.stringify({
          clientDefinedId: definedIdFilterValue,
          clientLastName: lastNameFilterValue,
        }),
      });
      const data: ClientDataResponseBody = await response.json();

      if ('errors' in data) {
        setErrors(data.errors);
        console.log(errors);
        return;
      }
      setClientData(data.clients);
      setMaxClientDefinedId(data.maxClientDefinedId);
    }
    getClients().catch((error) => console.error(error));

    if (definedIdFilterValue) {
      function filterById(item: ClientDataResponse) {
        if (item.id === definedIdFilterValue) {
          return true;
        }
      }
      setClientData(clientData.filter(filterById));
    }
    if (lastNameFilterValue) {
      function filterById(item: ClientDataResponse) {
        if (item.clientLastName === lastNameFilterValue) {
          return true;
        }
      }
      setClientData(clientData.filter(filterById));
    }
  }, [refresh]);

  function dismissModalAndRouteToAddClient() {
    router.replace({
      pathname: './addClient',
      params: {
        maxClientDefinedId: maxClientDefinedId,
      },
    });
  }

  return (
    <View style={styles.container}>
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
      </View>
      <View style={styles.listContainer}>
        <FlatList
          style={styles.flatlist}
          data={clientData}
          extraData={clientData}
          renderItem={renderItem}
          keyExtractor={(item: ClientDataResponse) => item.id}
        />
      </View>

      <View style={styles.addButtonContainer}>
        <Pressable
          style={styles.addButton}
          onPress={() => dismissModalAndRouteToAddClient()}
        >
          <Text style={styles.addButtonText}>Add new client</Text>
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
  clientLinkTextName: {
    textAlign: 'left',
    color: colors.patternColorD,
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 17,
  },
  clientLinkTextAddress: {
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
  addButtonContainer: {
    // flex: 1.2,
    width: '80%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
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
});
