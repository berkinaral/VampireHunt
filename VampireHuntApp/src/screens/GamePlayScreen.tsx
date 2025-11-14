import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {GamePlayScreenProps} from '../navigation/types';
import {Player, PlayerRole, PlayerStatus, GamePhase} from '../types';
import SocketService from '../services/SocketService';

export const GamePlayScreen: React.FC<GamePlayScreenProps> = ({navigation, route}) => {
  const {roomCode} = route.params;
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.ROLE_REVEAL);
  const [myRole, setMyRole] = useState<PlayerRole | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [eliminatedPlayers, setEliminatedPlayers] = useState<Set<string>>(new Set());

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
      },
      onRoleAssigned: (data) => {
        setMyRole(data.role);
        setShowRoleModal(true);
        setGamePhase(GamePhase.ROLE_REVEAL);
      },
      onPhaseChange: (data) => {
        setGamePhase(data.phase);
        setSelectedPlayer(null); // Reset selection on phase change
        setIsVoting(false);
      },
      onTimerUpdate: (data) => {
        setTimer(data.timeLeft);
      },
      onPlayerEliminated: (data) => {
        setEliminatedPlayers(prev => new Set(prev).add(data.playerId));
        
        // Update player status
        setPlayers(prev => prev.map(p => 
          p.id === data.playerId 
            ? {...p, status: PlayerStatus.ELIMINATED, role: data.role}
            : p
        ));
        
        Alert.alert(
          'Player Eliminated',
          `${data.playerName} was eliminated! ${data.role ? `They were a ${data.role}` : ''}`,
          [{text: 'OK'}]
        );
      },
      onGameOver: (data) => {
        // Navigate to results screen with game data
        navigation.replace('GameResult', {roomCode});
      },
      onVoteCast: (data) => {
        // Just for feedback that vote was received
        if (data.voterId === playerId) {
          setIsVoting(false);
        }
      },
      onError: (data) => {
        Alert.alert('Error', data.message);
        setIsVoting(false);
      },
    });

    return () => {
      // Don't disconnect, we might go to results screen
    };
  }, [navigation, roomCode]);

  const handleVote = () => {
    if (!selectedPlayer) {
      Alert.alert('Select a Player', 'Please select a player to vote for');
      return;
    }
    
    setIsVoting(true);
    SocketService.castVote(selectedPlayer);
  };

  const renderPlayer = ({item}: {item: Player}) => {
    const isSelectable = 
      item.status === PlayerStatus.ALIVE && 
      item.id !== myPlayerId && // Can't vote for yourself
      (gamePhase === GamePhase.NIGHT_PHASE || gamePhase === GamePhase.DAY_VOTING);

    return (
      <TouchableOpacity
        style={[
          styles.playerCard,
          item.status === PlayerStatus.ELIMINATED && styles.playerCardEliminated,
          selectedPlayer === item.id && styles.playerCardSelected,
        ]}
        onPress={() => isSelectable && setSelectedPlayer(item.id)}
        disabled={!isSelectable}>
        <View style={[
          styles.playerAvatar,
          item.status === PlayerStatus.ELIMINATED && styles.playerAvatarEliminated,
        ]}>
          <Text style={styles.playerAvatarText}>{item.name[0].toUpperCase()}</Text>
        </View>
        <Text style={[
          styles.playerName,
          item.status === PlayerStatus.ELIMINATED && styles.playerNameEliminated,
        ]}>
          {item.name}
        </Text>
        {item.status === PlayerStatus.ELIMINATED && (
          <Text style={styles.eliminatedText}>ELIMINATED</Text>
        )}
      </TouchableOpacity>
    );
  };

  const getPhaseTitle = () => {
    switch (gamePhase) {
      case GamePhase.NIGHT_PHASE:
        return myRole === PlayerRole.VAMPIRE ? '🌙 Night - Choose Your Victim' : '🌙 Night - Sleep Tight';
      case GamePhase.DAY_DISCUSSION:
        return '☀️ Day - Discussion Time';
      case GamePhase.DAY_VOTING:
        return '☀️ Day - Vote Out the Vampire';
      default:
        return 'Game in Progress';
    }
  };

  const getPhaseDescription = () => {
    switch (gamePhase) {
      case GamePhase.NIGHT_PHASE:
        return myRole === PlayerRole.VAMPIRE 
          ? 'Select a villager to eliminate'
          : 'The vampires are hunting...';
      case GamePhase.DAY_DISCUSSION:
        return 'Discuss who you think the vampire is';
      case GamePhase.DAY_VOTING:
        return 'Vote to eliminate a suspected vampire';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Role Reveal Modal */}
      <Modal
        visible={showRoleModal && gamePhase === GamePhase.ROLE_REVEAL}
        transparent
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.roleModal}>
            <Text style={styles.roleModalTitle}>Your Secret Role</Text>
            <Text style={styles.roleIcon}>
              {myRole === PlayerRole.VAMPIRE ? '🦇' : '👤'}
            </Text>
            <Text style={styles.roleName}>
              {myRole === PlayerRole.VAMPIRE ? 'VAMPIRE' : 'VILLAGER'}
            </Text>
            <Text style={styles.roleDescription}>
              {myRole === PlayerRole.VAMPIRE 
                ? 'Eliminate villagers at night without being caught'
                : 'Find and eliminate all vampires to win'}
            </Text>
            <TouchableOpacity
              style={styles.roleModalButton}
              onPress={() => setShowRoleModal(false)}>
              <Text style={styles.roleModalButtonText}>Got It!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Time Left</Text>
          <Text style={styles.timer}>{timer}s</Text>
        </View>
        <View style={styles.roleIndicator}>
          <Text style={styles.roleIndicatorText}>
            {myRole === PlayerRole.VAMPIRE ? '🦇 Vampire' : '👤 Villager'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.phaseContainer}>
          <Text style={styles.phaseTitle}>{getPhaseTitle()}</Text>
          <Text style={styles.phaseDescription}>{getPhaseDescription()}</Text>
        </View>

        <View style={styles.playersGrid}>
          <FlatList
            data={players}
            renderItem={renderPlayer}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.playerRow}
          />
        </View>

        {(gamePhase === GamePhase.NIGHT_PHASE && myRole === PlayerRole.VAMPIRE) ||
         gamePhase === GamePhase.DAY_VOTING ? (
          <TouchableOpacity
            style={[styles.voteButton, (!selectedPlayer || isVoting) && styles.voteButtonDisabled]}
            onPress={handleVote}
            disabled={!selectedPlayer || isVoting}>
            {isVoting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.voteButtonText}>
                {selectedPlayer ? 'Confirm Vote' : 'Select a Player'}
              </Text>
            )}
          </TouchableOpacity>
        ) : null}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2a2a3e',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerLabel: {
    color: '#ffffff',
    opacity: 0.7,
    fontSize: 12,
  },
  timer: {
    color: '#ff4444',
    fontSize: 24,
    fontWeight: 'bold',
  },
  roleIndicator: {
    justifyContent: 'center',
  },
  roleIndicatorText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  phaseContainer: {
    marginBottom: 20,
  },
  phaseTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  phaseDescription: {
    color: '#ffffff',
    opacity: 0.7,
    fontSize: 16,
    textAlign: 'center',
  },
  playersGrid: {
    flex: 1,
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
  playerCardEliminated: {
    backgroundColor: '#1a1a1a',
    opacity: 0.5,
  },
  playerCardSelected: {
    borderWidth: 3,
    borderColor: '#ff4444',
  },
  playerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerAvatarEliminated: {
    backgroundColor: '#333',
  },
  playerAvatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  playerName: {
    color: '#ffffff',
    fontSize: 14,
  },
  playerNameEliminated: {
    textDecorationLine: 'line-through',
  },
  eliminatedText: {
    color: '#ff4444',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
  },
  voteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  voteButtonDisabled: {
    backgroundColor: '#666',
  },
  voteButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleModal: {
    backgroundColor: '#2a2a3e',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  roleModalTitle: {
    color: '#ffffff',
    fontSize: 20,
    marginBottom: 20,
    opacity: 0.8,
  },
  roleIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  roleName: {
    color: '#ff4444',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  roleDescription: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 30,
  },
  roleModalButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  roleModalButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
