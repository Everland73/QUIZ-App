# 비브 퀴즈 (Vibe Quiz)

A React-based educational quiz application featuring Korean history, geography, culture, and science questions.

## Features

✅ **4 Quiz Categories**
- 한국사 (Korean History)
- 지리 (Geography)
- 문화 (Culture)
- 과학 (Science)

✅ **10 Questions per Category** (40 total)

✅ **Immediate Feedback**
- Correct/incorrect indication
- Explanation for each answer

✅ **Detailed Results**
- Score percentage and grade (S–F)
- Question-by-question performance analysis
- Easy restart

## Getting Started

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

```bash
npm install
```

### Running the App

```bash
npm run dev
```

The app opens automatically at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

Output goes to the `dist/` folder.

## Project Structure

```
src/
├── components/          # React UI components
├── data/               # Quiz questions data
├── styles/             # Component stylesheets
├── App.jsx             # Main app logic
└── main.jsx            # React entry point
```

## Usage

1. **Select a Category** — Click a category button to start
2. **Answer Questions** — Choose one of 4 options
3. **Get Feedback** — See if you're correct with an explanation
4. **View Results** — Check your score and performance
5. **Try Again** — Restart with a different category

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool (fast development + optimized production builds)
- **CSS** — Styling (no CSS-in-JS libraries)

## Customization

### Adding Questions

Edit `src/data/quizData.js` and add new question objects:

```javascript
{
  id: 41,
  category: "history",
  difficulty: "medium",
  question: "Your question here?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctAnswer: 0,
  explanation: "Explanation text"
}
```

### Adding Categories

Update `CATEGORIES` array in `src/data/quizData.js`:

```javascript
export const CATEGORIES = [
  { id: "new-category", name: "카테고리 이름", color: "#HEXCOLOR" },
  // ... existing categories
];
```

Then add questions with matching category IDs.

## Notes

- All data is stored locally (no backend required)
- Questions are in Korean
- Responsive design works on mobile and desktop
