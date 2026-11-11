const CATEGORIES = ["한국사", "세계지리", "과학", "예술과 문화"];
const PINNED_QUESTION_ID = 12; // 세계지리 카테고리 도전에서 항상 첫 문제로 고정 (세계에서 가장 긴 강)

// 게임 상태 관리
const scoreManager = new ScoreManager();
const dataManager = new LocalDataManager();
let settings = dataManager.getSettings();
let activeQuestions = [];
let lastResult = null;       // 방금 끝난 게임의 저장 정보 (순위, 신기록 여부 등)
let returnScreen = null;     // 순위표/내 기록에서 "돌아가기" 시 이동할 화면
let gameState = createGameState('full', null, 'all');

function createGameState(mode, category, difficulty = 'all') {
    return {
        mode,
        modeConfig: gameModes[mode],
        selectedCategory: category,
        difficulty,
        currentQuestionIndex: 0,
        isAnswered: false,
        isPaused: false,
        hintsLeft: HINTS_PER_GAME,
        hintUsedThisQuestion: false,
        feedbackTimeoutId: null
    };
}

// DOM 요소들
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const modeCards = document.querySelectorAll('.mode-card');
const modeSelect = document.getElementById('modeSelect');
const categorySelect = document.getElementById('categorySelect');
const startSubtitle = document.getElementById('startSubtitle');
const categoryButtons = document.querySelectorAll('.category-chip[data-category]');
const backToModesBtn = document.getElementById('backToModesBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const feedbackModal = document.getElementById('feedbackModal');
const hintBtn = document.getElementById('hintBtn');
const pauseBtn = document.getElementById('pauseBtn');
const pauseOverlay = document.getElementById('pauseOverlay');
const resumeBtn = document.getElementById('resumeBtn');
const quitBtn = document.getElementById('quitBtn');
const timerDisplay = document.getElementById('timerDisplay');
const timerValue = document.getElementById('timerValue');
const comboBadge = document.getElementById('comboBadge');
const leaderboardScreen = document.getElementById('leaderboardScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const themeToggle = document.getElementById('themeToggle');
const soundToggle = document.getElementById('soundToggle');
const nicknameInput = document.getElementById('nicknameInput');
const difficultySelect = document.getElementById('difficultySelect');
const shareStatus = document.getElementById('shareStatus');

// ---------- 문제 추출 ----------

function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// 선택한 난이도 문제를 먼저, 부족하면 가까운 난이도 순(쉬움-보통-어려움)으로 채운다.
// '혼합'이면 전체를 무작위로 섞는다.
const DIFFICULTY_RANK = { easy: 0, medium: 1, hard: 2 };

function orderByDifficulty(pool, difficulty) {
    if (!(difficulty in DIFFICULTY_RANK)) return shuffle(pool);
    const atDistance = d => shuffle(pool.filter(q =>
        Math.abs(DIFFICULTY_RANK[q.difficulty] - DIFFICULTY_RANK[difficulty]) === d));
    return [...atDistance(0), ...atDistance(1), ...atDistance(2)];
}

function pickQuestions(mode, category, difficulty = 'all') {
    const count = gameModes[mode].questions;

    if (mode === 'category') {
        const pool = quizQuestions.filter(q => q.category === category);
        const picked = shuffle(orderByDifficulty(pool, difficulty).slice(0, count));

        if (category === "세계지리") {
            const pinned = pool.find(q => q.id === PINNED_QUESTION_ID);
            if (pinned) {
                const rest = picked.filter(q => q.id !== pinned.id);
                return [pinned, ...rest].slice(0, count);
            }
        }
        return picked;
    }

    if (mode === 'full') {
        // 카테고리마다 같은 수만큼 뽑아서 섞기
        const perCategory = Math.floor(count / CATEGORIES.length);
        const picked = CATEGORIES.flatMap(cat =>
            orderByDifficulty(quizQuestions.filter(q => q.category === cat), difficulty).slice(0, perCategory)
        );
        return shuffle(picked);
    }

    // speed: 전체 문제에서 무작위
    return shuffle(orderByDifficulty(quizQuestions, difficulty).slice(0, count));
}

// ---------- 문제별 타이머 (일시정지 시간 제외) ----------

const questionTimer = {
    intervalId: null,
    startedAt: 0,
    accumulatedMs: 0,
    running: false,

    start() {
        this.pause();
        this.accumulatedMs = 0;
        this.resume();
    },

    resume() {
        if (this.running) return;
        this.startedAt = performance.now();
        this.running = true;
        this.intervalId = setInterval(onTimerTick, 100);
    },

    pause() {
        if (!this.running) return;
        this.accumulatedMs += performance.now() - this.startedAt;
        this.running = false;
        clearInterval(this.intervalId);
        this.intervalId = null;
    },

    // 멈추고 경과 시간(초)을 반환
    stop() {
        this.pause();
        return this.accumulatedMs / 1000;
    },

    elapsed() {
        const current = this.running ? performance.now() - this.startedAt : 0;
        return (this.accumulatedMs + current) / 1000;
    }
};

function onTimerTick() {
    updateTimerDisplay();
    const limit = gameState.modeConfig.timeLimit;
    if (limit && questionTimer.elapsed() >= limit) {
        handleAnswer(-1, true);
    }
}

function updateTimerDisplay() {
    const limit = gameState.modeConfig.timeLimit;
    const elapsed = questionTimer.elapsed();

    if (limit) {
        const remaining = Math.max(0, limit - elapsed);
        timerValue.textContent = Math.ceil(remaining);
        timerDisplay.classList.toggle('danger', remaining <= 5);
    } else {
        timerValue.textContent = Math.floor(elapsed);
        timerDisplay.classList.remove('danger');
    }
}

// ---------- 게임 흐름 ----------

function initGame(mode, category = null) {
    const difficulty = settings.difficulty;
    activeQuestions = pickQuestions(mode, category, difficulty);
    scoreManager.reset();
    gameState = createGameState(mode, category, difficulty);
    lastResult = null;

    // 화면 전환
    showScreen(quizScreen);
    feedbackModal.classList.remove('show');
    setPaused(false);

    const modeLabel = document.getElementById('modeLabel');
    modeLabel.textContent = category ? `${gameState.modeConfig.label} · ${category}` : gameState.modeConfig.label;

    updateHintButton();
    loadQuestion();
}

function loadQuestion() {
    const question = activeQuestions[gameState.currentQuestionIndex];

    updateProgress();

    document.getElementById('categoryBadge').textContent = question.category;
    document.getElementById('questionText').textContent = question.question;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => handleAnswer(index);
        optionsContainer.appendChild(button);
    });

    gameState.isAnswered = false;
    gameState.hintUsedThisQuestion = false;
    updateHintButton();
    pauseBtn.disabled = false;

    questionTimer.start();
    updateTimerDisplay();
}

