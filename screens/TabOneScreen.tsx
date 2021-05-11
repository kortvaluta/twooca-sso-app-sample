import * as React from 'react';
import { StyleSheet, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import * as AppAuth from 'expo-app-auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants'

export default function TabOneScreen() {
  const [accessToken, setAccessToken] = React.useState<string | null>(null)

  React.useEffect(() => {
    (async () => {
      const accessToken = await AsyncStorage.getItem('@twooca_access_token')
      setAccessToken(accessToken)
    })()
  }, [])

  const authConfig = {
    issuer: '',
    serviceConfiguration: {
      authorizationEndpoint: `${Constants.manifest.extra!.twooca.baseUrl}/oauth/authorize`,
      tokenEndpoint: `${Constants.manifest.extra!.twooca.baseUrl}/oauth/token`
    },
    clientId: Constants.manifest.extra!.twooca.clientId,
    clientSecret: Constants.manifest.extra!.twooca.clientSecret,
    redirectUrl: Constants.manifest.extra!.twooca.oauthRedirectUrl
  }

  return (
    <View style={styles.container}>
      {!accessToken ? (
        <Button
          title="Sign In with TwooCa" 
          onPress={async () => {
            const { accessToken } = await AppAuth.authAsync(authConfig)
            await AsyncStorage.setItem('@twooca_access_token', accessToken!)
            setAccessToken(accessToken)
          }}
        />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>access token</Text>
          <Text>{accessToken}</Text>
          <Button
            title="Sign Out"
            onPress={async () => {
              await AsyncStorage.removeItem('@twooca_access_token')
              setAccessToken(null)
            }}
          />
        </View>
      )}
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
});
