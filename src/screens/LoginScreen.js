import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Input, Button} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

export default function LoginScreen({navigation}) {
  //this is for verify if user
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        navigation.replace('Chat');
      } else {
        navigation.canGoBack() && navigation.popToTop();
        // User is signed out
        // ...
      }
    });
    return unsubscribe;
  }, []);
  //this is for login
  const [email, setEmail] = useState('');
  const [passwod, setPassword] = useState('');

  const singIn = () => {
    auth().signInWithEmailAndPassword(email, passwod)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter your email"
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <Input
        placeholder="Enter your password"
        label="Password"
        value={passwod}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <Button title="Sing In" style={styles.button} onPress={singIn} />
      <Button
        title="Register"
        style={styles.button}
        onPress={() => {
          navigation.navigate('Register');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
