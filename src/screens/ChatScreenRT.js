import React, {useEffect, useLayoutEffect, useState, useCallback} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import {GiftedChat, Bubble, InputToolbar, ChatInput, SendButton, Send} from 'react-native-gifted-chat'
import database from '@react-native-firebase/database';

//chat with realtime database
export default function ChatScreenRT({navigation}) {

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

  // const renderInputToolbar = (
  //  <InputToolbar containerStyle={{borderTopWidth: 1.5, borderTopColor: '#333'}} />
  // )

  async function deleteMessage (key) {
    try{
      await database().ref(`${r}${key}`).remove();
    }catch(e){console.log(e)}
  }

  function updateMessage(props, newText){
    database()
    .ref(`${r}${props.key}`)
    .update({
      _id: props._id,
      createdAt:props.createdAt,
      text:newText,
      user:props.user,
      date:props.date
    })
    .then(() => console.log('Data updated.'));
  }

  function renderBubble(props) {
    return (
      <View>
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#d3d3d3'
            },
          }}
          textStyle={{
            right: {
              color: 'red',
              fontSize: 13,
            }
          }}
        />
        <TouchableOpacity onPress={()=>{
          deleteMessage(props.currentMessage.key)
        }}>
          <Text>del</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{
          updateMessage(props.currentMessage, 'Hola update')
        }}>
          <Text>up</Text>
        </TouchableOpacity>
      </View>
      
    );
  }

  function renderInputToolbar (props) {
    //Add the extra styles via containerStyle
   return <InputToolbar {...props} containerStyle={{borderTopWidth: 1.5, borderTopColor: '#333', borderRadius: 18}} />
  }

  function renderSend (props) {
      return (
        <Send {...props}>
          <Text>HOla</Text>
        </Send>
      )
  }
  
  return (
    
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={messages => onSend(messages)}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend} 
        renderBubble={renderBubble}
        user={{
          _id: auth()?.currentUser?.email,
          name: auth()?.currentUser?.displayName,
          avatar: auth()?.currentUser?.photoURL
        }}
      />
      // <View style={{ backgroundColor: "#000000", flex: 1 }}></View>
  );
}

const styles = StyleSheet.create({
  background:{
    backgroundColor: 'red'
  }
});
