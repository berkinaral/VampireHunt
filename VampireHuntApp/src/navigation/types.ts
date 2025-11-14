import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  CreateRoom: undefined;
  JoinRoom: undefined;
  GameLobby: {roomCode: string};
  GamePlay: {roomCode: string};
  GameResult: {roomCode: string};
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

export type CreateRoomScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CreateRoom'
>;

export type JoinRoomScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'JoinRoom'
>;

export type GameLobbyScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'GameLobby'
>;

export type GamePlayScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'GamePlay'
>;

export type GameResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'GameResult'
>;
