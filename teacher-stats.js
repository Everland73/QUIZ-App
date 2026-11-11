// 선생님 페이지용 통계 계산 (화면과 분리해 Node에서도 테스트할 수 있게 함)
const TEACHER_MODE_LABELS = { full: '전체 도전', category: '카테고리 도전', speed: '스피드 퀴즈' };

function teacherLoadManager() {
    return typeof LocalDataManager !== 'undefined' ? LocalDataManager : require('./storage.js').LocalDataManager;
}

// 파일 하나(텍스트)를 학생 한 명으로 변환. 실패하면 { error }
function parseStudentFile(fileName, text) {
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { return { error: 'JSON 형식이 아님' }; }
    const arr = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.gameHistory) ? parsed.gameHistory : null);
    if (!arr) return { error: '기록 배열이 아님' };

    // 앱과 같은 규칙(유효하지 않은 기록 제외)으로 읽는다
    const LDM = teacherLoadManager();
    const store = { d: { gameHistory: JSON.stringify(arr) }, getItem(k) { return k in this.d ? this.d[k] : null }, setItem(k, v) { this.d[k] = v }, removeItem(k) { delete this.d[k] } };
    const history = new LDM(store).getGameHistory();

    const names = {};
    history.forEach(h => { if (h.name) names[h.name] = (names[h.name] || 0) + 1; });
    const top = Object.entries(names).sort((a, b) => b[1] - a[1]);
    return {
        name: top.length ? top[0][0] : fileName.replace(/\.[^.]+$/, ''),
        otherNames: top.slice(1).map(x => x[0]),
        file: fileName,
        history,
        skipped: arr.length - history.length
    };
}

const round1 = n => Math.round(n * 10) / 10;
const mean = list => list.length ? list.reduce((a, b) => a + b, 0) / list.length : null;

// history 일부(필터 적용 후)의 통계. 기록이 없으면 count 0
function summarizeHistory(history) {
    const scores = history.map(h => h.totalScore);
    let correct = 0, total = 0, streak = 0;
    const times = [];
    const byCategory = {};   // 카테고리별 정답률 (모든 모드의 categoryStats 합산)
    const catScores = {};    // 카테고리 도전 모드의 점수 목록
    const byMode = {};

    for (const h of history) {
        correct += h.correctAnswers || 0;
        total += h.totalQuestions || 0;
        streak = Math.max(streak, h.longestStreak || 0);
        if (Number.isFinite(h.averageResponseTime)) times.push(h.averageResponseTime);
        for (const [cat, s] of Object.entries(h.categoryStats || {})) {
            const c = byCategory[cat] || (byCategory[cat] = { correct: 0, total: 0 });
            c.correct += s.correct || 0;
            c.total += s.total || 0;
        }
        if (h.mode === 'category' && h.category) (catScores[h.category] = catScores[h.category] || []).push(h.totalScore);
        (byMode[h.mode] = byMode[h.mode] || []).push(h.totalScore);
    }

    const categories = {};
    for (const [cat, c] of Object.entries(byCategory)) {
        categories[cat] = {
            correct: c.correct, total: c.total,
            accuracy: c.total > 0 ? Math.round((c.correct / c.total) * 100) : null,
            avgScore: catScores[cat] ? round1(mean(catScores[cat])) : null,
            plays: catScores[cat] ? catScores[cat].length : 0
        };
    }
    const modes = {};
    for (const [m, list] of Object.entries(byMode)) {
        modes[m] = { count: list.length, avg: round1(mean(list)), best: Math.max(...list), worst: Math.min(...list) };
    }
    const dates = history.map(h => new Date(h.timestamp).getTime()).filter(Number.isFinite);
    return {
        count: history.length,
        avg: scores.length ? round1(mean(scores)) : null,
        best: scores.length ? Math.max(...scores) : null,
        worst: scores.length ? Math.min(...scores) : null,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : null,
        avgTime: times.length ? round1(mean(times)) : null,
        longestStreak: streak,
        lastPlayed: dates.length ? Math.max(...dates) : null,
        categories, modes
    };
}

// mode: 'all' 또는 특정 모드
function filterByMode(history, mode) {
    return mode === 'all' ? history : history.filter(h => h.mode === mode);
}

// 약한 카테고리: 정답률 가장 낮은 곳 (푼 문제 minTotal개 미만은 표본 부족으로 제외)
function weakestCategory(categories, minTotal = 5) {
    const list = Object.entries(categories).filter(([, c]) => c.total >= minTotal && c.accuracy !== null);
    if (!list.length) return null;
    list.sort((a, b) => a[1].accuracy - b[1].accuracy);
    return { name: list[0][0], accuracy: list[0][1].accuracy };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TEACHER_MODE_LABELS, parseStudentFile, summarizeHistory, filterByMode, weakestCategory };
}
