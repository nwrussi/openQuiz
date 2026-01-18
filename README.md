# OpenQuiz 🎓

> A free, open-source learning platform that brings the best of Quizlet, Kahoot, and Anki together - without ads, without subscriptions, forever.

## Vision

OpenQuiz is a modern flashcard learning platform designed to be:

- **Free Forever**: No ads, no subscriptions, no paywalls
- **Open Source**: Built by students, for students
- **Offline First**: Works seamlessly without internet
- **Collaborative**: Share decks, compete with friends
- **Privacy Focused**: Your data stays yours

### Inspired by the Best

- **Quizlet**: Beautiful, intuitive flashcard interface
- **Kahoot**: Fun, competitive learning with leaderboards
- **Jackbox.tv**: Engaging game modes and freedom in content
- **Anki**: Reliability, handling 10,000+ cards effortlessly

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/nwrussi/openQuiz.git
cd openQuiz

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
openQuiz/
├── src/
│   ├── components/
│   │   ├── animations/      # Reusable animation components
│   │   │   └── Animations.jsx
│   │   ├── game-modes/      # Study modes
│   │   │   ├── Flashcards.jsx
│   │   │   └── Matching.jsx
│   │   └── ui/              # UI components
│   │       ├── Scoreboard.jsx
│   │       └── SessionSummary.jsx
│   ├── pages/
│   │   └── Home.jsx         # Landing page
│   ├── services/
│   │   ├── aws-config.js    # AWS SDK configuration
│   │   └── flashcard-service.js  # Data layer
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🎮 Features

### Current Features (v0.1.0)

✅ **Flashcard Study Mode**
- 3D card flip animations
- Swipe and classic study modes
- Confidence-based learning (Again, Hard, Good, Easy)
- Progress tracking with mastery badges
- Session statistics and streaks

✅ **Matching Game**
- Drag-and-drop term matching
- Timer-based challenges
- Score system with bonuses
- Visual feedback and celebrations

✅ **Leaderboard**
- Live player rankings
- Animated score counters
- Streak indicators
- Performance stats

✅ **Session Summary**
- Detailed analytics
- Question-by-question breakdown
- XP and leveling system
- Performance comparisons

### In Development

🔨 AWS Integration
- DynamoDB for deck storage
- S3 for media sharing
- API Gateway for multiplayer

🔨 Deck Management
- Create, edit, delete decks
- Import/export as JSON
- Share via QR codes

🔨 Multiplayer (WebRTC)
- Real-time competitive games
- Room codes for easy joining
- Live leaderboards

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling

### Backend (Planned)
- **AWS DynamoDB** - Database
- **AWS S3** - File storage
- **AWS API Gateway** - REST API
- **AWS Lambda** - Serverless functions

### Offline Support
- LocalStorage fallback
- IndexedDB for large datasets
- Service Workers (planned)

---

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key
VITE_API_ENDPOINT=https://your-api.amazonaws.com

# Feature Flags
VITE_OFFLINE_MODE=true
VITE_USE_AWS=false
```

> **Note**: For local development, the app works without AWS credentials using LocalStorage

---

## 🎨 Design Philosophy

### Craft, Don't Code

Every component is built with intention:
- **Animations**: Smooth, purposeful transitions
- **Colors**: Vibrant gradients that inspire learning
- **Typography**: Clear, accessible hierarchy
- **Interactions**: Instant feedback, delightful micro-interactions

### Simplicity

- Zero friction to start learning
- No manual required
- Intuitive gestures and controls
- One tap from home to studying

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Keep components focused and reusable
- Use Tailwind utilities for styling
- Write meaningful commit messages
- Test on multiple devices/browsers
- Maintain offline-first capability

---

## 📝 Roadmap

### Phase 1: Core Foundation ✅
- [x] Project setup and structure
- [x] Component organization
- [x] Routing and navigation
- [x] AWS integration layer
- [x] Build system

### Phase 2: Data Layer (In Progress)
- [ ] Deck CRUD operations
- [ ] User authentication
- [ ] DynamoDB schemas
- [ ] Local storage sync
- [ ] Import/export functionality

### Phase 3: Enhanced Learning
- [ ] Spaced repetition algorithm
- [ ] Study statistics
- [ ] Multiple choice mode
- [ ] Written answer mode
- [ ] Audio/image support

### Phase 4: Social & Multiplayer
- [ ] WebRTC peer-to-peer
- [ ] Live multiplayer games
- [ ] Deck sharing marketplace
- [ ] Teacher portal
- [ ] Class management

### Phase 5: Polish
- [ ] Mobile app (PWA)
- [ ] Offline sync
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Dark mode

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 💡 Philosophy

> "Technology alone is not enough. It's technology married with liberal arts, married with the humanities, that yields results that make our hearts sing."

OpenQuiz isn't just another flashcard app. It's a commitment to:
- **Freedom**: No ads, no tracking, no profit motive
- **Excellence**: Polished, delightful, beautiful
- **Community**: Built together, improved together
- **Accessibility**: Learning should be free for everyone

---

## 🙏 Acknowledgments

Built with inspiration from:
- Quizlet - for pioneering flashcard learning
- Kahoot - for making learning fun
- Anki - for proving software can last
- The open source community - for showing us the way

---

**Made with ❤️ by the open source community**

*Start learning in seconds. No account required.*
