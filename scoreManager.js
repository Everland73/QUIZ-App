// 게임 모드 설정
const gameModes = {
    full:     { label: '전체 도전',     questions: 40, timeLimit: null },
    category: { label: '카테고리 도전', questions: 10, timeLimit: null },
    speed:    { label: '스피드 퀴즈',   questions: 20, timeLimit: 15 } // 문제당 15초
};

// 게임당 힌트 횟수 (힌트 1회 = 오답 2개 제거)
const HINTS_PER_GAME = 3;

// 점수 규칙
const SCORE_RULES = {
    base: 10,            // 정답 기본 점수
    fastSeconds: 10,     // 이 시간(초) 미만으로 풀면 시간 보너스
    fastBonus: 3,
    noHintBonus: 2       // 해당 문제에서 힌트를 쓰지 않았을 때
};

class ScoreManager {
    constructor() {
        this.reset();
    }

    reset() {
        this.totalScore = 0;
        this.correctAnswers = 0;
        this.consecutiveCorrect = 0;
        this.longestStreak = 0;
        this.answers = [];
        this.categoryStats = {};
    }

    // 연속 정답 보너스 (consecutiveCorrect: 이번 정답을 포함한 연속 정답 수)
    //  3~4연속 +2 / 5~9연속 +4 / 10연속 이상 +6
    getConsecutiveBonus(consecutiveCorrect) {
        if (consecutiveCorrect >= 10) return 6;
        if (consecutiveCorrect >= 5) return 4;
        if (consecutiveCorrect >= 3) return 2;
        return 0;
    }

    // 점수 내역 (UI 표시용)
    getScoreBreakdown(isCorrect, timeSpent, consecutiveCorrect, hintUsed) {
        const breakdown = { isCorrect, base: 0, timeBonus: 0, noHintBonus: 0, comboBonus: 0, total: 0 };
        if (!isCorrect) return breakdown;

        breakdown.base = SCORE_RULES.base;
        if (timeSpent < SCORE_RULES.fastSeconds) breakdown.timeBonus = SCORE_RULES.fastBonus;
        if (!hintUsed) breakdown.noHintBonus = SCORE_RULES.noHintBonus;
        breakdown.comboBonus = this.getConsecutiveBonus(consecutiveCorrect);
        breakdown.total = breakdown.base + breakdown.timeBonus + breakdown.noHintBonus + breakdown.comboBonus;
        return breakdown;
    }

    // 한 문제의 점수
    calculateScore(isCorrect, timeSpent, consecutiveCorrect, hintUsed) {
        return this.getScoreBreakdown(isCorrect, timeSpent, consecutiveCorrect, hintUsed).total;
    }

    // 답변 기록 + 누적 점수/연속 정답/카테고리 통계 갱신
    recordAnswer({ question, selectedIndex, isCorrect, timeSpent, hintUsed, timedOut = false }) {
        if (isCorrect) {
            this.consecutiveCorrect++;
            this.correctAnswers++;
            this.longestStreak = Math.max(this.longestStreak, this.consecutiveCorrect);
        } else {
            this.consecutiveCorrect = 0;
        }

        const breakdown = this.getScoreBreakdown(isCorrect, timeSpent, this.consecutiveCorrect, hintUsed);
        this.totalScore += breakdown.total;

        if (!this.categoryStats[question.category]) {
            this.categoryStats[question.category] = { correct: 0, total: 0 };
        }
        this.categoryStats[question.category].total++;
        if (isCorrect) this.categoryStats[question.category].correct++;

        this.answers.push({
            questionId: question.id,
            selected: selectedIndex,
            correct: question.correctAnswer,
            isCorrect,
            timedOut,
            hintUsed,
            timeSpent,
            points: breakdown.total
        });

        return { breakdown, streak: this.consecutiveCorrect };
    }

    // 결과 분석
    getResults(totalQuestions = this.answers.length) {
        const answered = this.answers.length;
        const totalTime = this.answers.reduce((sum, a) => sum + a.timeSpent, 0);

        return {
            totalScore: this.totalScore,
            correctAnswers: this.correctAnswers,
            totalQuestions,
            accuracy: totalQuestions > 0 ? Math.round((this.correctAnswers / totalQuestions) * 100) : 0,
            categoryStats: JSON.parse(JSON.stringify(this.categoryStats)),
            averageResponseTime: answered > 0 ? Math.round((totalTime / answered) * 10) / 10 : 0,
            longestStreak: this.longestStreak,
            hintsUsed: this.answers.filter(a => a.hintUsed).length
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScoreManager, gameModes, HINTS_PER_GAME, SCORE_RULES };
}
