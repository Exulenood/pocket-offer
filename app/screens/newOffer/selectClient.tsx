/* eslint-disable no-restricted-syntax */
import { Link, useNavigation, useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../_layout';

type ClientDataResponse = {
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  clientAddrStreet: string;
  clientAddrHouseNo: string;
  clientAddrL2: any;
  clientAddrPostCode: string;
  clientAddLocality: string;
};

type ItemProps = { client: ClientDataResponse };

const provData: ClientDataResponse[] = [
  {
    clientId: '2305863',
    clientFirstName: 'Leeroy',
    clientLastName: 'Jenkins',
    clientAddrStreet: 'Rookery',
    clientAddrHouseNo: '3',
    clientAddrL2: undefined,
    clientAddrPostCode: '2005',
    clientAddLocality: 'Upper Blackrockspire',
  },
  {
    clientId: '2301862',
    clientFirstName: 'John',
    clientLastName: 'Cena',
    clientAddrStreet: 'East Main Street',
    clientAddrHouseNo: '1241',
    clientAddrL2: undefined,
    clientAddrPostCode: 'CT 06902',
    clientAddLocality: 'Stamfort',
  },
  {
    clientId: '2309563',
    clientFirstName: 'Hideo',
    clientLastName: 'Kojima',
    clientAddrStreet: 'Highway Route',
    clientAddrHouseNo: '21',
    clientAddrL2: 'UCA',
    clientAddrPostCode: '41-057',
    clientAddLocality: 'Mountain Knot City',
  },
  {
    clientId: '2307573',
    clientFirstName: 'Billy',
    clientLastName: 'Butcher',
    clientAddrStreet: '5th Avenue',
    clientAddrHouseNo: '175',
    clientAddrL2: 'Flatiron Building',
    clientAddrPostCode: 'NY 10010',
    clientAddLocality: 'New York City',
  },
];

const ClientItem = ({ client }: ItemProps) => (
  <View style={styles.clientItemContainer}>
    <Link
      style={styles.clientLinkContainer}
      href={`./newOffer/?client={"id":"${client.clientId}","name":"${client.clientFirstName} ${client.clientLastName}","locality":"${client.clientAddrPostCode} ${client.clientAddLocality}"}`}
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
        >{`${client.clientAddrPostCode} ${client.clientAddLocality}`}</Text>
        <Text
          style={styles.clientLinkTextId}
        >{`Client Id: ${client.clientId}`}</Text>
      </View>
    </Link>
    <View style={styles.deleteButtonContainer}>
      <Pressable style={styles.deleteButton}>
        <Text style={styles.deleteButtonX}>X</Text>
      </Pressable>
    </View>
  </View>
);

const renderItem = (item: { item: ClientDataResponse }) => (
  <ClientItem client={item.item} />
);

export default function ClientListModal() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.lableText}>Filteroptions:</Text>
        <TextInput style={styles.textInputField} placeholder="Search for ID" />
        <TextInput
          style={styles.textInputField}
          placeholder="Search for last Name"
        />
      </View>
      <View style={styles.listcontainer}>
        <FlatList
          style={styles.flatlist}
          data={provData}
          renderItem={renderItem}
          keyExtractor={(item: ClientDataResponse) => item.clientId}
        />
      </View>
      <View style={styles.addButtonContainer}>
        <Link style={styles.addButton} href="./addClient">
          Add new client
        </Link>
      </View>
    </View>
  );
}

// style={styles.deleteButtonX}

const styles = StyleSheet.create({
  container: {
    flex: 8,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  filterContainer: {
    marginTop: 10,
    flex: 1.8,
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
  listcontainer: {
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
    flex: 1.2,
    width: '80%',
    height: 148,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.patternColorA,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'NotoSans_600SemiBold',
    fontSize: 20,
  },
});
