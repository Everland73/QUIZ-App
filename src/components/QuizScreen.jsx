import "../styles/QuizScreen.css";

export default function QuizScreen({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  answered,
  selectedAnswer
}) {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="question-counter">
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      <div className="quiz-content">
        <h2 className="question-text">{question.question}</h2>

        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${
                selectedAnswer === index ? "selected" : ""
              } ${
                answered && index === question.correctAnswer ? "correct" : ""
              } ${
                answered &&
                selectedAnswer === index &&
                index !== question.correctAnswer
                  ? "incorrect"
                  : ""
              }`}
              onClick={() => onAnswer(index)}
              disabled={answered}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
              {answered && index === question.correctAnswer && (
                <span className="check-mark">✓</span>
              )}
              {answered &&
                selectedAnswer === index &&
                index !== question.correctAnswer && (
                  <span className="cross-mark">✗</span>
                )}
            </button>
          ))}
        </div>

        {answered && (
          <div className="feedback-section">
            <div className={`feedback ${selectedAnswer === question.correctAnswer ? "correct-feedback" : "incorrect-feedback"}`}>
              <h3>
                {selectedAnswer === question.correctAnswer
                  ? "정답입니다! 🎉"
                  : "틀렸습니다."}
              </h3>
              <p className="explanation">{question.explanation}</p>
            </div>

            <button className="next-button" onClick={onNext}>
              다음 문제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
