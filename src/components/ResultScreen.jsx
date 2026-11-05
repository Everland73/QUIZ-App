import "../styles/ResultScreen.css";

export default function ResultScreen({
  score,
  totalQuestions,
  results,
  onRestart
}) {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getGrade = () => {
    if (percentage >= 90) return "S등급";
    if (percentage >= 80) return "A등급";
    if (percentage >= 70) return "B등급";
    if (percentage >= 60) return "C등급";
    return "F등급";
  };

  const getMessage = () => {
    if (percentage >= 90) return "완벽합니다! 🌟";
    if (percentage >= 80) return "훌륭합니다! 👏";
    if (percentage >= 70) return "좋은 성적입니다! 😊";
    if (percentage >= 60) return "더 노력해보세요! 💪";
    return "한 번 더 도전해보세요! 🚀";
  };

  return (
    <div className="result-screen">
      <div className="result-content">
        <h2>게임 종료</h2>

        <div className="score-section">
          <div className="score-circle">
            <div className="score-number">{score}</div>
            <div className="score-total">/ {totalQuestions}</div>
          </div>

          <div className="score-info">
            <h3 className="grade">{getGrade()}</h3>
            <p className="percentage">{percentage}%</p>
            <p className="message">{getMessage()}</p>
          </div>
        </div>

        <div className="results-summary">
          <h3>정답 분석</h3>
          <div className="result-items">
            {results.map((result, index) => (
              <div
                key={index}
                className={`result-item ${
                  result.isCorrect ? "correct" : "incorrect"
                }`}
              >
                <span className="result-number">{index + 1}.</span>
                <div className="result-details">
                  <p className="result-question">{result.question}</p>
                  {!result.isCorrect && (
                    <p className="result-answer">
                      정답: {result.correctAnswer === 0 ? "A" : result.correctAnswer === 1 ? "B" : result.correctAnswer === 2 ? "C" : "D"}
                    </p>
                  )}
                </div>
                <span className={`result-icon ${result.isCorrect ? "correct-icon" : "incorrect-icon"}`}>
                  {result.isCorrect ? "✓" : "✗"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button className="restart-button" onClick={onRestart}>
          다시 시작
        </button>
      </div>
    </div>
  );
}
