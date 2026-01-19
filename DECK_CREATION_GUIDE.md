# 📚 Deck Creation Guide - OpenQuiz

Complete guide to creating and managing your study materials in OpenQuiz.

---

## Quick Start

### Creating Your First Deck

1. **Open OpenQuiz** → Click **"📚 My Library"** button on home page
2. **Create Deck** → Click **"➕ Create New Deck"** button
3. **Fill in Deck Info:**
   - **Name**: Give your deck a clear name (e.g., "Spanish Vocabulary")
   - **Category**: Organize by subject (e.g., "Languages", "Science")
   - **Description**: Brief description of what this deck covers
   - **Icon**: Choose an emoji that represents your deck
   - **Color**: Pick a color theme you like
4. **Add Cards:**
   - Front: Question or term
   - Back: Answer or definition
   - Click **"➕ Add Card"** or press Enter
5. **Save** → Click **"💾 Save Deck"**

**Done!** Your deck is ready to study.

---

## Deck Library

### Overview

The Library is your central hub for all study materials.

**Access:** Home → **📚 My Library**

### Features

#### View All Decks
- See all your created decks at a glance
- Each card shows:
  - Deck name and icon
  - Category
  - Number of cards
  - Study progress (studied/mastered)

#### Search & Filter
- **Search box**: Find decks by name, description, or category
- **Category filter**: View decks by specific category
- Updates in real-time as you type

#### Quick Actions (on each deck card)
- **🎴 Study**: Jump straight to flashcard mode
- **📋 Duplicate**: Create a copy of the deck
- **📤 Export**: Download as JSON file
- **🗑️ Delete**: Remove deck (with confirmation)

---

## Creating Decks

### Deck Information

#### Required Fields
- **Name** (required): Clear, descriptive name

#### Optional Fields
- **Description**: What the deck is about
- **Category**: Subject area (auto-suggests existing categories)
- **Icon**: Choose from 24 emojis
- **Color Theme**: 8 beautiful gradient options

### Adding Cards

#### Single Card Entry (Default)

**Best for:** Adding a few cards at a time

1. Fill in **Front** (question/term)
2. Fill in **Back** (answer/definition)
3. Click **"➕ Add Card"** (or press Enter in Back field)
4. Card is added to the list below
5. Repeat for more cards

**Example:**
```
Front: What is the capital of France?
Back: Paris
```

#### Bulk Card Entry

**Best for:** Adding many cards quickly

1. Click **"📋 Bulk Add"** button
2. Enter cards one per line
3. Format: `Front | Back` or `Front  [TAB]  Back`
4. Click **"Add Cards"**

**Example:**
```
Hello | Hola
Goodbye | Adiós
Thank you | Gracias
Please | Por favor
```

**Supported Formats:**
- Pipe-separated: `term | definition`
- Tab-separated: `term[TAB]definition`

**Tips:**
- Copy from spreadsheets (preserves tabs)
- Each line becomes one card
- Invalid lines are skipped
- Shows count of cards added

---

## Editing Decks

### Access Editing

**From Library:** Click any deck card → Opens editor

**From URL:** `/deck/{deckId}/edit`

### Edit Deck Info

All deck information can be changed:
- Name, description, category
- Icon and color theme
- Changes save when you click **"💾 Save Deck"**

### Edit Cards

#### Update Card Content
1. Click **✏️** button on any card
2. Fields become editable
3. Type new content
4. Click outside field to save

#### Delete Cards
1. Click **🗑️** button on card
2. Confirm deletion
3. Card removed immediately

#### Reorder Cards
- Currently: Manual deletion and re-adding
- Coming soon: Drag-and-drop reordering

---

## Import & Export

### Export Deck

**Purpose:** Share with friends, backup, or transfer to another device

**Steps:**
1. Go to Library
2. Find your deck
3. Click **📤** (Export) button
4. JSON file downloads automatically
5. File named: `DeckName.json`

**What's exported:**
- Deck metadata (name, description, category, etc.)
- All cards (front, back, mastery level)
- Statistics
- Creation/update dates

### Import Deck

**Purpose:** Load decks shared by others or restore backups

**Steps:**
1. Go to Library
2. Click **"📥 Import Deck"** button (top-right)
3. Select JSON file from your computer
4. Deck is added to your library

**Notes:**
- New deck ID is generated (no conflicts)
- All cards get fresh IDs
- Imported decks appear at the end of your library

### Sharing Decks

**With Classmates:**
1. Export your deck
2. Send JSON file via email, Discord, Google Drive, etc.
3. They import it into their OpenQuiz

**On GitHub:**
- Create a repository
- Upload `.json` files
- Others can download and import

**Pro tip:** Create "starter packs" for your class!

---

## Data Storage

### Where is my data stored?

**LocalStorage** - All data lives in your browser

**Pros:**
- ✅ No account needed
- ✅ Works offline
- ✅ Completely private
- ✅ Fast access
- ✅ Free forever

**Cons:**
- ⚠️ Only on this device/browser
- ⚠️ Clearing browser data deletes decks
- ⚠️ Not synced across devices (yet)

### Backup Recommendations

**Prevent data loss:**

1. **Regular Exports**: Export important decks monthly
2. **Cloud Storage**: Save exports to Google Drive, Dropbox, etc.
3. **Version Control**: If tech-savvy, use Git for deck files
4. **Multiple Decks**: Import your decks into multiple browsers

### Data Limits

**Typical browser limits:** 5-10MB of LocalStorage