// 답변 처리 (timedOut: 시간 초과로 자동 오답 처리)
function handleAnswer(selectedIndex, timedOut = false) {
    if (gameState.isAnswered || gameState.isPaused) return;
    gameState.isAnswered = true;

    const question = activeQuestions[gameState.currentQuestionIndex];
    const limit = gameState.modeConfig.timeLimit;

    let timeSpent = questionTimer.stop();
    if (limit) timeSpent = Math.min(timeSpent, limit);

    const isCorrect = !timedOut && selectedIndex === question.correctAnswer;

    const { breakdown, streak } = scoreManager.recordAnswer({
        question,
        selectedIndex,
        isCorrect,
        timeSpent,
        hintUsed: gameState.hintUsedThisQuestion,
        timedOut
    });

    updateProgress();
    updateHintButton();
    pauseBtn.disabled = true;

    showAnswerFeedback(selectedIndex, question.correctAnswer, isCorrect);
    playSound(isCorrect ? 'correct' : 'wrong');

    gameState.feedbackTimeoutId = setTimeout(() => {
        showFeedback(isCorrect, timedOut, breakdown, streak, question.explanation);
    }, 1000);
}

function showAnswerFeedback(selectedIndex, correctIndex, isCorrect) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.add('disabled'));

    if (isCorrect) {
        buttons[selectedIndex].classList.add('correct');
    } else {
        if (buttons[selectedIndex]) buttons[selectedIndex].classList.add('incorrect');
        buttons[correctIndex].classList.add('correct');
    }
}

