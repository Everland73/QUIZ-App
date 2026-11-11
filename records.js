// 순위표 / 개인 대시보드 화면 렌더링 (데이터는 LocalDataManager에서 가져옴)
// 의존: scoreManager.js의 gameModes, script.js의 CATEGORIES (호출 시점에 참조)

const DIFFICULTY_LABELS = { all: '혼합', easy: '쉬움', medium: '보통', hard: '어려움' };
const RANK_MEDALS = ['🥇', '🥈', '🥉'];

const LEADERBOARD_PERIODS = [
    { key: 'daily', label: '오늘' },
    { key: 'weekly', label: '최근 7일' },
    { key: 'allTime', label: '전체' }
];

// 현재 순위표 보기 상태 (탭, 게임 모드)
const leaderboardView = { tab: 'allTime', mode: 'full' };
let leaderboardTabButtons = [];

function createEl(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function createSvgEl(tag, attrs = {}) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
}

function formatDateTime(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const p = n => String(n).padStart(2, '0');
    return `${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function modeTitle(mode, category) {
    const label = gameModes[mode] ? gameModes[mode].label : mode;
    return category ? `${label} · ${category}` : label;
}

// ---------- 순위표 ----------

function getLeaderboardTabs() {
    return [...LEADERBOARD_PERIODS, ...CATEGORIES.map(c => ({ key: c, label: c, category: c }))];
}

function initLeaderboardUI(dm) {
    const tabList = document.getElementById('leaderboardTabs');
    const modeSelect = document.getElementById('leaderboardMode');
    const tabs = getLeaderboardTabs();

    tabList.replaceChildren();
    leaderboardTabButtons = tabs.map((tab, i) => {
        const btn = createEl('button', 'tab', tab.label);
        btn.type = 'button';
        btn.id = `leaderboardTab${i}`;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-controls', 'leaderboardPanel');
        btn.addEventListener('click', () => {
            leaderboardView.tab = tab.key;
            renderLeaderboard(dm);
        });
        tabList.appendChild(btn);
        return btn;
    });

    // 좌우 방향키로 탭 이동
    tabList.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
        const current = leaderboardTabButtons.indexOf(document.activeElement);
        if (current === -1) return;
        let next = current;
        if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
        if (e.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = tabs.length - 1;
        e.preventDefault();
        leaderboardView.tab = tabs[next].key;
        renderLeaderboard(dm);
        leaderboardTabButtons[next].focus();
    });

    modeSelect.replaceChildren();
    for (const [key, cfg] of Object.entries(gameModes)) {
        const opt = createEl('option', '', cfg.label);
        opt.value = key;
        modeSelect.appendChild(opt);
    }
    modeSelect.addEventListener('change', () => {
        leaderboardView.mode = modeSelect.value;
        renderLeaderboard(dm);
    });
}

// 순위표 보기 상태를 설정 (방금 끝난 게임의 순위를 바로 보여줄 때 사용)
function setLeaderboardView(tab, mode) {
    leaderboardView.tab = tab;
    if (mode) leaderboardView.mode = mode;
}

function renderLeaderboard(dm, highlightId) {
    const tabs = getLeaderboardTabs();
    const activeIndex = Math.max(0, tabs.findIndex(t => t.key === leaderboardView.tab));
    const tab = tabs[activeIndex];

    leaderboardTabButtons.forEach((btn, i) => {
        const selected = i === activeIndex;
        btn.classList.toggle('active', selected);
        btn.setAttribute('aria-selected', String(selected));
        btn.tabIndex = selected ? 0 : -1;
    });

    const modeSelect = document.getElementById('leaderboardMode');
    modeSelect.value = leaderboardView.mode;
    document.getElementById('leaderboardModeRow').hidden = Boolean(tab.category);

    const panel = document.getElementById('leaderboardPanel');
    panel.setAttribute('aria-labelledby', `leaderboardTab${activeIndex}`);

    const scope = tab.category
        ? { period: 'allTime', mode: 'category', category: tab.category }
        : { period: tab.key, mode: leaderboardView.mode };
    const entries = dm.getLeaderboard(scope);

    const caption = tab.category
        ? `${modeTitle('category', tab.category)} 상위 ${LEADERBOARD_SIZE}`
        : `${modeTitle(scope.mode)} · ${tab.label} 상위 ${LEADERBOARD_SIZE}`;
    document.getElementById('leaderboardCaption').textContent = caption;

    const list = document.getElementById('leaderboardList');
    list.replaceChildren();

    entries.forEach((entry, i) => {
        const row = createEl('li', 'rank-row');
        if (entry.id === highlightId) row.classList.add('mine');

        row.appendChild(createEl('span', 'rank-pos', RANK_MEDALS[i] || String(i + 1)));

        const name = createEl('span', 'rank-name', entry.name || '익명');
        if (entry.id === highlightId) name.appendChild(createEl('span', 'rank-tag', 'NEW'));
        row.appendChild(name);

        row.appendChild(createEl('span', 'rank-score', `${entry.totalScore}점`));

        const diff = DIFFICULTY_LABELS[entry.difficulty] || DIFFICULTY_LABELS.all;
        row.appendChild(createEl('span', 'rank-meta',
            `정답 ${entry.correctAnswers}/${entry.totalQuestions} (${entry.accuracy}%) · 난이도 ${diff} · ${formatDateTime(entry.timestamp)}`));

        list.appendChild(row);
    });

    document.getElementById('leaderboardEmpty').hidden = entries.length > 0;
}

// ---------- 개인 대시보드 ----------

function renderDashboard(dm) {
    const stats = dm.getStats();
    const hasRecords = stats.playCount > 0;
    document.getElementById('dashboardEmpty').hidden = hasRecords;
    document.getElementById('dashboardBody').hidden = !hasRecords;
    if (!hasRecords) return;

    // 요약 카드
    const summary = document.getElementById('dashboardSummary');
    summary.replaceChildren();
    const cards = [
        [`${stats.playCount}회`, '플레이 횟수'],
        [`${stats.accuracy}%`, '전체 정답률'],
        [`${stats.longestStreak}연속`, '최장 연속 정답'],
        [`${stats.averageResponseTime}초`, '평균 응답 시간']
    ];
    for (const [value, label] of cards) {
        const card = createEl('div', 'stat-card');
        card.appendChild(createEl('div', 'stat-value', value));
        card.appendChild(createEl('div', 'stat-label', label));
        summary.appendChild(card);
    }

    // 개인 최고 기록
    const best = document.getElementById('dashboardBest');
    best.replaceChildren();
    const bestRows = [
        { label: modeTitle('full'), filter: { mode: 'full' } },
        { label: modeTitle('speed'), filter: { mode: 'speed' } },
        ...CATEGORIES.map(c => ({ label: modeTitle('category', c), filter: { mode: 'category', category: c } }))
    ];
    for (const { label, filter } of bestRows) {
        const played = dm.filterHistory(filter).length;
        const row = createEl('div', 'category-result');
        row.appendChild(createEl('span', 'category-name', label));
        row.appendChild(createEl('span', 'category-score',
            played > 0 ? `${dm.getBestScore(filter)}점 (${played}회)` : '기록 없음'));
        best.appendChild(row);
    }

    // 카테고리별 정답률
    const catBox = document.getElementById('dashboardCategories');
    catBox.replaceChildren();
    for (const category of CATEGORIES) {
        const s = stats.byCategory[category];
        const row = createEl('div', 'bar-row');
        row.appendChild(createEl('span', 'bar-label', category));

        const track = createEl('div', 'bar-track');
        track.setAttribute('role', 'progressbar');
        track.setAttribute('aria-label', `${category} 정답률`);
        track.setAttribute('aria-valuemin', '0');
        track.setAttribute('aria-valuemax', '100');
        track.setAttribute('aria-valuenow', String(s ? s.accuracy : 0));
        const fill = createEl('div', 'bar-fill');
        fill.style.width = `${s ? s.accuracy : 0}%`;
        track.appendChild(fill);
        row.appendChild(track);

        row.appendChild(createEl('span', 'bar-value',
            s ? `${s.accuracy}% (${s.correct}/${s.total})` : '기록 없음'));
        catBox.appendChild(row);
    }

    // 점수 추이: 모드별로 문제 수가 달라 모드를 골라 본다 (가장 많이 한 모드가 기본)
    const trendSelect = document.getElementById('trendMode');
    const previous = trendSelect.value;
    trendSelect.replaceChildren();
    let topMode = null;
    for (const key of Object.keys(gameModes)) {
        const count = stats.byMode[key] || 0;
        const opt = createEl('option', '', `${gameModes[key].label} (${count}회)`);
        opt.value = key;
        trendSelect.appendChild(opt);
        if (count > 0 && (topMode === null || count > (stats.byMode[topMode] || 0))) topMode = key;
    }
    trendSelect.value = (previous && trendSelect.querySelector(`option[value="${previous}"]`)) ? previous : (topMode || 'full');
    renderTrendChart(dm, trendSelect.value);

    // 최근 플레이
    const recent = document.getElementById('dashboardRecent');
    recent.replaceChildren();
    const latest = dm.getGameHistory()
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
    for (const h of latest) {
        const li = createEl('li', 'recent-row');
        li.appendChild(createEl('span', 'recent-date', formatDateTime(h.timestamp)));
        li.appendChild(createEl('span', 'recent-mode', modeTitle(h.mode, h.category)));
        li.appendChild(createEl('span', 'recent-score', `${h.totalScore}점`));
        li.appendChild(createEl('span', 'recent-detail', `${h.correctAnswers}/${h.totalQuestions}`));
        recent.appendChild(li);
    }
}

function renderTrendChart(dm, mode) {
    const container = document.getElementById('trendChart');
    container.replaceChildren();

    const trend = dm.getScoreTrend({ mode, limit: 20 });
    if (trend.length < 2) {
        container.appendChild(createEl('p', 'empty-note',
            '이 모드를 2회 이상 플레이하면 점수 추이 그래프가 표시됩니다.'));
        return;
    }

    const W = 600, H = 240;
    const pad = { l: 44, r: 16, t: 16, b: 32 };
    const maxScore = Math.max(...trend.map(t => t.score), 10);
    const step = Math.ceil(maxScore / 4 / 5) * 5;   // 눈금 간격 (5의 배수)
    const yMax = step * 4;
    const x = i => pad.l + (i * (W - pad.l - pad.r)) / (trend.length - 1);
    const y = v => pad.t + (1 - v / yMax) * (H - pad.t - pad.b);

    const svg = createSvgEl('svg', {
        viewBox: `0 0 ${W} ${H}`,
        role: 'img',
        'aria-label': `최근 ${trend.length}회 점수 추이. 처음 ${trend[0].score}점, 마지막 ${trend[trend.length - 1].score}점`
    });

    for (let g = 0; g <= 4; g++) {
        const value = step * g;
        svg.appendChild(createSvgEl('line', { class: 'chart-grid', x1: pad.l, x2: W - pad.r, y1: y(value), y2: y(value) }));
        const label = createSvgEl('text', { class: 'chart-label', x: pad.l - 8, y: y(value) + 4, 'text-anchor': 'end' });
        label.textContent = String(value);
        svg.appendChild(label);
    }

    const points = trend.map((t, i) => `${x(i)},${y(t.score)}`).join(' ');
    svg.appendChild(createSvgEl('polyline', { class: 'chart-line', points, fill: 'none' }));

    trend.forEach((t, i) => {
        const dot = createSvgEl('circle', { class: 'chart-dot', cx: x(i), cy: y(t.score), r: 4 });
        const title = createSvgEl('title');
        title.textContent = `${formatDateTime(t.timestamp)} · ${t.score}점 (${t.correct}/${t.total})`;
        dot.appendChild(title);
        svg.appendChild(dot);
    });

    const first = createSvgEl('text', { class: 'chart-label', x: pad.l, y: H - 8, 'text-anchor': 'start' });
    first.textContent = formatDateTime(trend[0].timestamp);
    const last = createSvgEl('text', { class: 'chart-label', x: W - pad.r, y: H - 8, 'text-anchor': 'end' });
    last.textContent = formatDateTime(trend[trend.length - 1].timestamp);
    svg.appendChild(first);
    svg.appendChild(last);

    container.appendChild(svg);
}
