import React, { useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  SafeAreaView, Text, StyleSheet
} from 'react-native';
import {
  NonAuthStack
} from './NonAuthStack';
import {
  AuthStack
} from './AuthStack';

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

  if (initializing){
    <SafeAreaView>
      <Text> Loading... </Text>
    </SafeAreaView>
  }

  return (
    <SafeAreaView style={styles.container}>
        {
          user ? <AuthStack/> : <NonAuthStack/>
        }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
    },
});