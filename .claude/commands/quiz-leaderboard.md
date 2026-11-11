---
description: 퀴즈 순위 시스템을 관리합니다 (순위표 조회, 순위 규칙 확인, 순위 로직 검증)
argument-hint: show <기록 JSON 경로> [daily|weekly|allTime] [full|category|speed|카테고리명] | rules | verify
---

퀴즈 게임의 순위 시스템을 관리합니다. 하위 명령은 `$1`로 정합니다. 비어 있거나 지원하지 않는 값이면 위 사용법을 안내하고 멈추세요.

## 전제

- 순위는 **브라우저 `localStorage`의 기록(`gameHistory`)** 으로 계산합니다. Claude는 브라우저 저장소를 직접 읽을 수 없으므로 `show`는 사용자가 내보낸 JSON 파일이 필요합니다. 내보내는 방법은 `/quiz-stats export`를 참고하세요.
- 순위 로직은 `storage.js`의 `LocalDataManager`(`getRankedEntries`, `getLeaderboard`, `getRank`, `compareEntries`)에 있습니다. 규칙을 설명하거나 검증할 때는 **기억이 아니라 파일을 읽어서** 하세요.

## 하위 명령

### `show <기록 JSON 경로> [기간] [모드 또는 카테고리]` — 순위표 조회
- 기간: `daily`(오늘) / `weekly`(최근 7일) / `allTime`(전체). 생략하면 `allTime`.
- 모드: `full`(전체 도전) / `category`(카테고리 도전) / `speed`(스피드 퀴즈). 한글 이름도 받아 영문 값으로 바꿉니다. 생략하면 기록이 가장 많은 모드.
- 카테고리 이름(`한국사`, `세계지리`, `과학`, `예술과 문화`)을 주면 그 카테고리의 카테고리 도전 순위를 보여 줍니다. 이때 기간은 `allTime`입니다. (게임의 카테고리 탭과 같은 동작)
- 경로가 없거나 파일/JSON이 잘못됐으면 그대로 알려 주세요.

아래처럼 `LocalDataManager`로 계산하세요. 인자 값은 상황에 맞게 바꿉니다.

```
node -e "const {LocalDataManager}=require('./storage.js');const data=require('fs').readFileSync(process.argv[1],'utf8');const store={d:{gameHistory:data},getItem(k){return k in this.d?this.d[k]:null},setItem(k,v){this.d[k]=v},removeItem(k){delete this.d[k]}};const m=new LocalDataManager(store);console.log(JSON.stringify(m.getLeaderboard({period:'allTime',mode:'full'}),null,2))" <기록 JSON 경로>
```

결과는 표로 보여 주세요.

| 순위 | 닉네임 | 점수 | 정답 | 정답률 | 난이도 | 일시 |
|---|---|---|---|---|---|---|

- 조회 조건(기간, 모드/카테고리)과 해당 범위의 전체 기록 수를 표 위에 적습니다.
- 기록이 없으면 "해당 범위에 기록이 없습니다"라고만 말하세요.
- 기록의 `timestamp`는 UTC(ISO) 문자열입니다. 표에는 사용자의 현지 시각으로 바꿔 보여 주세요.

### `rules` — 현재 순위 규칙 설명
`storage.js`를 읽고, 코드에 **실제로 있는** 규칙을 정리해 설명하세요. 파일과 줄 번호를 함께 적습니다. 최소한 다음을 포함합니다.

- 정렬 기준과 우선순위 (점수 → 정답률 → 먼저 달성한 기록)
- 표시 인원(`LEADERBOARD_SIZE`)
- 범위(scope) 구분: 기간 정의(오늘은 현지 자정부터, 주간은 최근 7일), 모드별·카테고리별 분리와 그 이유(모드마다 문제 수가 달라 점수 비교 불가)
- 보관 한도(`MAX_HISTORY`)와, 한도를 넘으면 어떤 기록이 지워지는지
- 한계: 이 브라우저의 기록만 집계, 닉네임은 인증되지 않음(동명이인 구분 불가), 기록을 지우면 순위도 사라짐

보관 한도 때문에 **점수와 무관하게 오래된 기록부터 삭제**되어 "전체" 순위가 진짜 전체가 아닐 수 있다는 점을 코드로 확인한 뒤 알려 주세요.

### `verify` — 순위 로직 검증
순위 계산이 규칙대로 동작하는지 테스트하세요. 프로젝트 파일은 건드리지 않고, 스크래치패드에 테스트 스크립트를 만들어 `node`로 실행합니다. 메모리 저장소(위 `store`와 같은 방식)에 가짜 기록을 넣어 확인합니다.

- 점수가 같을 때 정답률 → 먼저 달성한 순으로 정렬되는가
- 11개 이상 기록이 있어도 상위 10개만 나오는가
- 모드가 다른 기록, 카테고리가 다른 기록이 섞이지 않는가
- `daily`/`weekly` 경계가 맞는가 (어제 23시 기록은 오늘 순위에서 제외, 7일을 넘긴 기록은 주간에서 제외)
- `getRank`가 10위 밖의 기록에도 올바른 순위를 돌려주는가
- 기록이 없을 때 빈 배열/0을 돌려주는가

통과/실패를 항목별로 표로 보여 주고, 실패한 항목은 실제 결과와 기대 결과를 함께 적으세요. 실패해도 **사용자가 요청하기 전에는 코드를 수정하지 마세요.**

## 순위 초기화

Claude는 브라우저 저장소를 지울 수 없습니다. 요청받으면 `/quiz-stats reset`과 같이 방법만 안내하세요. (게임의 **내 기록 → 기록 초기화** 버튼, 또는 콘솔에서 `localStorage.removeItem('gameHistory')`) 삭제는 되돌릴 수 없으니 백업(`/quiz-stats export`)을 먼저 권하세요. 삭제했다고 말하지 말고, 사용자가 직접 실행한 뒤 알려 주면 확인하세요.

## 주의

- 이 명령어는 **조회·설명·검증만** 합니다. `storage.js`, `questions.js` 등 프로젝트 파일을 수정하지 마세요.
- 순위를 지어내지 마세요. 기록 파일이 없으면 없다고 말하고 `/quiz-stats export` 절차를 안내하세요.
- 서로 다른 모드의 점수를 한 순위표에 섞지 마세요.
