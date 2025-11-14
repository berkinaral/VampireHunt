import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {
  HomeScreen,
  CreateRoomScreen,
  JoinRoomScreen,
  GameLobbyScreen,
  GamePlayScreen,
  GameResultScreen,
} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateRoom" component={CreateRoomScreen} />
        <Stack.Screen name="JoinRoom" component={JoinRoomScreen} />
        <Stack.Screen name="GameLobby" component={GameLobbyScreen} />
        <Stack.Screen name="GamePlay" component={GamePlayScreen} />
        <Stack.Screen name="GameResult" component={GameResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
