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
import {CreateRoomScreenProps} from '../navigation/types';
import SocketService from '../services/SocketService';

export const CreateRoomScreen: React.FC<CreateRoomScreenProps> = ({navigation}) => {
  const [playerName, setPlayerName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('8');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set up socket event handlers
    SocketService.setEventHandlers({
      onRoomCreated: (data) => {
        setIsLoading(false);
        navigation.navigate('GameLobby', {roomCode: data.roomCode});
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
  }, [navigation]);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!SocketService.isConnected()) {
        await SocketService.connect();
      }
      SocketService.createRoom(playerName, parseInt(maxPlayers));
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
          <Text style={styles.title}>Create Room</Text>
          <Text style={styles.subtitle}>Set up a new game for your friends</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="#666"
              value={playerName}
              onChangeText={setPlayerName}
              maxLength={20}
            />
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Max Players</Text>
              <View style={styles.playerCountContainer}>
                {['4', '6', '8', '10', '12'].map(count => (
                  <TouchableOpacity
                    key={count}
                    style={[
                      styles.playerCountButton,
                      maxPlayers === count && styles.playerCountButtonActive
                    ]}
                    onPress={() => setMaxPlayers(count)}>
                    <Text style={[
                      styles.playerCountText,
                      maxPlayers === count && styles.playerCountTextActive
                    ]}>{count}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createButton, (!playerName || isLoading) && styles.createButtonDisabled]}
            onPress={handleCreateRoom}
            disabled={!playerName || isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.createButtonText}>Create Game</Text>
            )}
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              You'll receive a room code to share with your friends
            </Text>
          </View>
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
    marginBottom: 20,
  },
  settingRow: {
    marginBottom: 20,
  },
  settingLabel: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
    opacity: 0.8,
  },
  playerCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerCountButton: {
    backgroundColor: '#2a2a3e',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  playerCountButtonActive: {
    backgroundColor: '#ff4444',
  },
  playerCountText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerCountTextActive: {
    color: '#ffffff',
  },
  createButton: {
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
  createButtonDisabled: {
    backgroundColor: '#666',
    shadowOpacity: 0,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    color: '#ffffff',
    opacity: 0.5,
    fontSize: 14,
    textAlign: 'center',
  },
});
