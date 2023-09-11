import { Provider } from 'react-redux';
import { store } from './store';
import React, { useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  SafeAreaView, Text, StyleSheet, View
} from 'react-native';
import {
  NonAuthStack
} from './NonAuthStack';
import {
  AuthStack
} from './AuthStack';
import { BACKGROUND_COLOR, NAVBAR_COLOR } from './common/constants';

export default function App() {

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    <SafeAreaView>
      <Text> Loading... </Text>
    </SafeAreaView>
  }

  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
      </View>
      <SafeAreaView style={styles.safeAreaView}>
        <Provider store={store}>
          {
            user ? <AuthStack /> : <NonAuthStack />
          }
        </Provider>
      </SafeAreaView>
      <View style={styles.bottomArea}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topArea: {
    backgroundColor: BACKGROUND_COLOR,
    flex: 1,
    zIndex: 0,
  },
  safeAreaView: {
    position: "absolute",
    height: '100%',
    width: '100%',
    zIndex: 1,
  },
  bottomArea: {
    backgroundColor: NAVBAR_COLOR,
    flex: 1,
    zIndex: 0,
  },
});
