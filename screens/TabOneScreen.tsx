import * as React from 'react';
import { StyleSheet, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import * as AppAuth from 'expo-app-auth'
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      authorizationEndpoint: 'http://localhost:3000/oauth/authorize',
      tokenEndpoint: 'http://localhost:3000/oauth/token'
    },
    clientId: 'yGY3Mwm3Vo86-viGkM_YTcQmFTj8P7FnckU_vMk4xfw',
    clientSecret: 'JXnr2WHkWmnpUrvthCw6ooyvwA-9_JKYz2sK2pB1qb4',
    redirectUrl: 'exp://127.0.0.1:19000/'
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
