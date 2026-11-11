---
description: 선생님 모드 1단계 — 학생별 기록 JSON 폴더를 불러와 파일 상태와 학생 목록을 점검합니다
argument-hint: <학생 기록 JSON 폴더 경로>
---

학생들의 퀴즈 기록 파일을 불러오고 **쓸 수 있는 상태인지 점검**합니다. 폴더 경로는 `$1`입니다. 비어 있으면 사용법(`/teacher-collect <폴더>`)을 안내하고 멈추세요.

## 데이터 약속 (선생님 모드 공통)

- 학생 기록은 각자 브라우저 `localStorage`(키 `gameHistory`)에 있어 Claude가 직접 읽을 수 없습니다. 학생이 `/quiz-stats export` 절차(콘솔에서 `copy(localStorage.getItem('gameHistory'))`)로 내보낸 **학생 1명당 JSON 파일 1개**를 한 폴더에 모아 주세요. 예: `class-3a/민수.json`
- 학생 이름은 기록 안의 `name` 필드(가장 많이 나온 값)를 쓰고, 없으면 파일 이름을 씁니다.
- 선생님 모드의 모든 `teacher-*` 명령은 이 폴더를 **읽기만** 합니다. 학생 파일과 프로젝트 파일을 수정·삭제하지 마세요.
- 학생 이름과 성적은 개인정보입니다. 이 대화 밖(Artifact 게시, 외부 검색, 외부 서비스)으로 보내지 마세요.

## 공통 로더

모든 `teacher-*` 명령은 아래 스크립트를 씁니다. **스크래치패드에 `teacher-load.js`로 저장**하세요(이미 있으면 재사용). 프로젝트에는 만들지 않습니다. `storage.js`의 `LocalDataManager`로 기록을 읽으므로 앱과 같은 규칙(유효하지 않은 기록 제외)이 적용됩니다.

```js
const fs = require('fs'), path = require('path');
function loadClass(dir, root) {
    const { LocalDataManager } = require(path.join(root, 'storage.js'));
    const students = [], problems = [];
    const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.json')).sort();
    if (!files.length) problems.push({ file: dir, reason: 'JSON 파일 없음' });
    for (const f of files) {
        let parsed;
        try { parsed = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); }
        catch (e) { problems.push({ file: f, reason: 'JSON 파싱 실패: ' + e.message }); continue; }
        const arr = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.gameHistory) ? parsed.gameHistory : null);
        if (!arr) { problems.push({ file: f, reason: '기록 배열이 아님' }); continue; }
        const store = { d: { gameHistory: JSON.stringify(arr) }, getItem(k) { return k in this.d ? this.d[k] : null }, setItem(k, v) { this.d[k] = v }, removeItem(k) { delete this.d[k] } };
        const dm = new LocalDataManager(store);
        const history = dm.getGameHistory();
        const skipped = arr.length - history.length;
        const names = {};
        history.forEach(h => { if (h.name) names[h.name] = (names[h.name] || 0) + 1; });
        const top = Object.entries(names).sort((a, b) => b[1] - a[1]);
        students.push({ name: top.length ? top[0][0] : path.basename(f, path.extname(f)), nameSource: top.length ? 'records' : 'filename', otherNames: top.slice(1).map(x => x[0]), file: f, dm, history, skipped });
    }
    const seen = {};
    students.forEach(s => (seen[s.name] = (seen[s.name] || 0) + 1));
    Object.entries(seen).filter(([, n]) => n > 1).forEach(([n]) => problems.push({ file: '-', reason: `이름 중복: ${n}` }));
    return { students, problems };
}
module.exports = { loadClass };
```

사용법: `const {loadClass}=require('<스크래치패드>/teacher-load.js'); const {students,problems}=loadClass('<폴더>','<프로젝트 루트>');` — 각 `student`는 `name`, `file`, `dm`(LocalDataManager), `history`, `skipped`(무시된 잘못된 기록 수)를 가집니다.

## 점검 절차

1. 폴더가 존재하는지 확인합니다. 없으면 그대로 알리고 멈추세요.
2. 로더를 실행해 아래 표를 보여 주세요.

| 파일 | 학생 이름(출처) | 기록 수 | 무시된 기록 | 마지막 플레이 |
|---|---|---|---|---|

3. `problems`(깨진 JSON, 배열 아님, 이름 중복, 파일 없음)를 **그대로** 나열합니다. 한 파일에 서로 다른 `name`이 섞여 있으면(`otherNames`) 여러 학생이 한 브라우저를 썼을 수 있다고 알리세요.
4. 기록이 0건인 학생은 "기록 없음"으로 표시하고, 이후 분석에서 제외한다고 밝히세요.

## 통과 조건

- 정상 파일이 **1개 이상**이고 기록이 있는 학생이 1명 이상. 아니면 "불러온 학생 없음"으로 보고하고 중단하세요.
- 일부 파일만 문제면 정상 파일만으로 진행 가능하다고 알리되, 제외된 파일을 숨기지 마세요.

## 주의

- 기록을 지어내거나 예시 수치를 실제처럼 보여 주지 마세요.
- 기록은 학생당 최대 200건(`MAX_HISTORY`)까지만 남아 있으므로 오래된 기록은 없을 수 있습니다.
