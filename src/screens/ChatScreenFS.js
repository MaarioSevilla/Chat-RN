import React, {useEffect, useLayoutEffect, useState, useCallback} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { GiftedChat } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore';

//chat with firestore
export default function ChatScreenFS({navigation}) {

  useLayoutEffect(()=>{
    navigation.setOptions({
      headerLeft: () =>(
        <View>
          <Avatar 
            rounded
            source={{
              uri: auth()?.currentUser?.photoURL
            }}
          />
        </View>
      ),
      headerRight:()=>(
        <TouchableOpacity onPress={signOut}>
          <Text>Clo</Text>
        </TouchableOpacity>     
      )
    })
  },[]);

  const signOut = () => {
    auth().signOut().then(() => {
      // Sign-out successful.
      navigation.replace('Login');
    }).catch((error) => {
      // An error happened.
    });
  }

  const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //   ])
  // }, [])
  useLayoutEffect(() => {
    const unsubscribe = firestore().collection('chats').orderBy('createdAt', 'desc').onSnapshot(
      snapshot=>{
        setMessages(
          snapshot.docs.map(doc=>({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          }))
        )
      }
    )
    return unsubscribe;
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

    const {
      _id,
      createdAt,
      text,
      user
    }=messages[0];

    firestore().collection('chats').add({
      _id,
      createdAt,
      text,
      user
    });
  }, [])
  
  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth()?.currentUser?.email,
        name: auth()?.currentUser?.displayName,
        avatar: auth()?.currentUser?.photoURL
      }}
    />
  );
}

const styles = StyleSheet.create({
  
});
