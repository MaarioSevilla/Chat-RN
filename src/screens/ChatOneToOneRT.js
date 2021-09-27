import React, {useEffect, useLayoutEffect, useState, useCallback} from 'react';
import {View, StyleSheet, Text, TouchableOpacity,TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import {GiftedChat, Bubble, InputToolbar, ChatInput, SendButton, Send, Composer} from 'react-native-gifted-chat'
import database from '@react-native-firebase/database';

//chat with realtime database
export default function ChatOneToOneRT({navigation}) {

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
      navigation.replace('Login');
    }).catch((error) => {
    });
  }

  //to identify unique chat, lo terminare en otro proyecto

  // let r = `chats/`;
  // if (user.uid < receptor.uid) {
  //   r += user.uid + '-' + receptor.uid;
  // } else {
  //   r += receptor.uid + '-' + user.uid;
  // }

  let r = `chat1/`;
  let [messages, setMessages] = useState([]);
  if(messages){
    messages = messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  

  useLayoutEffect(() => {
    //const unsubscribe = 
    database()
    .ref(r)
    .limitToLast(20)
    .on("value", (snap) => {
      const data = [];
      snap.forEach((child) => {
        if(child.key){
          const newChild = {
            key: child.key,
            ...child.val()
          };
          data.push(newChild);
        }
      });
      setMessages(
        data.map(doc=>({
          _id: doc._id,
          createdAt: doc.createdAt,
          text: doc.text,
          user: doc.user,
          key: doc.key
        }))
      );
    })
    
    //return unsubscribe;
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

    let {
      _id,
      createdAt,
      text,
      user
    }=messages[0];
    
    createdAt = Date.parse(createdAt);
    const date= Date.now();

    database().ref(r).push({
      _id,
      createdAt,
      text,
      user,
      date
    });

  }, []);

  function renderBubble(props) {
    return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#F2F4F8'
            },
            right: {
              backgroundColor: '#008DC4'
            }
          }}
          textStyle={{
            right: {
              color: 'white',
              //fontSize: 13,
            },
            left: {
              color: '#1E2F67'
            }
          }}
        />
    );
  }

  function renderInputToolbar (props) {
    return <InputToolbar {...props} containerStyle={{borderTopWidth: 0, borderTopColor: '#333'}} />
  }

  function renderComposer (props){
    return <Composer {...props} textInputStyle={{ color: "white", backgroundColor: 'gray', borderRadius: 13, marginRight: 9}} />
  }

  function renderSend (props) {
      return (
        <Send {...props} containerStyle={{justifyContent: 'center', zIndex: 99, marginRight: 9}}>
          <View style={{backgroundColor: 'gray', height: 40, width: 40, borderRadius: 40/2, justifyContent: 'center', alignItems: 'center'}}>
            <Text>HOla</Text>
          </View>
        </Send>
      )
  }
  
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={{width: '100%', height: 30}}></View>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        onSend={messages => onSend(messages)}
        renderBubble={renderBubble}
        renderAvatar={null}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend} 
        renderComposer={renderComposer}
        user={{
          _id: auth()?.currentUser?.email,
          name: auth()?.currentUser?.displayName,
          avatar: auth()?.currentUser?.photoURL
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background:{
    backgroundColor: 'red'
  }
});
