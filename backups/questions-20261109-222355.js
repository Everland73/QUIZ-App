const quizQuestions = [
    // 한국사 (20문제)
    {
        id: 1,
        category: "한국사",
        difficulty: "easy",
        question: "조선을 건국한 왕은 누구인가요?",
        options: ["이성계", "왕건", "이방원", "세종"],
        correctAnswer: 0,
        explanation: "이성계(태조)는 1392년 조선을 건국했습니다."
    },
    {
        id: 2,
        category: "한국사",
        difficulty: "medium",
        question: "한글을 창제한 왕은 누구인가요?",
        options: ["태조", "태종", "세종", "성종"],
        correctAnswer: 2,
        explanation: "세종대왕은 1443년(세종 25년) 한글을 창제하고 1446년에 반포했습니다."
    },
    {
        id: 3,
        category: "한국사",
        difficulty: "medium",
        question: "임진왜란이 일어난 연도는?",
        options: ["1392년", "1592년", "1636년", "1910년"],
        correctAnswer: 1,
        explanation: "임진왜란은 1592년(선조 25년)에 일본의 침략으로 시작되었습니다."
    },
    {
        id: 4,
        category: "한국사",
        difficulty: "hard",
        question: "고려의 수도는 어디였나요?",
        options: ["한양", "평양", "개경", "경주"],
        correctAnswer: 2,
        explanation: "고려의 수도는 개경(현재의 개성)이었습니다."
    },
    {
        id: 5,
        category: "한국사",
        difficulty: "medium",
        question: "3·1 운동이 일어난 연도는?",
        options: ["1910년", "1919년", "1945년", "1950년"],
        correctAnswer: 1,
        explanation: "3·1 운동은 1919년 3월 1일에 일어난 독립운동입니다."
    },
    {
        id: 6,
        category: "한국사",
        difficulty: "easy",
        question: "신라의 삼국통일을 완성한 왕은?",
        options: ["문무왕", "무열왕", "진흥왕", "법흥왕"],
        correctAnswer: 0,
        explanation: "문무왕은 676년 당나라 세력을 몰아내고 삼국통일을 완성했습니다."
    },
    {
        id: 7,
        category: "한국사",
        difficulty: "hard",
        question: "고구려를 건국한 인물은?",
        options: ["온조", "주몽", "박혁거세", "김수로"],
        correctAnswer: 1,
        explanation: "주몽(동명성왕)은 기원전 37년 고구려를 건국했습니다."
    },
    {
        id: 8,
        category: "한국사",
        difficulty: "medium",
        question: "조선시대 4대 사화 중 첫 번째는?",
        options: ["무오사화", "갑자사화", "기묘사화", "을사사화"],
        correctAnswer: 0,
        explanation: "무오사화(1498년)는 연산군 때 일어난 첫 번째 사화입니다."
    },
    {
        id: 9,
        category: "한국사",
        difficulty: "easy",
        question: "대한민국 정부 수립일은?",
        options: ["1945년 8월 15일", "1948년 8월 15일", "1950년 6월 25일", "1953년 7월 27일"],
        correctAnswer: 1,
        explanation: "대한민국 정부는 1948년 8월 15일에 수립되었습니다."
    },
    {
        id: 10,
        category: "한국사",
        difficulty: "medium",
        question: "조선시대 최고 교육기관은?",
        options: ["향교", "서원", "성균관", "서당"],
        correctAnswer: 2,
        explanation: "성균관은 조선시대 최고의 국립 교육기관이었습니다."
    },
    {
        id: 41,
        category: "한국사",
        difficulty: "medium",
        question: "1170년 무신정변 직후, 무신들이 국정을 논의하던 최고 회의기구는?",
        options: ["중방", "정방", "도방", "삼별초"],
        correctAnswer: 0,
        explanation: "중방은 무신정변 직후 무신들이 국정을 논의하던 최고 회의기구였습니다. (이후 최충헌 집권기에는 교정도감이 최고 권력기구가 되었습니다.)"
    },
    {
        id: 42,
        category: "한국사",
        difficulty: "hard",
        question: "조선 후기 실학자 중 '북학의'를 저술한 인물은?",
        options: ["박지원", "박제가", "정약용", "이익"],
        correctAnswer: 1,
        explanation: "박제가는 18세기 후반 실학자로 '북학의(北學議)'를 저술하여 청나라의 선진 문물을 배울 것을 주장했습니다."
    },
    {
        id: 43,
        category: "한국사",
        difficulty: "hard",
        question: "대한민국 임시정부가 처음 수립된 장소는?",
        options: ["베이징", "난징", "충칭", "상하이"],
        correctAnswer: 3,
        explanation: "대한민국 임시정부는 1919년 4월 11일 중국 상하이에서 수립되었습니다. 이후 일제의 탄압을 피해 항저우, 충칭 등으로 이동했습니다."
    },
    {
        id: 44,
        category: "한국사",
        difficulty: "hard",
        question: "조선 후기 세도정치 시대의 '삼정의 문란'에 포함되지 않는 것은?",
        options: ["전정", "군정", "환곡", "공납"],
        correctAnswer: 3,
        explanation: "삼정의 문란은 전정(토지세), 군정(군역), 환곡(곡식 대여·환수 제도)의 폐단을 지칭합니다. 공납은 17세기 대동법 시행으로 대체되어 삼정에 포함되지 않습니다."
    },

    // 세계지리 (20문제)
    {
        id: 11,
        category: "세계지리",
        difficulty: "easy",
        question: "면적 기준으로 세계에서 가장 큰 대륙은?",
        options: ["아프리카", "아시아", "북아메리카", "남극"],
        correctAnswer: 1,
        explanation: "아시아는 약 44,579,000km²로 세계에서 가장 큰 대륙입니다."
    },
    {
        id: 12,
        category: "세계지리",
        difficulty: "medium",
        question: "일반적으로 통용되는 측정 기준(통설)에 따라 세계에서 가장 긴 강은?",
        options: ["아마존강", "나일강", "양쯔강", "미시시피강"],
        correctAnswer: 1,
        explanation: "나일강은 약 6,650km로 통설상 세계에서 가장 긴 강입니다. (아마존강을 더 길게 측정하는 연구도 있으나, 하천 기점 설정에 따라 달라지며 주류 견해는 나일강입니다.)"
    },
    {
        id: 13,
        category: "세계지리",
        difficulty: "easy",
        question: "일본의 수도는?",
        options: ["오사카", "교토", "도쿄", "요코하마"],
        correctAnswer: 2,
        explanation: "도쿄는 일본의 수도이자 최대 도시입니다."
    },
    {
        id: 14,
        category: "세계지리",
        difficulty: "hard",
        question: "세계에서 가장 깊은 해구는?",
        options: ["마리아나 해구", "통가 해구", "필리핀 해구", "푸에르토리코 해구"],
        correctAnswer: 0,
        explanation: "마리아나 해구의 챌린저 해연은 수심 약 10,900~11,000m로 세계에서 가장 깊습니다. (측정 방법에 따라 수치에 차이가 있습니다.)"
    },
    {
        id: 15,
        category: "세계지리",
        difficulty: "medium",
        question: "강수량 기준 사막 정의(극지방 포함)에 따라 면적이 세계에서 가장 큰 사막은?",
        options: ["사하라 사막", "고비 사막", "남극 사막", "아라비아 사막"],
        correctAnswer: 2,
        explanation: "남극 대륙은 강수량이 매우 적은 약 1,400만km²의 극지 사막으로 면적 기준 세계 최대입니다. (열대·아열대 사막 중에서는 사하라 사막이 가장 큽니다.)"
    },
    {
        id: 16,
        category: "세계지리",
        difficulty: "easy",
        question: "프랑스의 수도는?",
        options: ["런던", "베를린", "파리", "로마"],
        correctAnswer: 2,
        explanation: "파리는 프랑스의 수도이자 최대 도시입니다."
    },
    {
        id: 17,
        category: "세계지리",
        difficulty: "medium",
        question: "해발고도 기준으로 세계에서 가장 높은 산은?",
        options: ["K2", "에베레스트", "칸첸중가", "마칼루"],
        correctAnswer: 1,
        explanation: "에베레스트산은 해발 8,848.86m(2020년 네팔·중국 공동 발표)로 해발고도 기준 세계 최고봉입니다."
    },
    {
        id: 18,
        category: "세계지리",
        difficulty: "hard",
        question: "면적 기준으로 세계에서 가장 큰 호수(내륙의 염호 포함)는?",
        options: ["바이칼호", "슈피리어호", "카스피해", "빅토리아호"],
        correctAnswer: 2,
        explanation: "카스피해는 약 371,000km²로 면적 기준 세계 최대의 호수입니다. (이름에 '해'가 붙지만 육지로 둘러싸인 내륙 염호로 분류합니다.)"
    },
    {
        id: 19,
        category: "세계지리",
        difficulty: "easy",
        question: "이탈리아의 수도는?",
        options: ["밀라노", "베네치아", "로마", "나폴리"],
        correctAnswer: 2,
        explanation: "로마는 이탈리아의 수도입니다."
    },
    {
        id: 20,
        category: "세계지리",
        difficulty: "medium",
        question: "면적 기준으로 세계에서 가장 작은 나라는?",
        options: ["모나코", "바티칸", "산마리노", "리히텐슈타인"],
        correctAnswer: 1,
        explanation: "바티칸 시국은 약 0.44km²로 면적 기준 세계에서 가장 작은 나라입니다."
    },

    // 과학 (20문제)
    {
        id: 21,
        category: "과학",
        difficulty: "easy",
        question: "물의 화학식은?",
        options: ["H2O", "CO2", "O2", "H2O2"],
        correctAnswer: 0,
        explanation: "물은 수소 원자 2개와 산소 원자 1개로 이루어진 H2O입니다."
    },
    {
        id: 22,
        category: "과학",
        difficulty: "medium",
        question: "태양계에서 가장 큰 행성은?",
        options: ["토성", "목성", "천왕성", "해왕성"],
        correctAnswer: 1,
        explanation: "목성은 지름이 약 142,984km로 태양계 최대 행성입니다."
    },
    {
        id: 23,
        category: "과학",
        difficulty: "easy",
        question: "진공에서 빛의 속도는 초속 약 몇 km인가요?",
        options: ["30만 km", "100만 km", "3만 km", "1000 km"],
        correctAnswer: 0,
        explanation: "빛의 속도는 진공에서 초속 약 299,792km입니다."
    },
    {
        id: 24,
        category: "과학",
        difficulty: "hard",
        question: "1953년 DNA 이중나선 구조 모형을 제안한 과학자는?",
        options: ["다윈", "아인슈타인", "왓슨과 크릭", "멘델"],
        correctAnswer: 2,
        explanation: "제임스 왓슨과 프랜시스 크릭은 1953년 DNA 이중나선 구조 모형을 제안했습니다. (로절린드 프랭클린 등의 X선 회절 자료가 중요한 단서가 되었습니다.)"
    },
    {
        id: 25,
        category: "과학",
        difficulty: "medium",
        question: "원자번호 1번 원소는?",
        options: ["헬륨", "수소", "리튬", "탄소"],
        correctAnswer: 1,
        explanation: "수소(H)는 원자번호 1번으로 가장 가벼운 원소입니다."
    },
    {
        id: 26,
        category: "과학",
        difficulty: "easy",
        question: "건조 공기 기준으로 지구 대기 중 부피 비율이 가장 큰 기체는?",
        options: ["산소", "이산화탄소", "질소", "수소"],
        correctAnswer: 2,
        explanation: "질소는 대기의 약 78%를 차지합니다."
    },
    {
        id: 27,
        category: "과학",
        difficulty: "medium",
        question: "절대온도 0도는 섭씨 몇 도인가요?",
        options: ["-100°C", "-273.15°C", "-373°C", "0°C"],
        correctAnswer: 1,
        explanation: "절대영도는 -273.15°C로 이론상 도달 가능한 최저 온도입니다."
    },
    {
        id: 28,
        category: "과학",
        difficulty: "hard",
        question: "광합성에서 생성되는 주요 산물은?",
        options: ["이산화탄소와 물", "포도당과 산소", "질소와 수소", "메탄과 산소"],
        correctAnswer: 1,
        explanation: "광합성은 이산화탄소와 물을 이용해 포도당과 산소를 생성합니다."
    },
    {
        id: 29,
        category: "과학",
        difficulty: "easy",
        question: "면적과 무게 기준으로 인체에서 가장 큰 장기(외부 기관 포함)는?",
        options: ["심장", "간", "폐", "피부"],
        correctAnswer: 3,
        explanation: "피부는 인체에서 가장 큰 장기로 체중의 약 15~16%를 차지합니다. (몸속 장기만 놓고 보면 간이 가장 큽니다.)"
    },
    {
        id: 30,
        category: "과학",
        difficulty: "medium",
        question: "상대성 이론을 발표한 과학자는?",
        options: ["뉴턴", "갈릴레이", "아인슈타인", "호킹"],
        correctAnswer: 2,
        explanation: "알베르트 아인슈타인은 1905년 특수상대성이론, 1915년 일반상대성이론을 발표했습니다."
    },

    // 예술과 문화 (20문제)
    {
        id: 31,
        category: "예술과 문화",
        difficulty: "easy",
        question: "'모나리자'를 그린 화가는?",
        options: ["피카소", "고흐", "다빈치", "미켈란젤로"],
        correctAnswer: 2,
        explanation: "레오나르도 다빈치는 1503-1519년경 모나리자를 그렸습니다."
    },
    {
        id: 32,
        category: "예술과 문화",
        difficulty: "medium",
        question: "베토벤의 교향곡은 총 몇 개인가요?",
        options: ["5개", "7개", "9개", "12개"],
        correctAnswer: 2,
        explanation: "루트비히 판 베토벤은 총 9개의 교향곡을 작곡했습니다."
    },
    {
        id: 33,
        category: "예술과 문화",
        difficulty: "easy",
        question: "'해바라기' 연작으로 유명한 화가는?",
        options: ["모네", "고흐", "르누아르", "세잔"],
        correctAnswer: 1,
        explanation: "빈센트 반 고흐는 1888-1889년 해바라기 연작을 그렸습니다."
    },
    {
        id: 34,
        category: "예술과 문화",
        difficulty: "hard",
        question: "'게르니카'를 그린 화가는?",
        options: ["달리", "피카소", "미로", "고야"],
        correctAnswer: 1,
        explanation: "파블로 피카소는 1937년 스페인 내전을 주제로 게르니카를 그렸습니다."
    },
    {
        id: 35,
        category: "예술과 문화",
        difficulty: "medium",
        question: "'로미오와 줄리엣'의 작가는?",
        options: ["괴테", "셰익스피어", "단테", "호메로스"],
        correctAnswer: 1,
        explanation: "윌리엄 셰익스피어는 1595년경 로미오와 줄리엣을 집필했습니다."
    },
    {
        id: 36,
        category: "예술과 문화",
        difficulty: "easy",
        question: "피아노의 건반 수는 일반적으로 몇 개인가요?",
        options: ["52개", "66개", "88개", "100개"],
        correctAnswer: 2,
        explanation: "현대 피아노는 일반적으로 88개의 건반(52개 백건, 36개 흑건)을 가지고 있습니다."
    },
    {
        id: 37,
        category: "예술과 문화",
        difficulty: "medium",
        question: "'생각하는 사람' 조각의 작가는?",
        options: ["로댕", "미켈란젤로", "베르니니", "도나텔로"],
        correctAnswer: 0,
        explanation: "오귀스트 로댕은 1880년대 초 '지옥의 문'의 일부로 '생각하는 사람'을 구상했고, 이후 독립된 조각으로 확대 제작했습니다."
    },
    {
        id: 38,
        category: "예술과 문화",
        difficulty: "hard",
        question: "인상주의 화파의 이름은 어느 작품에서 유래했나요?",
        options: ["수련", "인상, 해돋이", "물랭 루즈", "별이 빛나는 밤"],
        correctAnswer: 1,
        explanation: "클로드 모네의 '인상, 해돋이(1872)'에서 인상주의라는 이름이 유래했습니다."
    },
    {
        id: 39,
        category: "예술과 문화",
        difficulty: "easy",
        question: "한국 전통 음악 전체를 아우르는 총칭은?",
        options: ["가요", "국악", "민요", "판소리"],
        correctAnswer: 1,
        explanation: "국악은 한국의 전통 음악을 총칭하는 말입니다."
    },
    {
        id: 40,
        category: "예술과 문화",
        difficulty: "medium",
        question: "'돈키호테'의 작가는?",
        options: ["세르반테스", "톨스토이", "도스토예프스키", "발자크"],
        correctAnswer: 0,
        explanation: "미겔 데 세르반테스는 1605년과 1615년 돈키호테를 출간했습니다."
    }
,
    {
        id: 45,
        category: "한국사",
        difficulty: "hard",
        question: "조선시대 4대 사화 중 가장 마지막에 일어난 것은?",
        options: ["무오사화","갑자사화","기묘사화","을사사화"],
        correctAnswer: 3,
        explanation: "을사사화(1545년)는 명종 때 일어난 마지막 사화입니다."
    },
    {
        id: 46,
        category: "세계지리",
        difficulty: "medium",
        question: "2024년 기준, 아프리카 대륙에서 면적이 가장 큰 국가는?",
        options: ["나이지리아","남아프리카공화국","알제리","이집트"],
        correctAnswer: 2,
        explanation: "알제리는 약 238만km²로 아프리카에서 가장 큰 국가입니다."
    },
    {
        id: 47,
        category: "과학",
        difficulty: "easy",
        question: "광합성에 필요한 기체는?",
        options: ["산소","이산화탄소","질소","수소"],
        correctAnswer: 1,
        explanation: "식물은 이산화탄소와 물, 빛을 이용해 광합성을 합니다."
    },
    {
        id: 48,
        category: "예술과 문화",
        difficulty: "medium",
        question: "레오나르도 다빈치의 '최후의 만찬'이 그려진 도시는?",
        options: ["로마","피렌체","밀라노","베네치아"],
        correctAnswer: 2,
        explanation: "최후의 만찬은 밀라노의 산타 마리아 델레 그라치에 수도원에 있습니다."
    },
    {
        id: 49,
        category: "세계지리",
        difficulty: "medium",
        question: "지중해 서쪽 끝에서 유럽의 이베리아 반도와 아프리카 대륙 사이에 있으며, 지중해와 대서양을 연결하는 해협은?",
        options: ["보스포루스 해협", "도버 해협", "말라카 해협", "지브롤터 해협"],
        correctAnswer: 3,
        explanation: "지브롤터 해협은 스페인(유럽)과 모로코(아프리카) 사이에 있으며 지중해와 대서양을 잇습니다. (가장 좁은 곳의 폭은 약 14km입니다.)"
    },

    // ===== 3단계: 문제 풀 확장 (카테고리당 20문제) =====
    // 한국사
    {
        id: 50,
        category: "한국사",
        difficulty: "easy",
        question: "임진왜란 때 거북선을 이끌고 한산도 대첩에서 승리한 장군은?",
        options: ["권율", "곽재우", "김시민", "이순신"],
        correctAnswer: 3,
        explanation: "이순신 장군은 1592년 한산도 대첩에서 일본 수군을 크게 물리쳤습니다."
    },
    {
        id: 51,
        category: "한국사",
        difficulty: "medium",
        question: "고려 시대 거란의 1차 침입(993년) 때 서희가 외교 담판으로 확보한 지역은?",
        options: ["강동 6주", "대마도", "요동 지방", "쌍성총관부 지역"],
        correctAnswer: 0,
        explanation: "서희는 소손녕과 담판을 벌여 거란을 물러가게 하고 강동 6주를 확보했습니다."
    },
    {
        id: 52,
        category: "한국사",
        difficulty: "medium",
        question: "조선 세종 때 편찬된, 우리 풍토에 맞는 농법을 정리한 농서는?",
        options: ["향약집성방", "칠정산", "동의보감", "농사직설"],
        correctAnswer: 3,
        explanation: "농사직설(1429년)은 세종 때 정초 등이 편찬한 농서입니다. (향약집성방은 의학서, 칠정산은 역법서, 동의보감은 광해군 때 허준이 완성한 의학서입니다.)"
    },
    {
        id: 53,
        category: "한국사",
        difficulty: "medium",
        question: "698년 고구려 유민을 중심으로 발해를 건국한 인물은?",
        options: ["대조영", "궁예", "견훤", "연개소문"],
        correctAnswer: 0,
        explanation: "대조영은 698년 동모산에서 발해(처음 이름은 진)를 건국했습니다."
    },
    {
        id: 54,
        category: "한국사",
        difficulty: "hard",
        question: "1894년 동학농민군이 전주성을 점령한 뒤 정부군과 맺은 화약은?",
        options: ["강화도 조약", "제물포 조약", "시모노세키 조약", "전주화약"],
        correctAnswer: 3,
        explanation: "전주화약(1894년 5월)으로 농민군은 폐정 개혁을 약속받고 자진 해산했습니다."
    },
    {
        id: 81,
        category: "한국사",
        difficulty: "hard",
        question: "조선 영조가 1742년 탕평 정책의 의지를 밝히기 위해 성균관 입구에 세운 비석은?",
        options: ["척화비", "진흥왕 순수비", "탕평비", "광개토대왕릉비"],
        correctAnswer: 2,
        explanation: "영조는 1742년(영조 18년) 성균관 앞에 탕평비를 세워 붕당을 초월한 인재 등용의 뜻을 밝혔습니다."
    },

    // 세계지리
    {
        id: 55,
        category: "세계지리",
        difficulty: "easy",
        question: "오스트레일리아(호주)의 수도는?",
        options: ["시드니", "멜버른", "브리즈번", "캔버라"],
        correctAnswer: 3,
        explanation: "캔버라가 호주의 수도입니다. (인구가 가장 많은 도시는 시드니이지만 수도는 아닙니다.)"
    },
    {
        id: 56,
        category: "세계지리",
        difficulty: "medium",
        question: "브라질의 공용어는?",
        options: ["포르투갈어", "스페인어", "영어", "프랑스어"],
        correctAnswer: 0,
        explanation: "브라질은 과거 포르투갈의 식민지였으며 공용어는 포르투갈어입니다. (남아메리카의 다른 대부분 나라는 스페인어를 씁니다.)"
    },
    {
        id: 57,
        category: "세계지리",
        difficulty: "easy",
        question: "남아메리카 대륙의 서쪽 해안을 따라 남북으로 길게 뻗은 산맥은?",
        options: ["로키 산맥", "알프스 산맥", "히말라야 산맥", "안데스 산맥"],
        correctAnswer: 3,
        explanation: "안데스 산맥은 남아메리카 서쪽을 따라 약 7,000km에 걸쳐 이어집니다."
    },
    {
        id: 58,
        category: "세계지리",
        difficulty: "medium",
        question: "칼라하리 사막이 있는 대륙은?",
        options: ["아프리카", "아시아", "오스트레일리아", "남아메리카"],
        correctAnswer: 0,
        explanation: "칼라하리 사막은 아프리카 남부(보츠와나, 나미비아, 남아프리카공화국 일대)에 있습니다."
    },
    {
        id: 59,
        category: "세계지리",
        difficulty: "medium",
        question: "갠지스강이 흘러 들어가는 바다(만)는?",
        options: ["페르시아만", "아라비아해", "아덴만", "벵골만"],
        correctAnswer: 3,
        explanation: "갠지스강은 인도 북부에서 방글라데시를 거쳐 벵골만으로 흘러듭니다."
    },
    {
        id: 60,
        category: "세계지리",
        difficulty: "hard",
        question: "러시아 중부를 남북으로 뻗으며 유럽과 아시아의 경계로 흔히 꼽히는 산맥은?",
        options: ["톈산 산맥", "알타이 산맥", "우랄 산맥", "피레네 산맥"],
        correctAnswer: 2,
        explanation: "우랄 산맥은 러시아 중부를 남북으로 가로지르며 유럽과 아시아를 나누는 경계로 통용됩니다."
    },
    {
        id: 61,
        category: "세계지리",
        difficulty: "hard",
        question: "남아프리카공화국에 완전히 둘러싸인 내륙국은?",
        options: ["에스와티니", "보츠와나", "나미비아", "레소토"],
        correctAnswer: 3,
        explanation: "레소토는 사방이 남아프리카공화국 영토로 둘러싸여 있습니다. (에스와티니는 모잠비크와도 국경을 접합니다.)"
    },
    {
        id: 62,
        category: "세계지리",
        difficulty: "medium",
        question: "파나마 운하가 연결하는 두 대양은?",
        options: ["대서양과 태평양", "태평양과 인도양", "대서양과 인도양", "지중해와 홍해"],
        correctAnswer: 0,
        explanation: "파나마 운하는 카리브해(대서양 쪽)와 태평양을 잇습니다. (지중해와 홍해를 잇는 것은 수에즈 운하입니다.)"
    },
    {
        id: 82,
        category: "세계지리",
        difficulty: "hard",
        question: "중단 없이 한 번에 떨어지는 낙차(단일 낙하) 기준으로 지상에서 가장 높은 폭포는?",
        options: ["앙헬 폭포", "이구아수 폭포", "빅토리아 폭포", "나이아가라 폭포"],
        correctAnswer: 0,
        explanation: "베네수엘라 카나이마 국립공원의 앙헬 폭포는 총 높이 약 979m, 중단 없는 낙차 약 807m로 단일 낙하 기준 세계에서 가장 높습니다."
    },

    // 과학
    {
        id: 63,
        category: "과학",
        difficulty: "easy",
        question: "1기압에서 순수한 물이 끓는 온도는 섭씨 몇 도인가요?",
        options: ["100°C", "90°C", "110°C", "120°C"],
        correctAnswer: 0,
        explanation: "물은 1기압에서 100°C에 끓습니다. (기압이 낮아지면 끓는점도 낮아집니다.)"
    },
    {
        id: 64,
        category: "과학",
        difficulty: "medium",
        question: "식물 세포에서 광합성이 일어나는 세포 소기관은?",
        options: ["미토콘드리아", "리보솜", "핵", "엽록체"],
        correctAnswer: 3,
        explanation: "엽록체에는 엽록소가 들어 있어 빛에너지를 이용한 광합성이 일어납니다."
    },
    {
        id: 65,
        category: "과학",
        difficulty: "easy",
        question: "다음 중 소리(음파)가 전달되지 않는 곳은?",
        options: ["물속", "공기 중", "나무 막대 속", "진공"],
        correctAnswer: 3,
        explanation: "소리는 매질(기체, 액체, 고체)이 있어야 전달되므로 매질이 없는 진공에서는 전달되지 않습니다."
    },
    {
        id: 66,
        category: "과학",
        difficulty: "medium",
        question: "원자에서 양성자와 중성자가 모여 있는 중심 부분은?",
        options: ["원자핵", "전자껍질", "분자", "동위원소"],
        correctAnswer: 0,
        explanation: "원자핵은 양성자와 중성자로 이루어져 있으며, 그 주위를 전자가 움직입니다."
    },
    {
        id: 67,
        category: "과학",
        difficulty: "medium",
        question: "푸른 리트머스 종이를 붉게 변하게 하는 용액의 성질은?",
        options: ["염기성", "중성", "알칼리성", "산성"],
        correctAnswer: 3,
        explanation: "산성 용액은 푸른 리트머스 종이를 붉게 변하게 합니다. (염기성 용액은 붉은 리트머스 종이를 푸르게 합니다.)"
    },
    {
        id: 68,
        category: "과학",
        difficulty: "medium",
        question: "지구에 계절 변화가 생기는 주된 원인은?",
        options: ["지구의 자전", "지구와 태양 사이 거리 변화", "지구 자전축의 기울어짐", "달의 인력"],
        correctAnswer: 2,
        explanation: "지구 자전축이 공전 궤도면에 대해 약 23.5° 기울어져 있어 계절별로 태양 고도와 낮의 길이가 달라집니다."
    },
    {
        id: 69,
        category: "과학",
        difficulty: "hard",
        question: "DNA를 구성하는 염기가 아닌 것은?",
        options: ["아데닌", "구아닌", "시토신", "우라실"],
        correctAnswer: 3,
        explanation: "DNA의 염기는 아데닌, 구아닌, 시토신, 티민이며 우라실은 RNA에 들어 있는 염기입니다."
    },
    {
        id: 70,
        category: "과학",
        difficulty: "hard",
        question: "원자번호 11번인 원소는?",
        options: ["나트륨", "마그네슘", "칼륨", "칼슘"],
        correctAnswer: 0,
        explanation: "나트륨(Na)의 원자번호는 11입니다. (마그네슘 12, 칼륨 19, 칼슘 20)"
    },
    {
        id: 71,
        category: "과학",
        difficulty: "hard",
        question: "뉴턴의 운동 법칙 중 F = ma로 표현되는 법칙은?",
        options: ["관성의 법칙", "가속도의 법칙", "작용·반작용의 법칙", "만유인력의 법칙"],
        correctAnswer: 1,
        explanation: "운동 제2법칙(가속도의 법칙)은 물체에 작용하는 힘이 질량과 가속도의 곱과 같다는 법칙입니다."
    },

    // 예술과 문화
    {
        id: 72,
        category: "예술과 문화",
        difficulty: "hard",
        question: "'비너스의 탄생'을 그린 르네상스 화가는?",
        options: ["라파엘로", "티치아노", "카라바조", "보티첼리"],
        correctAnswer: 3,
        explanation: "산드로 보티첼리는 1480년대 중반 '비너스의 탄생'을 그렸습니다."
    },
    {
        id: 73,
        category: "예술과 문화",
        difficulty: "medium",
        question: "발레 음악 '백조의 호수'를 작곡한 작곡가는?",
        options: ["차이콥스키", "바흐", "모차르트", "쇼팽"],
        correctAnswer: 0,
        explanation: "표트르 일리치 차이콥스키는 1870년대 후반 '백조의 호수'를 작곡했습니다."
    },
    {
        id: 74,
        category: "예술과 문화",
        difficulty: "medium",
        question: "다빈치의 '모나리자'가 소장된 박물관은?",
        options: ["오르세 미술관", "프라도 미술관", "대영박물관", "루브르 박물관"],
        correctAnswer: 3,
        explanation: "모나리자는 프랑스 파리의 루브르 박물관에 전시되어 있습니다."
    },
    {
        id: 75,
        category: "예술과 문화",
        difficulty: "medium",
        question: "희곡 '파우스트'를 쓴 독일의 작가는?",
        options: ["괴테", "실러", "위고", "톨스토이"],
        correctAnswer: 0,
        explanation: "요한 볼프강 폰 괴테는 평생에 걸쳐 '파우스트'를 집필했으며 제1부는 1808년에 출간되었습니다."
    },
    {
        id: 76,
        category: "예술과 문화",
        difficulty: "medium",
        question: "정악 가야금 기준으로 줄이 12개인 한국 전통 현악기는?",
        options: ["거문고", "해금", "가야금", "아쟁"],
        correctAnswer: 2,
        explanation: "전통 가야금(정악 가야금)은 12현입니다. (거문고는 6현, 해금은 2현입니다.)"
    },
    {
        id: 77,
        category: "예술과 문화",
        difficulty: "medium",
        question: "고대 그리스의 파르테논 신전이 있는 도시는?",
        options: ["스파르타", "델포이", "코린토스", "아테네"],
        correctAnswer: 3,
        explanation: "파르테논 신전은 아테네의 아크로폴리스 언덕에 있으며 기원전 5세기에 지어졌습니다."
    },
    {
        id: 78,
        category: "예술과 문화",
        difficulty: "hard",
        question: "미켈란젤로가 시스티나 성당 천장에 그린 프레스코화는?",
        options: ["최후의 심판", "아테네 학당", "천지창조", "비너스의 탄생"],
        correctAnswer: 2,
        explanation: "'천지창조'는 1508~1512년에 그린 천장화입니다. (같은 성당 제단 벽의 '최후의 심판'도 미켈란젤로의 작품이지만 천장화는 아닙니다.)"
    },
    {
        id: 79,
        category: "예술과 문화",
        difficulty: "medium",
        question: "안토니 가우디가 설계에 참여한 스페인 바르셀로나의 성당은?",
        options: ["노트르담 대성당", "성 바실리 대성당", "밀라노 두오모", "사그라다 파밀리아"],
        correctAnswer: 3,
        explanation: "사그라다 파밀리아 성당은 1882년 착공되었고, 가우디는 1883년부터 설계를 이어받았습니다."
    },
    {
        id: 80,
        category: "예술과 문화",
        difficulty: "medium",
        question: "오페라 '마술피리'를 작곡한 작곡가는?",
        options: ["모차르트", "하이든", "슈베르트", "바그너"],
        correctAnswer: 0,
        explanation: "볼프강 아마데우스 모차르트는 1791년 오페라 '마술피리'를 작곡했습니다."
    }];
