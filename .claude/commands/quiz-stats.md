---
description: 퀴즈 게임의 통계(문제 은행, 플레이어 기록)를 집계하고 기록 내보내기·초기화를 안내합니다
argument-hint: [questions | player <기록 JSON 경로> | export | reset]
---

퀴즈 게임의 통계를 집계하고 관리합니다. 하위 명령은 `$1`로 정합니다. 비어 있으면 `questions`로 처리합니다.

## 데이터가 어디에 있는가

- **문제 은행**: 프로젝트의 `questions.js`. 직접 읽을 수 있습니다.
- **플레이어 기록**: 브라우저의 `localStorage` (키 `gameHistory`, 설정은 `quizSettings`). **Claude는 브라우저 저장소를 직접 읽거나 지울 수 없습니다.** 사용자가 내보낸 JSON 파일이 있어야 집계할 수 있습니다. (`export` 참고)
- 기록 한 건의 필드: `id`, `timestamp`, `mode`, `category`, `difficulty`, `name`, `totalScore`, `correctAnswers`, `totalQuestions`, `accuracy`, `averageResponseTime`, `longestStreak`, `hintsUsed`, `categoryStats`. 정확한 구조와 집계 규칙은 `storage.js`를 읽어 확인하세요.

## 하위 명령

### `questions` — 문제 은행 통계
`questions.js`를 읽어 집계해 표로 보여 주세요. (`node`로 불러와 세면 정확합니다)

- 전체 문제 수, 카테고리별 문제 수
- 난이도(`easy`/`medium`/`hard`)별 문제 수와 비율, 카테고리 × 난이도 표
- 정답 위치(1~4번)별 문제 수
- 카테고리당 20문제 기준(3단계 목표)의 충족 여부

### `player <기록 JSON 경로>` — 플레이어 기록 통계
`$2`의 JSON 파일을 프로젝트의 `LocalDataManager`로 집계하세요. 경로가 없으면 사용법을 안내하고 멈추세요. 파일이 없거나 JSON이 깨졌으면 그대로 알려 주세요.

```
node -e "const {LocalDataManager}=require('./storage.js');const data=require('fs').readFileSync(process.argv[1],'utf8');const store={d:{gameHistory:data},getItem(k){return k in this.d?this.d[k]:null},setItem(k,v){this.d[k]=v},removeItem(k){delete this.d[k]}};const m=new LocalDataManager(store);console.log(JSON.stringify({stats:m.getStats(),trend:m.getScoreTrend({limit:20})},null,2))" <기록 JSON 경로>
```

결과를 아래 항목으로 정리하세요.

- 플레이 횟수, 모드별 횟수
- 전체 정답률, 평균 응답 시간, 최장 연속 정답
- 모드별 최고 점수 (`getBestScore`로 모드·카테고리별 계산)
- 카테고리별 정답률과 **가장 약한 카테고리** (정답률이 가장 낮은 곳. 푼 문제 수가 너무 적으면 표본이 적다고 밝힘)
- 점수 추이: 같은 모드로 4회 이상 플레이했을 때만, 앞쪽 절반과 뒤쪽 절반의 평균 점수를 비교해 향상 여부를 말하세요. 횟수가 부족하면 판단하지 않습니다.

### `export` — 기록 내보내기 안내
Claude가 대신 실행할 수 없으므로 사용자에게 절차를 안내하세요.

1. 게임을 플레이한 **같은 브라우저, 같은 주소**에서 개발자 도구(F12) 콘솔을 엽니다. 저장소는 주소(origin)별로 분리되어 다른 주소에서는 기록이 보이지 않습니다.
2. `copy(localStorage.getItem('gameHistory'))` 를 실행해 클립보드에 복사합니다.
3. 텍스트 파일(예: `gameHistory.json`)로 저장한 뒤 `/quiz-stats player <경로>`로 집계합니다.

### `reset` — 기록 초기화 안내
**삭제는 되돌릴 수 없으므로 먼저 `export`로 백업을 권하세요.** Claude는 브라우저 저장소를 지울 수 없습니다. 다음 방법을 안내만 하세요.

- 게임의 **내 기록 → 기록 초기화** 버튼 (확인 창이 뜸)
- 또는 콘솔에서 `localStorage.removeItem('gameHistory')`

설정(닉네임·난이도·테마, 키 `quizSettings`)은 위 방법으로 지워지지 않습니다. 삭제했다고 말하지 말고, 사용자가 직접 실행한 뒤 알려 주면 확인하세요.

## 주의

- 이 명령어는 **집계와 안내만** 합니다. `questions.js`와 프로젝트 파일은 수정하지 마세요. 임시 파일이 필요하면 스크래치패드(임시 폴더)에 만드세요.
- 기록이 없거나 파일을 받지 못했으면 **없다고 말하세요.** 통계를 지어내거나 예시 수치를 실제처럼 보여 주지 마세요.
- 점수는 모드마다 문제 수가 달라 서로 비교할 수 없습니다. 모드를 섞어 평균 점수를 내지 마세요. (정답률은 비교 가능)
- 지원하지 않는 하위 명령이면 위 사용법을 안내하세요.
