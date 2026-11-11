// 로컬 데이터 관리: 게임 기록 저장, 순위표, 통계, 사용자 설정
const STORAGE_KEYS = { history: 'gameHistory', settings: 'quizSettings' };
const MAX_HISTORY = 200;       // 보관할 최대 기록 수 (오래된 것부터 삭제)
const LEADERBOARD_SIZE = 10;   // 순위표 표시 인원
const DAY_MS = 24 * 60 * 60 * 1000;

const DEFAULT_SETTINGS = {
    nickname: '',
    difficulty: 'all',   // all | easy | medium | hard
    sound: false,
    theme: null          // null이면 브라우저 설정(prefers-color-scheme)을 따름
};

class LocalDataManager {
    // storage: localStorage 호환 객체 (테스트에서 주입 가능). 없으면 localStorage를 시도하고, 쓸 수 없으면 메모리에만 저장
    constructor(storage) {
        this.memory = {};
        this.storage = storage !== undefined ? storage : LocalDataManager.detectStorage();
    }

    static detectStorage() {
        try {
            const s = globalThis.localStorage;
            if (!s) return null;
            const probe = '__quiz_probe__';
            s.setItem(probe, '1');
            s.removeItem(probe);
            return s;
        } catch (e) {
            return null; // 프라이빗 모드, 저장소 차단 등
        }
    }

    // false이면 새로고침 시 기록이 사라짐
    get persistent() {
        return this.storage !== null;
    }

    _read(key, fallback) {
        try {
            const raw = this.storage ? this.storage.getItem(key) : this.memory[key];
            if (raw === null || raw === undefined) return fallback;
            return JSON.parse(raw);
        } catch (e) {
            return fallback; // 손상된 JSON
        }
    }

    _write(key, value) {
        const raw = JSON.stringify(value);
        try {
            if (this.storage) this.storage.setItem(key, raw);
            else this.memory[key] = raw;
            return true;
        } catch (e) {
            // 용량 초과 등: 메모리로 대체해 최소한 이번 세션에는 유지
            this.memory[key] = raw;
            this.storage = null;
            return false;
        }
    }

    // ---------- 기록 ----------

    getGameHistory() {
        const data = this._read(STORAGE_KEYS.history, []);
        if (!Array.isArray(data)) return [];
        return data.filter(h => h && typeof h === 'object' && Number.isFinite(h.totalScore));
    }

    // result: { mode, category, difficulty, name, totalScore, correctAnswers, totalQuestions, accuracy, ... }
    saveGameResult(result) {
        const history = this.getGameHistory();
        const entry = {
            ...result,
            id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
            timestamp: new Date().toISOString()
        };
        history.push(entry);
        this._write(STORAGE_KEYS.history, history.slice(-MAX_HISTORY));
        return entry;
    }

    // filter: { mode, category } 일치하는 기록만 (생략하면 전체). 기록이 없으면 0
    getBestScore(filter = {}) {
        return this.filterHistory(filter).reduce((max, h) => Math.max(max, h.totalScore), 0);
    }

    filterHistory({ mode, category, since } = {}) {
        return this.getGameHistory().filter(h => {
            if (mode && h.mode !== mode) return false;
            if (category && h.category !== category) return false;
            if (since !== undefined && new Date(h.timestamp).getTime() < since) return false;
            return true;
        });
    }

    clearHistory() {
        try {
            if (this.storage) this.storage.removeItem(STORAGE_KEYS.history);
        } catch (e) { /* 무시 */ }
        delete this.memory[STORAGE_KEYS.history];
    }

    // ---------- 순위표 ----------

    // 점수 내림차순 → 정답률 내림차순 → 먼저 달성한 기록 우선
    static compareEntries(a, b) {
        return b.totalScore - a.totalScore
            || (b.accuracy || 0) - (a.accuracy || 0)
            || new Date(a.timestamp) - new Date(b.timestamp);
    }

    // scope: { period: 'daily' | 'weekly' | 'allTime', mode, category }
    //  - daily: 오늘(로컬 자정부터), weekly: 최근 7일
    //  - 서로 다른 모드는 문제 수가 달라 점수를 비교할 수 없으므로 모드(또는 카테고리)별로 따로 집계
    getRankedEntries({ period = 'allTime', mode, category, now = Date.now() } = {}) {
        let since;
        if (period === 'daily') {
            const d = new Date(now);
            d.setHours(0, 0, 0, 0);
            since = d.getTime();
        } else if (period === 'weekly') {
            since = now - 7 * DAY_MS;
        }
        return this.filterHistory({ mode, category, since }).sort(LocalDataManager.compareEntries);
    }

    getLeaderboard(scope = {}) {
        return this.getRankedEntries(scope).slice(0, LEADERBOARD_SIZE);
    }

    // 해당 기록의 순위(1부터)와 집계 대상 수. 기록이 범위에 없으면 null
    getRank(entryId, scope = {}) {
        const ranked = this.getRankedEntries(scope);
        const index = ranked.findIndex(h => h.id === entryId);
        return index === -1 ? null : { rank: index + 1, total: ranked.length };
    }

    // ---------- 통계 ----------

    getStats() {
        const history = this.getGameHistory();
        const byCategory = {};
        const byMode = {};
        let totalCorrect = 0;
        let totalQuestions = 0;
        let longestStreak = 0;
        let timeSum = 0;
        let timeCount = 0;

        for (const h of history) {
            totalCorrect += h.correctAnswers || 0;
            totalQuestions += h.totalQuestions || 0;
            longestStreak = Math.max(longestStreak, h.longestStreak || 0);
            if (Number.isFinite(h.averageResponseTime)) {
                timeSum += h.averageResponseTime;
                timeCount++;
            }

            byMode[h.mode] = (byMode[h.mode] || 0) + 1;

            for (const [cat, s] of Object.entries(h.categoryStats || {})) {
                if (!byCategory[cat]) byCategory[cat] = { correct: 0, total: 0, accuracy: 0 };
                byCategory[cat].correct += s.correct || 0;
                byCategory[cat].total += s.total || 0;
            }
        }
        for (const s of Object.values(byCategory)) {
            s.accuracy = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        }

        return {
            playCount: history.length,
            byMode,
            totalCorrect,
            totalQuestions,
            accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
            averageResponseTime: timeCount > 0 ? Math.round((timeSum / timeCount) * 10) / 10 : 0,
            longestStreak,
            byCategory
        };
    }

    // 성장 그래프용: 시간순 점수 추이 (최근 limit개)
    getScoreTrend({ mode, limit = 20 } = {}) {
        return this.filterHistory({ mode })
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .slice(-limit)
            .map(h => ({
                timestamp: h.timestamp,
                score: h.totalScore,
                accuracy: h.accuracy,
                correct: h.correctAnswers,
                total: h.totalQuestions
            }));
    }

    // ---------- 설정 ----------

    getSettings() {
        const saved = this._read(STORAGE_KEYS.settings, {});
        return { ...DEFAULT_SETTINGS, ...(saved && typeof saved === 'object' ? saved : {}) };
    }

    saveSettings(patch) {
        const next = { ...this.getSettings(), ...patch };
        this._write(STORAGE_KEYS.settings, next);
        return next;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LocalDataManager, STORAGE_KEYS, MAX_HISTORY, LEADERBOARD_SIZE, DEFAULT_SETTINGS };
}
