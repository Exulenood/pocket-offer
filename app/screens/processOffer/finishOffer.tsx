import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function UserProfileAndSettings() {
  const [testText, setTesttext] = useState<string>('');
  const newTest = { newtest: testText };
  const newNewTest = JSON.stringify(newTest);

  return (
    <View style={styles.containerUc}>
      <TextInput
        editable
        multiline
        numberOfLines={4}
        maxLength={200}
        onChangeText={setTesttext}
        value={testText}
        style={{ padding: 10 }}
      />
      <Text>{testText}</Text>
      <Pressable style={styles.cont} onPress={() => console.log(testText)}>
        <Text>{newNewTest}</Text>
      </Pressable>
    </View>
  );
}

// style={styles.cont}

const styles = StyleSheet.create({
  containerUc: {
    flex: 1,
    backgroundColor: '#f3ef00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cont: {
    Width: 300,
    Height: 300,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
