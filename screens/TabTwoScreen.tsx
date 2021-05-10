import * as React from 'react';
import { StyleSheet, Button, Alert, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function getAccessToken() {
  const accessToken = await AsyncStorage.getItem('@twooca_access_token')
  if (accessToken) {
    return accessToken
  } else {
    throw Error('You must sign in with TwooCa')
  }
}

interface HasBalance {
  balance: number
}

async function getVisaBalance() {
  const accessToken = await getAccessToken()
  const response = await fetch('http://localhost:3000/api/v1/mobile/visa_balances/balance', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (response.ok) {
    return await response.json() as HasBalance
  } else {
    throw Error(await response.text())
  }
}

async function transferVisaBalance(externalUid: string, amount: number) {
  const accessToken = await getAccessToken()
  const response = await fetch('http://localhost:3000/api/v1/mobile/visa_balances/transfer', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      external_uid: externalUid,
      amount
    })
  })

  if (response.ok) {
    return await response.json() as HasBalance
  } else {
    throw Error(await response.text())
  }
}

export default function TabTwoScreen() {
  const [balance, setBalance] = React.useState<number | null>(null)
  const [externalUid, setExternalUid] = React.useState<string>('')
  const [amount, setAmount] = React.useState<number | null>(null)

  return (
    <View style={styles.container}>
      <Button
        title="Get VISA balance"
        onPress={async () => {
          try {
            const { balance } = await getVisaBalance()
            setBalance(balance)
          } catch (e) {
            Alert.alert(e.message)
            setBalance(null)
          }
        }}
      />
      {balance && <Text>balance: {balance}</Text>}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <TextInput
        style={styles.input}
        placeholder="external uid"
        value={externalUid}
        onChangeText={setExternalUid}
      />
      <TextInput
        style={styles.input}
        placeholder="amount"
        keyboardType="number-pad"
        value={amount ? amount.toString() : ''}
        onChangeText={(text) => {
          const amount = parseInt(text)
          if (amount !== NaN) {
            setAmount(amount)
          } else {
            setAmount(null)
          }
        }}
      />
      <Button
        title="Transfer VISA balance"
        onPress={async() => {
          if (externalUid && amount) {
            try {
              const { balance } = await transferVisaBalance(externalUid, amount)
              setBalance(balance)
              setAmount(null)
            } catch (e) {
              Alert.alert(e.message)
            }
          } else {
            Alert.alert('You must input external uid and amount')
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    borderColor: 'lightgray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    width: '80%',
  }
});