function formatBreakdown(b) {
    if (!b.isCorrect) return '+0점';
    const parts = [`기본 ${b.base}`];
    if (b.timeBonus) parts.push(`빠른 응답 +${b.timeBonus}`);
    if (b.noHintBonus) parts.push(`노힌트 +${b.noHintBonus}`);
    if (b.comboBonus) parts.push(`콤보 +${b.comboBonus}`);
    return `+${b.total}점 (${parts.join(' · ')})`;
}

function showFeedback(isCorrect, timedOut, breakdown, streak, explanation) {
    document.getElementById('feedbackIcon').className = `feedback-icon ${isCorrect ? 'correct' : 'incorrect'}`;
    document.getElementById('feedbackTitle').textContent =
        isCorrect ? '정답입니다!' : (timedOut ? '시간 초과!' : '틀렸습니다');

    let scoreText = formatBreakdown(breakdown);
    if (isCorrect && streak >= 2) scoreText += ` · 🔥 ${streak}연속`;
    document.getElementById('feedbackScore').textContent = scoreText;
    document.getElementById('feedbackExplanation').textContent = explanation;

    feedbackModal.classList.add('show');
    nextBtn.focus(); // 키보드/스크린리더 사용자가 바로 다음 문제로 넘어갈 수 있도록
}

