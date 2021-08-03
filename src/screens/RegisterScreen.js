/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Input, Button} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [passwod, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const register = () => {
        auth().createUserWithEmailAndPassword(email, passwod)
        .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        user
          .updateProfile({
            displayName: name,
            photoURL: imageUrl
              ? imageUrl
              : 'https://e7.pngegg.com/pngimages/304/305/png-clipart-man-with-formal-suit-illustration-web-development-computer-icons-avatar-business-user-profile-child-face.png',
          })
          .then(() => {
            // Update successful
            // ...
          })
          // eslint-disable-next-line prettier/prettier
          .catch((error) => {
            // An error occurred
            // ...
          });
        navigation.popToTop();
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter your name"
        label="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <Input
        placeholder="Enter your image url"
        label="image url"
        value={imageUrl}
        onChangeText={text => setImageUrl(text)}
      />
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
      <Button title="Register" style={styles.button} onPress={register} />
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
