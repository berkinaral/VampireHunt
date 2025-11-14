import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {JoinRoomScreenProps} from '../navigation/types';
import SocketService from '../services/SocketService';

export const JoinRoomScreen: React.FC<JoinRoomScreenProps> = ({navigation}) => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set up socket event handlers
    SocketService.setEventHandlers({
      onRoomJoined: (data) => {
        setIsLoading(false);
        navigation.navigate('GameLobby', {roomCode: roomCode.toUpperCase()});
      },
      onError: (data) => {
        setIsLoading(false);
        Alert.alert('Error', data.message);
      },
    });

    // Connect to server if not connected
    if (!SocketService.isConnected()) {
      SocketService.connect().catch(err => {
        console.error('Failed to connect:', err);
        Alert.alert('Connection Error', 'Failed to connect to server');
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, [navigation, roomCode]);

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      Alert.alert('Error', 'Please enter a room code');
      return;
    }
    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!SocketService.isConnected()) {
        await SocketService.connect();
      }
      SocketService.joinRoom(roomCode.toUpperCase(), playerName);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Join Room</Text>
          <Text style={styles.subtitle}>Enter the room code to join your friends</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Room Code"
              placeholderTextColor="#666"
              value={roomCode}
              onChangeText={setRoomCode}
              autoCapitalize="characters"
              maxLength={6}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="#666"
              value={playerName}
              onChangeText={setPlayerName}
              maxLength={20}
            />
          </View>

          <TouchableOpacity
            style={[styles.joinButton, (!roomCode || !playerName || isLoading) && styles.joinButtonDisabled]}
            onPress={handleJoinRoom}
            disabled={!roomCode || !playerName || isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.joinButtonText}>Join Game</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
  },
  backButton: {
    padding: 20,
  },
  backButtonText: {
    color: '#ff4444',
    fontSize: 18,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#2a2a3e',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 15,
  },
  joinButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#ff4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  joinButtonDisabled: {
    backgroundColor: '#666',
    shadowOpacity: 0,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
