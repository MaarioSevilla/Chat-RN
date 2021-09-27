import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ChatScreenFS from './src/screens/ChatScreenFS';
import ChatScreenRT from './src/screens/ChatScreenRT';
import ChatOneToOneRT from './src/screens/ChatOneToOneRT';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Chat" component={ChatOneToOneRT} />
        <Stack.Screen name="ChatFS" component={ChatScreenFS} />
        <Stack.Screen name="ChatRT" component={ChatScreenRT} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