function nextQuestion() {
    if (!feedbackModal.classList.contains('show')) return; // 중복 호출 방지
    nextBtn.blur();
    feedbackModal.classList.remove('show');
    gameState.currentQuestionIndex++;

    if (gameState.currentQuestionIndex < activeQuestions.length) {
        loadQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    questionTimer.stop();
    const results = scoreManager.getResults(activeQuestions.length);
    lastResult = saveResult(results);
    playSound('finish');
    showScreen(resultScreen);
    displayResults(results);
}

// 순위/신기록 비교 범위: 카테고리 도전은 카테고리별, 나머지는 모드별
function getRecordScope() {
    return gameState.mode === 'category'
        ? { mode: 'category', category: gameState.selectedCategory }
        : { mode: gameState.mode };
}

// 게임 결과를 저장하고, 신기록/순위 정보를 계산해 반환
function saveResult(results) {
    const scope = getRecordScope();
    const previousCount = dataManager.filterHistory(scope).length;
    const previousBest = dataManager.getBestScore(scope);

    const entry = dataManager.saveGameResult({
        mode: gameState.mode,
        category: gameState.selectedCategory,
        difficulty: gameState.difficulty,
        name: settings.nickname || '익명',
        totalScore: results.totalScore,
        correctAnswers: results.correctAnswers,
        totalQuestions: results.totalQuestions,
        accuracy: results.accuracy,
        averageResponseTime: results.averageResponseTime,
        longestStreak: results.longestStreak,
        hintsUsed: results.hintsUsed,
        categoryStats: results.categoryStats
    });

    return {
        entry,
        scope,
        isFirst: previousCount === 0,
        isNewBest: previousCount > 0 && results.totalScore > previousBest,
        previousBest,
        rank: dataManager.getRank(entry.id, { period: 'allTime', ...scope })
    };
}

// ---------- 힌트 ----------

function updateHintButton() {
    document.getElementById('hintsLeft').textContent = gameState.hintsLeft;
    hintBtn.disabled =
        gameState.hintsLeft <= 0 || gameState.hintUsedThisQuestion || gameState.isAnswered || gameState.isPaused;
}

// 오답 2개 제거
function useHint() {
    if (!quizScreen.classList.contains('active')) return;
    if (gameState.isAnswered || gameState.isPaused) return;
    if (gameState.hintsLeft <= 0 || gameState.hintUsedThisQuestion) return;

    const question = activeQuestions[gameState.currentQuestionIndex];
    const buttons = [...document.querySelectorAll('.option-btn')];
    const wrongIndexes = buttons
        .map((_, i) => i)
        .filter(i => i !== question.correctAnswer && !buttons[i].disabled);

    shuffle(wrongIndexes).slice(0, 2).forEach(i => {
        buttons[i].disabled = true;
        buttons[i].classList.add('eliminated');
    });

    gameState.hintsLeft--;
    gameState.hintUsedThisQuestion = true;
    updateHintButton();
}

// ---------- 일시정지 ----------

function setPaused(paused) {
    gameState.isPaused = paused;
    pauseOverlay.hidden = !paused;
    quizScreen.classList.toggle('paused', paused);
    pauseBtn.textContent = paused ? '▶ 계속하기' : '⏸ 일시정지';
    updateHintButton();
}

function pauseGame() {
    if (!quizScreen.classList.contains('active') || gameState.isAnswered || gameState.isPaused) return;
    questionTimer.pause();
    setPaused(true);
}

function resumeGame() {
    if (!gameState.isPaused) return;
    setPaused(false);
    questionTimer.resume();
}

function togglePause() {
    if (gameState.isPaused) resumeGame();
    else pauseGame();
}

function quitGame() {
    clearTimeout(gameState.feedbackTimeoutId);
    questionTimer.stop();
    setPaused(false);
    feedbackModal.classList.remove('show');
    quizScreen.classList.remove('active');
    showModeSelect();
    startScreen.classList.add('active');
}

// ---------- 결과 ----------

function displayResults(results = scoreManager.getResults(activeQuestions.length)) {
    shareStatus.textContent = '';
    renderResultBadges();

    document.getElementById('resultMode').textContent =
        gameState.selectedCategory
            ? `${gameState.modeConfig.label} · ${gameState.selectedCategory}`
            : gameState.modeConfig.label;
    document.getElementById('finalScore').textContent = results.totalScore;
    document.getElementById('correctCount').textContent = `${results.correctAnswers} / ${results.totalQuestions}`;
    document.getElementById('accuracyRate').textContent = `${results.accuracy}%`;
    document.getElementById('avgTime').textContent = `${results.averageResponseTime}초`;
    document.getElementById('longestStreak').textContent = `${results.longestStreak}연속`;
    document.getElementById('hintsUsed').textContent = `${results.hintsUsed} / ${HINTS_PER_GAME}`;

    const categoryResults = document.getElementById('categoryResults');
    categoryResults.innerHTML = '';

    for (const category of CATEGORIES) {
        const stats = results.categoryStats[category];
        if (!stats || stats.total === 0) continue;

        const row = document.createElement('div');
        row.className = 'category-result';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'category-name';
        nameSpan.textContent = category;

        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'category-score';
        const pct = Math.round((stats.correct / stats.total) * 100);
        scoreSpan.textContent = `${stats.correct} / ${stats.total} (${pct}%)`;

        row.appendChild(nameSpan);
        row.appendChild(scoreSpan);
        categoryResults.appendChild(row);
    }
}

function renderResultBadges() {
    const box = document.getElementById('resultBadges');
    box.replaceChildren();
    document.getElementById('storageNotice').hidden = dataManager.persistent;
    if (!lastResult) return;

    const addBadge = (text, className) => {
        const badge = document.createElement('span');
        badge.className = `result-badge ${className}`;
        badge.textContent = text;
        box.appendChild(badge);
    };

    if (lastResult.isFirst) addBadge('🎉 첫 기록!', 'badge-first');
    if (lastResult.isNewBest) addBadge(`🏆 개인 최고 기록! (이전 ${lastResult.previousBest}점)`, 'badge-best');
    if (lastResult.rank) {
        const { mode, category } = lastResult.scope;
        addBadge(`🏅 ${modeTitle(mode, category)} 순위 ${lastResult.rank.rank}위 / ${lastResult.rank.total}회`, 'badge-rank');
    }
}

// ---------- 결과 공유 ----------

function buildShareText() {
    const e = lastResult && lastResult.entry;
    if (!e) return '';
    const diff = DIFFICULTY_LABELS[e.difficulty] || DIFFICULTY_LABELS.all;
    return [
        `🎯 퀴즈 게임 · ${modeTitle(e.mode, e.category)} (난이도 ${diff})`,
        `점수 ${e.totalScore}점 · 정답 ${e.correctAnswers}/${e.totalQuestions} (${e.accuracy}%)`,
        `최장 연속 정답 ${e.longestStreak} · 평균 응답 ${e.averageResponseTime}초`
    ].join('\n');
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (e) {
        // file:// 등 보안 컨텍스트가 아닐 때를 위한 대체 방법
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        area.remove();
        return ok;
    }
}

async function shareResult() {
    const text = buildShareText();
    if (!text) return;
    const ok = await copyToClipboard(text);
    shareStatus.textContent = ok ? '결과를 클립보드에 복사했습니다.' : '복사하지 못했습니다. 아래 내용을 직접 복사해 주세요:\n' + text;
}

// ---------- 화면 전환 / 순위표 / 내 기록 ----------

function showScreen(target) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s === target));
}

