// 선생님 통계 페이지: 파일 불러오기 + 화면 그리기 (계산은 teacher-stats.js)
(function () {
    const $ = id => document.getElementById(id);
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const modeLabel = m => TEACHER_MODE_LABELS[m] || m;
    const fmt = v => (v === null || v === undefined) ? '–' : v;
    const pct = v => v === null || v === undefined ? '–' : v + '%';

    const state = { students: [], problems: [], mode: 'all', sort: 'avg', tab: 'students', selected: null, sample: false };

    // ---------- 불러오기 ----------
    function addFiles(fileList) {
        const files = Array.from(fileList);
        if (!files.length) return;
        Promise.all(files.map(f => f.text().then(t => ({ name: f.name, text: t }), () => ({ name: f.name, text: null })))).then(list => {
            if (state.sample) { state.students = []; state.problems = []; state.sample = false; }
            for (const { name, text } of list) {
                if (text === null) { state.problems.push(`${name}: 파일을 읽지 못했습니다`); continue; }
                const r = parseStudentFile(name, text);
                if (r.error) { state.problems.push(`${name}: ${r.error}`); continue; }
                if (state.students.some(s => s.file === name)) { state.problems.push(`${name}: 이미 불러온 파일이라 건너뜀`); continue; }
                if (r.skipped) state.problems.push(`${name}: 잘못된 기록 ${r.skipped}건 제외`);
                if (r.otherNames.length) state.problems.push(`${name}: 한 파일에 이름이 여러 개입니다 (${[r.name, ...r.otherNames].join(', ')}) — 여러 학생이 같은 브라우저를 썼을 수 있습니다`);
                if (!r.history.length) { state.problems.push(`${name}: 유효한 기록이 없어 제외`); continue; }
                state.students.push(r);
            }
            // 이름이 같은 학생은 파일 이름을 덧붙여 구분
            const seen = {};
            state.students.forEach(s => { s.label = s.name; seen[s.name] = (seen[s.name] || 0) + 1; });
            state.students.forEach(s => { if (seen[s.name] > 1) s.label = `${s.name} (${s.file})`; });
            state.selected = null;
            render();
        });
    }

    $('file-input').addEventListener('change', e => { addFiles(e.target.files); e.target.value = ''; });
    const drop = $('drop');
    drop.addEventListener('click', () => $('file-input').click());
    drop.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('file-input').click(); } });
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
    drop.addEventListener('drop', e => addFiles(e.dataTransfer.files));

    $('clear-btn').addEventListener('click', () => { state.students = []; state.problems = []; state.selected = null; state.sample = false; render(); });
    $('sample-btn').addEventListener('click', () => { loadSample(); render(); });

    // ---------- 가상 예시 (실제 학생 데이터가 아님) ----------
    function loadSample() {
        const cats = ['한국사', '세계지리', '과학', '예술과 문화'];
        let seed = 7;
        const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
        const people = [['가상학생 A', 0.85], ['가상학생 B', 0.7], ['가상학생 C', 0.55], ['가상학생 D', 0.4]];
        state.students = people.map(([name, skill], i) => {
            const history = [];
            for (let g = 0; g < 8; g++) {
                const mode = ['full', 'category', 'category', 'speed'][g % 4];
                const cat = cats[(g + i) % 4];
                const total = mode === 'full' ? 40 : mode === 'speed' ? 20 : 10;
                const categoryStats = {};
                let correct = 0;
                const pickCats = mode === 'category' ? [cat] : cats;
                pickCats.forEach(c => {
                    const t = Math.round(total / pickCats.length);
                    const p = Math.min(0.98, Math.max(0.1, skill + (c === cats[i % 4] ? -0.25 : 0) + (rnd() - 0.5) * 0.2));
                    const ok = Math.round(t * p);
                    correct += ok;
                    categoryStats[c] = { correct: ok, total: t, accuracy: Math.round(ok / t * 100) };
                });
                const all = Object.values(categoryStats).reduce((a, s) => a + s.total, 0);
                history.push({ id: `s${i}-${g}`, timestamp: new Date(2026, 10, 1 + g, 10 + i).toISOString(), mode, category: mode === 'category' ? cat : null, difficulty: 'all', name, totalScore: correct * 12 + Math.round(rnd() * 10), correctAnswers: correct, totalQuestions: all, accuracy: Math.round(correct / all * 100), averageResponseTime: Math.round((6 + (1 - skill) * 8 + rnd() * 2) * 10) / 10, longestStreak: Math.round(correct * 0.5), hintsUsed: 0, categoryStats });
            }
            return { name, label: name, otherNames: [], file: `(예시) ${name}.json`, history, skipped: 0 };
        });
        state.problems = [];
        state.sample = true;
        state.selected = null;
    }

    // ---------- 계산 ----------
    function rows() {
        const list = state.students.map(s => {
            const sum = summarizeHistory(filterByMode(s.history, state.mode));
            return { s, sum, weak: weakestCategory(sum.categories) };
        }).filter(r => r.sum.count > 0);
        const key = state.sort;
        list.sort((a, b) => key === 'name'
            ? a.s.label.localeCompare(b.s.label, 'ko')
            : (b.sum[key] ?? -1) - (a.sum[key] ?? -1));
        return list;
    }

    // ---------- 그리기 ----------
    function render() {
        const has = state.students.length > 0;
        $('report').hidden = !has;
        $('clear-btn').hidden = !has;
        $('problems').innerHTML = state.problems.map(p => `<li>${esc(p)}</li>`).join('')
            + (state.sample ? '<li class="info">지금 보이는 것은 <strong>가상 예시 데이터</strong>입니다. 실제 학생 기록이 아닙니다.</li>' : '');
        if (!has) return;

        // 모드 선택지: 데이터에 있는 모드만
        const modes = [...new Set(state.students.flatMap(s => s.history.map(h => h.mode)))];
        if (state.mode !== 'all' && !modes.includes(state.mode)) state.mode = 'all';
        $('mode-select').innerHTML = `<option value="all">전체 모드</option>` + modes.map(m => `<option value="${esc(m)}">${esc(modeLabel(m))}</option>`).join('');
        $('mode-select').value = state.mode;
        $('sort-select').value = state.sort;
        $('mode-note').textContent = state.mode === 'all'
            ? '※ 모드마다 문제 수가 달라 점수를 직접 비교하기 어렵습니다. 점수 비교는 모드를 하나 골라서 보세요. (정답률은 모드와 상관없이 비교 가능)'
            : `${modeLabel(state.mode)} 기록만 집계합니다.`;

        const list = rows();
        renderTiles(list);
        renderTable(list);
        renderDetail();
    }

    function renderTiles(list) {
        const plays = list.reduce((a, r) => a + r.sum.count, 0);
        const acc = (() => {
            let c = 0, t = 0;
            list.forEach(r => state.students.find(s => s === r.s).history.forEach(h => { if (state.mode === 'all' || h.mode === state.mode) { c += h.correctAnswers || 0; t += h.totalQuestions || 0; } }));
            return t ? Math.round(c / t * 100) : null;
        })();
        const top = list.length ? list.slice().sort((a, b) => (b.sum.best ?? -1) - (a.sum.best ?? -1))[0] : null;
        $('tiles').innerHTML = [
            ['학생 수', list.length + '명'],
            ['총 플레이', plays + '회'],
            ['학급 정답률', pct(acc)],
            ['최고 점수', top ? `${top.sum.best}점 <small>${esc(top.s.label)}</small>` : '–']
        ].map(([k, v]) => `<div class="tile"><span>${k}</span><strong>${v}</strong></div>`).join('');
    }

    function renderTable(list) {
        if (!list.length) { $('table-area').innerHTML = '<p class="empty">이 모드로 플레이한 학생이 없습니다.</p>'; return; }
        if (state.tab === 'students') {
            $('table-area').innerHTML = `<table>
                <thead><tr><th>학생</th><th class="n">플레이</th><th class="n">평균 점수</th><th class="n">최고</th><th class="n">최저</th><th class="n">정답률</th><th class="n">평균 응답(초)</th><th>약한 분야</th></tr></thead>
                <tbody>${list.map(r => `<tr data-i="${state.students.indexOf(r.s)}" tabindex="0" class="${state.selected === state.students.indexOf(r.s) ? 'sel' : ''}">
                    <th scope="row">${esc(r.s.label)}</th><td class="n">${r.sum.count}</td><td class="n">${fmt(r.sum.avg)}</td>
                    <td class="n best">${fmt(r.sum.best)}</td><td class="n worst">${fmt(r.sum.worst)}</td>
                    <td class="n">${bar(r.sum.accuracy)}</td><td class="n">${fmt(r.sum.avgTime)}</td>
                    <td>${r.weak ? `${esc(r.weak.name)} (${r.weak.accuracy}%)` : '<span class="muted">표본 부족</span>'}</td></tr>`).join('')}</tbody></table>
                <p class="hint">행을 클릭하면 학생별 상세(분야별 성적·점수 추이·최근 기록)가 아래에 나옵니다.</p>`;
        } else {
            const cats = [...new Set(list.flatMap(r => Object.keys(r.sum.categories)))].sort((a, b) => a.localeCompare(b, 'ko'));
            const avgRow = cats.map(c => {
                let cc = 0, t = 0;
                list.forEach(r => { const x = r.sum.categories[c]; if (x) { cc += x.correct; t += x.total; } });
                return t ? Math.round(cc / t * 100) : null;
            });
            $('table-area').innerHTML = `<table class="heat">
                <caption>분야별 정답률 (괄호: 카테고리 도전 모드의 평균 점수 · 플레이 수)</caption>
                <thead><tr><th>학생</th>${cats.map(c => `<th class="n">${esc(c)}</th>`).join('')}</tr></thead>
                <tbody>${list.map(r => `<tr data-i="${state.students.indexOf(r.s)}" tabindex="0"><th scope="row">${esc(r.s.label)}</th>${cats.map(c => cell(r.sum.categories[c])).join('')}</tr>`).join('')}</tbody>
                <tfoot><tr><th scope="row">학급 평균</th>${avgRow.map(v => `<td class="n"><strong>${pct(v)}</strong></td>`).join('')}</tr></tfoot></table>`;
        }
    }

    function cell(c) {
        if (!c || c.accuracy === null) return '<td class="n muted">–</td>';
        const level = c.accuracy >= 80 ? 'good' : c.accuracy >= 60 ? 'mid' : 'low';
        const score = c.avgScore !== null ? ` <small>(${c.avgScore}점·${c.plays}회)</small>` : '';
        return `<td class="n heat-${level}">${c.accuracy}%${score}</td>`;
    }

    function bar(v) {
        if (v === null) return '–';
        const level = v >= 80 ? 'good' : v >= 60 ? 'mid' : 'low';
        return `<span class="bar"><i class="${level}" style="width:${v}%"></i></span> ${v}%`;
    }

    function renderDetail() {
        const box = $('detail');
        const s = state.students[state.selected];
        if (!s) { box.hidden = true; return; }
        const hist = filterByMode(s.history, state.mode);
        const sum = summarizeHistory(hist);
        if (!sum.count) { box.hidden = true; return; }
        const cats = Object.entries(sum.categories).sort((a, b) => a[0].localeCompare(b[0], 'ko'));
        const recent = hist.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
        const modeRows = Object.entries(sum.modes);
        box.hidden = false;
        box.innerHTML = `
            <div class="detail-head"><h2>${esc(s.label)} 학생 상세</h2><button class="btn ghost" id="close-detail" type="button">닫기</button></div>
            <div class="tiles small">
                ${[['플레이', sum.count + '회'], ['평균 점수', fmt(sum.avg)], ['최고 점수', fmt(sum.best)], ['최저 점수', fmt(sum.worst)], ['정답률', pct(sum.accuracy)], ['최장 연속 정답', sum.longestStreak]]
                    .map(([k, v]) => `<div class="tile"><span>${k}</span><strong>${v}</strong></div>`).join('')}
            </div>
            <h3>모드별 점수</h3>
            <table><thead><tr><th>모드</th><th class="n">횟수</th><th class="n">평균</th><th class="n">최고</th><th class="n">최저</th></tr></thead>
            <tbody>${modeRows.map(([m, x]) => `<tr><th scope="row">${esc(modeLabel(m))}</th><td class="n">${x.count}</td><td class="n">${x.avg}</td><td class="n best">${x.best}</td><td class="n worst">${x.worst}</td></tr>`).join('')}</tbody></table>
            <h3>분야별 성적</h3>
            <table><thead><tr><th>분야</th><th class="n">푼 문제</th><th class="n">정답률</th><th class="n">평균 점수<br><small>카테고리 도전</small></th></tr></thead>
            <tbody>${cats.length ? cats.map(([c, x]) => `<tr><th scope="row">${esc(c)}</th><td class="n">${x.total}</td><td class="n">${bar(x.accuracy)}</td><td class="n">${x.avgScore !== null ? `${x.avgScore}점 <small>(${x.plays}회)</small>` : '<span class="muted">–</span>'}</td></tr>`).join('') : '<tr><td colspan="4" class="muted">분야별 기록이 없습니다.</td></tr>'}</tbody></table>
            <h3>점수 추이</h3>${trend(hist)}
            <h3>최근 기록</h3>
            <table><thead><tr><th>날짜</th><th>모드</th><th class="n">점수</th><th class="n">정답</th><th class="n">정답률</th></tr></thead>
            <tbody>${recent.map(h => `<tr><td>${esc(new Date(h.timestamp).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }))}</td><td>${esc(modeLabel(h.mode))}${h.category ? ' · ' + esc(h.category) : ''}</td><td class="n">${h.totalScore}</td><td class="n">${h.correctAnswers ?? '–'}/${h.totalQuestions ?? '–'}</td><td class="n">${pct(h.accuracy ?? null)}</td></tr>`).join('')}</tbody></table>`;
        $('close-detail').addEventListener('click', () => { state.selected = null; render(); });
    }

    // 점수 추이 (시간순). 모드가 섞이면 점수 비교가 어려워 경고
    function trend(hist) {
        const pts = hist.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).slice(-20);
        if (pts.length < 2) return '<p class="muted">추이를 보려면 기록이 2건 이상 필요합니다.</p>';
        const W = 560, H = 160, P = 28;
        const max = Math.max(...pts.map(p => p.totalScore)), min = Math.min(...pts.map(p => p.totalScore));
        const span = max - min || 1;
        const xy = pts.map((p, i) => [P + i * (W - 2 * P) / (pts.length - 1), H - P - (p.totalScore - min) / span * (H - 2 * P)]);
        const mixed = new Set(pts.map(p => p.mode)).size > 1;
        return `<svg class="trend" viewBox="0 0 ${W} ${H}" role="img" aria-label="최근 ${pts.length}회 점수 추이, ${min}점에서 ${max}점 사이">
            <polyline fill="none" stroke="currentColor" stroke-width="2" points="${xy.map(p => p.join(',')).join(' ')}"/>
            ${xy.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="4"><title>${pts[i].totalScore}점 (${esc(modeLabel(pts[i].mode))})</title></circle>`).join('')}
            <text x="${P}" y="14" class="axis">최고 ${max}</text><text x="${P}" y="${H - 6}" class="axis">최저 ${min}</text></svg>
            ${mixed ? '<p class="muted">※ 여러 모드가 섞여 있어 점수 높낮이가 실력 변화가 아닐 수 있습니다. 위에서 모드를 하나 골라 보세요.</p>' : ''}`;
    }

    // ---------- 이벤트 ----------
    $('mode-select').addEventListener('change', e => { state.mode = e.target.value; render(); });
    $('sort-select').addEventListener('change', e => { state.sort = e.target.value; render(); });
    document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
        state.tab = b.dataset.tab;
        document.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', String(x === b)));
        render();
    }));
    function pick(e) {
        const tr = e.target.closest('tr[data-i]');
        if (!tr) return;
        state.selected = Number(tr.dataset.i);
        render();
        $('detail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    $('table-area').addEventListener('click', pick);
    $('table-area').addEventListener('keydown', e => { if (e.key === 'Enter') pick(e); });

    render();
})();
