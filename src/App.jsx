import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LibraryProvider } from './context/LibraryContext'
import { GameProvider } from './context/GameContext'
import Home from './pages/Home'
import Library from './pages/Library'
import Studio from './pages/Studio'
import Lobby from './pages/Lobby'
import OpenQuizFlashcards from './components/game-modes/Flashcards'
import OpenQuizMatching from './components/game-modes/Matching'
import OpenQuizScoreboard from './components/ui/Scoreboard'
import OpenQuizSessionSummary from './components/ui/SessionSummary'

function App() {
  return (
    <Router>
      <GameProvider>
        <LibraryProvider>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/studio/:deckId" element={<Studio />} />
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/flashcards" element={<OpenQuizFlashcards />} />
              <Route path="/matching" element={<OpenQuizMatching />} />
              <Route path="/scoreboard" element={<OpenQuizScoreboard />} />
              <Route path="/summary" element={<OpenQuizSessionSummary />} />
            </Routes>
          </div>
        </LibraryProvider>
      </GameProvider>
    </Router>
  )
}

export default App