function openRecordsScreen(target) {
    const current = document.querySelector('.screen.active');
    if (current && current !== target) returnScreen = current;
    showScreen(target);
    window.scrollTo(0, 0);
}

function openLeaderboard() {
    // 방금 끝난 게임에서 열었다면 그 게임의 순위표를 바로 보여준다
    const fromResult = resultScreen.classList.contains('active') && lastResult;
    if (fromResult) {
        const { mode, category } = lastResult.scope;
        if (mode === 'category') setLeaderboardView(category, 'category');
        else setLeaderboardView('allTime', mode);
    } else {
        // 시작 화면에서 열었다면, 기록이 가장 많은 모드부터 보여준다 (빈 화면 방지)
        const byMode = dataManager.getStats().byMode;
        const topMode = Object.keys(byMode).sort((a, b) => byMode[b] - byMode[a])[0];
        if (topMode) setLeaderboardView('allTime', topMode);
    }
    renderLeaderboard(dataManager, fromResult ? lastResult.entry.id : undefined);
    openRecordsScreen(leaderboardScreen);
}

function openDashboard() {
    renderDashboard(dataManager);
    openRecordsScreen(dashboardScreen);
}

function closeRecordsScreen() {
    showScreen(returnScreen || startScreen);
}

// ---------- 설정: 테마 / 효과음 / 닉네임 / 난이도 ----------

function applyTheme() {
    const dark = settings.theme
        ? settings.theme === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    themeToggle.textContent = dark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('aria-label', dark ? '다크 모드 끄기' : '다크 모드 켜기');
}

function applySoundSetting() {
    soundToggle.textContent = settings.sound ? '🔊' : '🔇';
    soundToggle.setAttribute('aria-pressed', String(settings.sound));
    soundToggle.setAttribute('aria-label', settings.sound ? '효과음 끄기' : '효과음 켜기');
}

function applySettingsToUI() {
    applyTheme();
    applySoundSetting();
    nicknameInput.value = settings.nickname;
    difficultySelect.value = settings.difficulty;
}

// ---------- 효과음 (Web Audio, 기본 꺼짐) ----------

let audioCtx = null;

function playTone(frequency, startOffset, duration, type = 'sine', volume = 0.12) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const start = audioCtx.currentTime + startOffset;
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + duration);
}

function playSound(kind) {
    if (!settings.sound) return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        if (kind === 'correct') {
            playTone(660, 0, 0.12);
            playTone(880, 0.1, 0.18);
        } else if (kind === 'wrong') {
            playTone(220, 0, 0.25, 'sawtooth', 0.08);
        } else if (kind === 'finish') {
            [523, 659, 784, 1047].forEach((f, i) => playTone(f, i * 0.12, 0.22));
        } else {
            playTone(740, 0, 0.1); // 설정 확인음
        }
    } catch (e) { /* 오디오를 쓸 수 없는 환경이면 조용히 무시 */ }
}

