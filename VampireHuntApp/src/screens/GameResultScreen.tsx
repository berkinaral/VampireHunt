import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {GameResultScreenProps} from '../navigation/types';
import {Player, PlayerRole, PlayerStatus} from '../types';
import SocketService from '../services/SocketService';

export const GameResultScreen: React.FC<GameResultScreenProps> = ({navigation}) => {
  const [winner, setWinner] = useState<'VAMPIRES' | 'VILLAGERS'>('VILLAGERS');
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    // Set up socket event handlers for game over data
    SocketService.setEventHandlers({
      onGameOver: (data) => {
        setWinner(data.winner);
        // Convert players data with roles revealed
        const gamePlayers = data.players.map((p: any) => ({
          id: p.id,
          name: p.name,
          role: p.role,
          status: p.status,
          isHost: false, // Not needed for results
        }));
        setPlayers(gamePlayers);
      },
    });

    // The game over event should have already been received
    // If not, we might need to request the final state

    return () => {
      // Clean up when leaving results
      SocketService.leaveRoom();
    };
  }, []);

  const handlePlayAgain = () => {
    // TODO: Implement rematch logic
    navigation.navigate('Home');
  };

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const renderPlayer = ({item}: {item: Player}) => (
    <View style={styles.playerCard}>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={[
          styles.playerRole,
          item.role === PlayerRole.VAMPIRE && styles.vampireRole
        ]}>
          {item.role === PlayerRole.VAMPIRE ? '🦇 Vampire' : '👤 Villager'}
        </Text>
      </View>
      <Text style={[
        styles.playerStatus,
        item.status === PlayerStatus.ALIVE ? styles.aliveStatus : styles.eliminatedStatus
      ]}>
        {item.status === PlayerStatus.ALIVE ? 'SURVIVED' : 'ELIMINATED'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.resultContainer}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Text style={styles.winnerIcon}>
            {winner === 'VAMPIRES' ? '🦇' : '🏆'}
          </Text>
          <Text style={styles.winnerText}>
            {winner === 'VAMPIRES' ? 'VAMPIRES WIN!' : 'VILLAGERS WIN!'}
          </Text>
          <Text style={styles.winnerDescription}>
            {winner === 'VAMPIRES' 
              ? 'The vampires have taken over the village!'
              : 'All vampires have been eliminated!'}
          </Text>
        </View>

        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>Final Results</Text>
          <FlatList
            data={players}
            renderItem={renderPlayer}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.playersList}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={handlePlayAgain}>
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleBackToHome}>
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 20,
  },
  resultContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  gameOverText: {
    color: '#ffffff',
    fontSize: 20,
    opacity: 0.7,
    marginBottom: 10,
  },
  winnerIcon: {
    fontSize: 80,
    marginBottom: 15,
  },
  winnerText: {
    color: '#ff4444',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  winnerDescription: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
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
  playerCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  playerRole: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
  },
  vampireRole: {
    color: '#ff4444',
  },
  playerStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  aliveStatus: {
    backgroundColor: '#4CAF50',
    color: '#ffffff',
  },
  eliminatedStatus: {
    backgroundColor: '#666',
    color: '#ffffff',
  },
  buttonContainer: {
    marginTop: 20,
  },
  playAgainButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#ff4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  playAgainButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ff4444',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#ff4444',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
