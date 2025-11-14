import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Share,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {GameLobbyScreenProps} from '../navigation/types';
import {Player, PlayerStatus} from '../types';
import SocketService from '../services/SocketService';

export const GameLobbyScreen: React.FC<GameLobbyScreenProps> = ({navigation, route}) => {
  const {roomCode} = route.params;
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);

  useEffect(() => {
    // Get current player ID
    const playerId = SocketService.getPlayerId();
    setMyPlayerId(playerId);

    // Set up socket event handlers
    SocketService.setEventHandlers({
      onRoomUpdate: (data) => {
        const roomPlayers = data.room.players.map((p: any) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          isHost: p.isHost,
        }));
        setPlayers(roomPlayers);
        
        // Check if current player is host
        const currentPlayer = roomPlayers.find((p: Player) => p.id === playerId);
        if (currentPlayer) {
          setIsHost(currentPlayer.isHost);
        }
      },
      onGameStarted: (data) => {
        navigation.navigate('GamePlay', {roomCode});
      },
      onError: (data) => {
        Alert.alert('Error', data.message);
        setIsLoading(false);
      },
    });

    // If we just created the room, we should already have the data
    // If we joined, we should have received room_update
    // Request current room state just in case
    if (!SocketService.isConnected()) {
      SocketService.connect().catch(err => {
        console.error('Failed to connect:', err);
        Alert.alert('Connection Error', 'Lost connection to server');
        navigation.goBack();
      });
    }

    return () => {
      // Don't disconnect when leaving lobby, we need the connection for the game
    };
  }, [navigation, roomCode]);

  const handleShareCode = async () => {
    try {
      await Share.share({
        message: `Join my Vampire Hunt game! Room code: ${roomCode}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartGame = () => {
    if (players.length < 4) {
      Alert.alert('Not Enough Players', 'You need at least 4 players to start the game');
      return;
    }
    
    setIsLoading(true);
    SocketService.startGame();
  };

  const renderPlayer = ({item}: {item: Player}) => (
    <View style={styles.playerCard}>
      <View style={styles.playerAvatar}>
        <Text style={styles.playerAvatarText}>{item.name[0].toUpperCase()}</Text>
      </View>
      <Text style={styles.playerName}>{item.name}</Text>
      {item.isHost && <Text style={styles.hostBadge}>HOST</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Leave</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.roomCodeContainer}>
          <Text style={styles.roomCodeLabel}>Room Code</Text>
          <Text style={styles.roomCode}>{roomCode}</Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareCode}>
            <Text style={styles.shareButtonText}>Share Code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>Players ({players.length}/12)</Text>
          <FlatList
            data={players}
            renderItem={renderPlayer}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.playerRow}
            contentContainerStyle={styles.playersList}
          />
        </View>

        {isHost && (
          <TouchableOpacity
            style={[styles.startButton, (players.length < 4 || isLoading) && styles.startButtonDisabled]}
            onPress={handleStartGame}
            disabled={players.length < 4 || isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.startButtonText}>
                {players.length < 4 ? `Need ${4 - players.length} more players` : 'Start Game'}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {!isHost && (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingText}>Waiting for host to start the game...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#ff4444',
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  roomCodeContainer: {
    backgroundColor: '#2a2a3e',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
  },
  roomCodeLabel: {
    color: '#ffffff',
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 5,
  },
  roomCode: {
    color: '#ff4444',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 15,
  },
  shareButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  shareButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  playersSection: {
    flex: 1,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  playersList: {
    paddingBottom: 20,
  },
  playerRow: {
    justifyContent: 'space-between',
  },
  playerCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    flex: 0.48,
    marginBottom: 10,
  },
  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerAvatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  playerName: {
    color: '#ffffff',
    fontSize: 14,
  },
  hostBadge: {
    backgroundColor: '#ffaa00',
    color: '#1a1a2e',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 5,
  },
  startButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#ff4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  startButtonDisabled: {
    backgroundColor: '#666',
    shadowOpacity: 0,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  waitingContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  waitingText: {
    color: '#ffffff',
    opacity: 0.7,
    fontSize: 16,
  },
});