function updateProgress() {
    const current = gameState.currentQuestionIndex + 1;
    const total = activeQuestions.length;

    document.getElementById('currentQuestion').textContent = current;
    document.getElementById('totalQuestions').textContent = total;
    document.getElementById('currentScore').textContent = scoreManager.totalScore;

    const streak = scoreManager.consecutiveCorrect;
    comboBadge.hidden = streak < 2;
    comboBadge.textContent = `🔥 ${streak}연속`;

    document.getElementById('progressFill').style.width = `${(current / total) * 100}%`;
}

// ---------- 시작 화면 ----------

function showCategorySelect() {
    modeSelect.hidden = true;
    categorySelect.hidden = false;
    startSubtitle.textContent = '카테고리를 선택하면 10문제가 출제됩니다';
}

function showModeSelect() {
    modeSelect.hidden = false;
    categorySelect.hidden = true;
    startSubtitle.textContent = '게임 모드를 선택하세요';
}

function restartGame() {
    resultScreen.classList.remove('active');
    showModeSelect();
    startScreen.classList.add('active');
}

// ---------- 이벤트 리스너 ----------

modeCards.forEach(card => {
    card.addEventListener('click', () => {
        const mode = card.dataset.mode;
        if (mode === 'category') showCategorySelect();
        else initGame(mode);
    });
});

categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => initGame('category', btn.dataset.category));
});

backToModesBtn.addEventListener('click', showModeSelect);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartGame);
hintBtn.addEventListener('click', useHint);
pauseBtn.addEventListener('click', togglePause);
resumeBtn.addEventListener('click', resumeGame);
quitBtn.addEventListener('click', quitGame);

document.getElementById('openLeaderboardBtn').addEventListener('click', openLeaderboard);
document.getElementById('openDashboardBtn').addEventListener('click', openDashboard);
document.getElementById('resultLeaderboardBtn').addEventListener('click', openLeaderboard);
document.getElementById('resultDashboardBtn').addEventListener('click', openDashboard);
document.getElementById('shareBtn').addEventListener('click', shareResult);
document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click', closeRecordsScreen));

document.getElementById('trendMode').addEventListener('change', (e) => renderTrendChart(dataManager, e.target.value));
document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    if (!confirm('저장된 모든 플레이 기록(순위표, 통계 포함)을 삭제합니다. 계속할까요?')) return;
    dataManager.clearHistory();
    renderDashboard(dataManager);
});

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    settings = dataManager.saveSettings({ theme: isDark ? 'light' : 'dark' });
    applyTheme();
});

soundToggle.addEventListener('click', () => {
    settings = dataManager.saveSettings({ sound: !settings.sound });
    applySoundSetting();
    playSound('confirm');
});

nicknameInput.addEventListener('input', () => {
    settings = dataManager.saveSettings({ nickname: nicknameInput.value.trim().slice(0, 12) });
});

difficultySelect.addEventListener('change', () => {
    settings = dataManager.saveSettings({ difficulty: difficultySelect.value });
});

// 탭을 벗어나면 자동 일시정지
document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseGame();
});

// 키보드 단축키: 1~4 선택, H 힌트, P 일시정지, Enter 다음 문제
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    // 순위표/내 기록 화면에서 Esc로 돌아가기
    if (e.key === 'Escape' && (leaderboardScreen.classList.contains('active') || dashboardScreen.classList.contains('active'))) {
        closeRecordsScreen();
        return;
    }

    if (feedbackModal.classList.contains('show')) {
        if (e.key === 'Enter') nextQuestion();
        return;
    }

    if (!quizScreen.classList.contains('active')) return;

    if (e.key === 'p' || e.key === 'P') {
        togglePause();
        return;
    }

    if (gameState.isPaused || gameState.isAnswered) return;

    if (e.key === 'h' || e.key === 'H') {
        useHint();
    } else if (e.key >= '1' && e.key <= '4') {
        const button = document.querySelectorAll('.option-btn')[parseInt(e.key) - 1];
        if (button && !button.disabled) handleAnswer(parseInt(e.key) - 1);
    }
});

// ---------- 초기화 ----------

// 브라우저 설정(다크 모드)이 바뀌면, 사용자가 직접 고르지 않은 경우에만 따라간다
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!settings.theme) applyTheme();
});

applySettingsToUI();
initLeaderboardUI(dataManager);
