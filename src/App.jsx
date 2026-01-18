import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import OpenQuizFlashcards from './components/game-modes/Flashcards'
import OpenQuizMatching from './components/game-modes/Matching'
import OpenQuizScoreboard from './components/ui/Scoreboard'
import OpenQuizSessionSummary from './components/ui/SessionSummary'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flashcards" element={<OpenQuizFlashcards />} />
          <Route path="/matching" element={<OpenQuizMatching />} />
          <Route path="/scoreboard" element={<OpenQuizScoreboard />} />
          <Route path="/summary" element={<OpenQuizSessionSummary />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
