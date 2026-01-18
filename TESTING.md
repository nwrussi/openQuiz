## Quick Testing Checklist

Copy this checklist and check off items as you test:

### Navigation
- [ ] Home page loads with gradient background
- [ ] All 4 game mode cards visible and hoverable
- [ ] Clicking Flashcards card → navigates to /flashcards
- [ ] Clicking Matching card → navigates to /matching
- [ ] Clicking Leaderboard card → navigates to /scoreboard
- [ ] Clicking Session Summary card → navigates to /summary
- [ ] Browser back button works from any page

### Flashcards Page
- [ ] Card flip animation works (tap to flip)
- [ ] Front shows "Question", back shows "Answer"
- [ ] Progress ring displays
- [ ] Confidence buttons appear: Again, Hard, Good, Easy
- [ ] Stats update when buttons clicked
- [ ] Mode toggle works (Swipe ↔ Classic)
- [ ] In Swipe Mode: drag left/right works
- [ ] Streak counter increments

### Matching Page
- [ ] Terms and definitions appear
- [ ] Drag and drop works
- [ ] Timer counts down from 60 seconds
- [ ] Score updates on correct match (+100 + time bonus)
- [ ] Score decreases on wrong match (-25)
- [ ] Visual connection lines appear
- [ ] Correct matches show green checkmark
- [ ] Wrong matches shake in red
- [ ] Game over screen appears when done

### Scoreboard Page
- [ ] Player list displays
- [ ] Rank badges show (👑 🥈 🥉)
- [ ] Scores animate (count up)
- [ ] Streak fire emoji appears (🔥)
- [ ] Stats cards show: Accuracy, Avg Time, Best Streak
- [ ] "You" indicator highlights current player

### Session Summary Page
- [ ] Three tabs appear: Overview, Breakdown, Questions
- [ ] Star rating displays
- [ ] Circular progress ring shows
- [ ] Statistics animate (counting numbers)
- [ ] Tab switching works
- [ ] Question breakdown shows ✅/❌

### Performance
- [ ] No console errors (open DevTools → Console)
- [ ] Smooth animations (60fps)
- [ ] Page loads in < 2 seconds
- [ ] No layout shifts during load

### Responsive Design
- [ ] Mobile view (375px): cards stack vertically
- [ ] Tablet view (768px): 2 columns
- [ ] Desktop view (1920px): proper spacing
- [ ] All text readable at all sizes
- [ ] Touch targets large enough on mobile

### Known Limitations (Expected)
- ⚠️ Sample data is hardcoded (not from database yet)
- ⚠️ Progress doesn't persist (no storage yet)
- ⚠️ Multiplayer features not functional yet
- ⚠️ No deck creation/management yet
- ⚠️ AWS features not active (offline mode only)

---

## Expected Behavior

This is a **visual prototype build** - everything looks and feels polished, but:
- Data is hardcoded in components
- No backend connectivity yet
- Progress resets on page refresh
- All players/scores are demo data

This is EXACTLY what we want for an initial reference build.
