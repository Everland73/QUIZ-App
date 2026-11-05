import "../styles/StartScreen.css";

export default function StartScreen({ categories, onStart }) {
  return (
    <div className="start-screen">
      <div className="start-content">
        <h2>카테고리를 선택하세요</h2>
        <p className="subtitle">각 카테고리마다 10개의 문제를 풀 수 있습니다</p>

        <div className="categories-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              className="category-button"
              style={{ backgroundColor: category.color }}
              onClick={() => onStart(category.id)}
            >
              <span className="category-name">{category.name}</span>
              <span className="question-count">10문제</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
