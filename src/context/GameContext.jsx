import { createContext, useContext, useState, useEffect } from 'react'
import { getSocketInstance } from '../services/socketMock'

const GameContext = createContext()

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}

export const GameProvider = ({ children }) => {
  const [socket] = useState(() => getSocketInstance())
  const [userRole, setUserRole] = useState(null) // 'host' | 'player' | null
  const [roomCode, setRoomCode] = useState(null)
  const [gameState, setGameState] = useState('idle') // 'idle' | 'lobby' | 'playing' | 'finished'
  const [players, setPlayers] = useState([])
  const [currentDeck, setCurrentDeck] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Listen for room events
    const handlePlayerJoined = ({ room }) => {
      setPlayers(room.players)
    }

    const handlePlayerLeft = ({ room }) => {
      setPlayers(room.players)
    }

    const handleGameStarted = () => {
      setGameState('playing')
    }

    const handleRoomUpdated = ({ room }) => {
      setPlayers(room.players)
      setGameState(room.status)
    }

    socket.on('playerJoined', handlePlayerJoined)
    socket.on('playerLeft', handlePlayerLeft)
    socket.on('gameStarted', handleGameStarted)
    socket.on('roomUpdated', handleRoomUpdated)

    return () => {
      socket.off('playerJoined', handlePlayerJoined)
      socket.off('playerLeft', handlePlayerLeft)
      socket.off('gameStarted', handleGameStarted)
      socket.off('roomUpdated', handleRoomUpdated)
    }
  }, [socket])

  const hostGame = async (deck, hostName = 'Host') => {
    try {
      setError(null)
      const result = await socket.createRoom(deck.deckId, hostName)

      if (result.success) {
        setUserRole('host')
        setRoomCode(result.roomCode)
        setGameState('lobby')
        setPlayers(result.room.players)
        setCurrentDeck(deck)
        return result
      } else {
        throw new Error('Failed to create room')
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const joinGame = async (code, playerName) => {
    try {
      setError(null)
      const result = await socket.joinRoom(code, playerName)

      if (result.success) {
        setUserRole('player')
        setRoomCode(code)
        setGameState('lobby')
        setPlayers(result.room.players)
        return result
      } else {
        throw new Error(result.error || 'Failed to join room')
      }
    } catch (err) {
      setError(err.message || 'Room not found')
      throw err
    }
  }

  const startGame = async () => {
    try {
      setError(null)
      const result = await socket.startGame()

      if (result.success) {
        setGameState('playing')
        return result
      } else {
        throw new Error(result.error || 'Failed to start game')
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const leaveGame = () => {
    socket.leaveRoom()
    setUserRole(null)
    setRoomCode(null)
    setGameState('idle')
    setPlayers([])
    setCurrentDeck(null)
    setError(null)
  }

  const sendAction = (action, data) => {
    socket.sendAction(action, data)
  }

  const getCurrentRoom = () => {
    return socket.getCurrentRoom()
  }

  const value = {
    userRole,
    roomCode,
    gameState,
    players,
    currentDeck,
    error,
    hostGame,
    joinGame,
    startGame,
    leaveGame,
    sendAction,
    getCurrentRoom,
    isHost: userRole === 'host',
    isPlayer: userRole === 'player',
    isInGame: gameState !== 'idle'
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}
