import React from 'react';
import auth from '@react-native-firebase/auth';
import Google from '../../assets/google.svg'
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Text, Pressable, StyleSheet } from 'react-native';

GoogleSignin.configure({
  webClientId: '439712533808-umu271ki2qpp9mtur4l0em1jk9laganc.apps.googleusercontent.com',
});

async function onAppleButtonPress() {
  // Start the sign-in request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  // Ensure Apple returned a user identityToken
  if (!appleAuthRequestResponse.identityToken) {
    throw new Error('Apple Sign-In failed - no identify token returned');
  }

  // Create a Firebase credential from the response
  const { identityToken, nonce } = appleAuthRequestResponse;
  const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

  // Sign the user in with the credential
  return auth().signInWithCredential(appleCredential);
}

async function onGoogleButtonPress() {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}

const SocialAuthSignIn = () => {
  return (
    <React.Fragment>
      <AppleButton
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.SIGN_IN}
        style={styles.appleContainer}
        onPress={() => onAppleButtonPress().then(() => console.log('Apple sign-in complete!'))}
      />
      <Pressable
        style={styles.googleContainer}
        onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}>
        <Google
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}> Sign in with Google</Text>
      </Pressable>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  appleContainer: {
    width: '80%',
    height: 45,
    margin: 10,
    marginTop: 100,
  },
  googleIcon: {
    width: 13,
    height: 13,
    padding: 5,
    marginRight: 5,
  },
  googleContainer: {
    padding: 10,
    width: '80%',
    borderRadius: 4,
    backgroundColor: '#2d5ae0',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
  }
})

export { SocialAuthSignIn };