**What this means:**
- Average card: ~200 bytes
- **You can store 25,000+ cards** with ease
- Plenty for most students!

**If you hit limits:**
- Export and archive old decks
- Split large decks into smaller ones
- Delete duplicate or unused decks

---

## Deck Organization

### Categories

**Built-in suggestions:**
- Languages
- Science
- Geography
- History
- Math
- Literature
- Programming
- Medical
- Art & Music

**Custom categories:**
- Type anything you want
- Auto-completes from existing categories
- Case-sensitive (be consistent!)

### Best Practices

#### Naming Conventions
- ✅ "Spanish 101 - Chapter 3"
- ✅ "Chemistry: Periodic Table"
- ✅ "US History - Civil War"
- ❌ "Deck 1", "stuff", "asdf"

#### Deck Size
- **Small (10-30 cards)**: One lesson/chapter
- **Medium (30-100 cards)**: One unit/topic
- **Large (100+ cards)**: Comprehensive subject

**Recommendation:** Keep decks focused (30-50 cards)
- Easier to review
- More manageable
- Better sense of progress

#### Using Descriptions
- Specify chapter/unit numbers
- Note difficulty level
- Add study tips
- Link to resources

**Example:**
```
Name: Biology - Cell Structure
Category: Science
Description: AP Biology Chapter 7 - Cell organelles and their functions. Includes both plant and animal cells. Study with diagrams!
```

---

## Advanced Features

### Deck Duplication

**Use cases:**
- Create "Hard cards only" version
- Make semester-specific variants
- Share template with students

**How:**
1. Click **📋** button on deck
2. Copy is created instantly
3. Named "{Original Name} (Copy)"
4. Edit the copy independently

### Mastery Levels

Each card tracks progress:
- **New**: Never studied
- **Learning**: Recently introduced
- **Reviewing**: Seen multiple times
- **Mastered**: Consistently correct

**Automatically tracked** as you study!

### Statistics

**Per Deck:**
- Total cards
- Cards studied
- Cards mastered

**Coming soon:**
- Study time
- Accuracy percentage
- Streak tracking
- Review schedule

---

## Keyboard Shortcuts

**Deck Editor:**
- `Enter` (in Back field): Add card
- `Esc`: Cancel edit
- `Ctrl/Cmd + S`: Save deck

**Library:**
- `Ctrl/Cmd + F`: Focus search box
- `Enter` (on deck): Open for editing

---

## Tips & Tricks

### Creating Effective Cards

**Good Practice:**
```
Front: What is photosynthesis?
Back: The process plants use to convert light energy into chemical energy
```

**Better Practice:**
```
Front: Photosynthesis - Definition
Back: Process where plants convert light → chemical energy using CO₂ and H₂O
```

**Best Practice:**
```
Front: What do plants convert in photosynthesis?
Back: Light energy → Chemical energy (glucose)

Front: What are inputs for photosynthesis?
Back: CO₂ + H₂O + Light

Front: What are outputs of photosynthesis?
Back: Glucose (C₆H₁₂O₆) + O₂
```

**Why:** Smaller, focused cards = better retention

### Study Strategies

**1. Spaced Repetition**
- Review new cards daily
- Review learned cards weekly
- Review mastered cards monthly

**2. Active Recall**
- Say answer aloud before flipping
- Write answer on paper
- Explain to someone else

**3. Mix It Up**
- Shuffle cards
- Study in different orders
- Combine related decks

### Collaboration

**Study Group Workflow:**

1. **Create shared deck template**
   - One person creates base deck
   - Exports and shares

2. **Everyone adds cards**
   - Each person imports
   - Adds their own cards
   - Exports their version

3. **Merge decks**
   - One person imports all versions
   - Creates comprehensive deck
   - Shares final version

4. **Study together**
   - Use matching game in class
   - Compete on leaderboard
   - Track group progress

---

## Troubleshooting

### My deck disappeared!

**Possible causes:**
1. Cleared browser data
2. Used different browser/device
3. Incognito/private mode

**Solution:**
- Check other browsers on same computer
- Import from backup (if exported)
- Recreate (sorry! this is why backups matter)

### Import failed

**Common issues:**
- File is not valid JSON
- File corrupted during transfer
- Wrong file type selected

**Solution:**
- Re-export original deck
- Use a different transfer method
- Open file in text editor to check format

### Can't add cards

**Check:**
- Both Front and Back have content
- Not hitting browser storage limit
- Deck is not corrupted

**Try:**
- Refresh page
- Export and re-import deck
- Create new deck and copy cards

### Cards not showing in study mode

**Reason:** Study modes currently use demo data

**Coming soon:** Integration with your custom decks!

---

## What's Next?

### Coming Features

✅ **Completed:**
- Deck creation and editing
- Import/export
- Search and filtering
- Demo decks

🔨 **In Progress:**
- Connect study modes to custom decks
- Spaced repetition algorithm
- Progress tracking

📋 **Planned:**
- Image support in cards
- Audio pronunciation
- Markdown formatting
- Cloud sync (optional)
- Mobile app (PWA)
- Collaborative editing
- Public deck marketplace

---

## Getting Help

**Issues?**
- Check this guide
- Read TESTING.md for common problems
- Report bugs: https://github.com/nwrussi/openQuiz/issues

**Ideas?**
- Feature requests welcome
- Contribute on GitHub
- Share with community

---

**Happy studying! 🎓**

*Remember: The best deck is the one you actually use. Start simple, stay consistent, and watch your knowledge grow!*
