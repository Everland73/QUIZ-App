import { useState, useEffect } from "react";
import { quizData, CATEGORIES } from "./data/quizData";
import StartScreen from "./components/StartScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import "./App.css";

function App() {
  const [gameState, setGameState] = useState("start"); // start, playing, finished
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [results, setResults] = useState([]);

  const getQuestionsForCategory = (categoryId) => {
    return quizData.filter((q) => q.category === categoryId);
  };

  const currentQuestions =
    selectedCategory && gameState !== "start"
      ? getQuestionsForCategory(selectedCategory)
      : [];

  const currentQuestion =
    currentQuestions.length > 0 ? currentQuestions[currentQuestionIndex] : null;

  const handleStartGame = (categoryId) => {
    setSelectedCategory(categoryId);
    setGameState("playing");
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setResults([]);
  };

  const handleAnswer = (optionIndex) => {
    if (answered) return;

    setSelectedAnswer(optionIndex);
    setAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setResults([
      ...results,
      {
        question: currentQuestion.question,
        selectedAnswer: optionIndex,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
        explanation: currentQuestion.explanation
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setGameState("finished");
    }
  };

  const handleRestart = () => {
    setGameState("start");
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setResults([]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧠 비브 퀴즈</h1>
      </header>

      <main className="app-main">
        {gameState === "start" && (
          <StartScreen categories={CATEGORIES} onStart={handleStartGame} />
        )}

        {gameState === "playing" && currentQuestion && (
          <QuizScreen
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={currentQuestions.length}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            answered={answered}
            selectedAnswer={selectedAnswer}
          />
        )}

        {gameState === "finished" && (
          <ResultScreen
            score={score}
            totalQuestions={currentQuestions.length}
            results={results}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}

export default App;
