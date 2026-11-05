export const CATEGORIES = [
  { id: "history", name: "한국사", color: "#FF6B6B" },
  { id: "geography", name: "지리", color: "#4ECDC4" },
  { id: "culture", name: "문화", color: "#45B7D1" },
  { id: "science", name: "과학", color: "#FFA07A" }
];

export const quizData = [
  // 한국사 (10문제)
  {
    id: 1,
    category: "history",
    difficulty: "medium",
    question: "조선을 건국한 왕은?",
    options: ["이성계", "왕건", "이방원", "세종"],
    correctAnswer: 0,
    explanation: "이성계는 1392년 조선을 건국했습니다."
  },
  {
    id: 2,
    category: "history",
    difficulty: "medium",
    question: "고려를 건국한 인물은?",
    options: ["이성계", "왕건", "이방원", "광종"],
    correctAnswer: 1,
    explanation: "왕건은 918년 고려를 건국했습니다."
  },
  {
    id: 3,
    category: "history",
    difficulty: "hard",
    question: "임진왜란이 일어난 연도는?",
    options: ["1502년", "1592년", "1637년", "1710년"],
    correctAnswer: 1,
    explanation: "임진왜란은 1592년 도요토미 히데요시의 침입으로 시작되었습니다."
  },
  {
    id: 4,
    category: "history",
    difficulty: "easy",
    question: "대한민국이 건국된 연도는?",
    options: ["1945년", "1948년", "1950년", "1960년"],
    correctAnswer: 1,
    explanation: "대한민국은 1948년 8월 15일 건국되었습니다."
  },
  {
    id: 5,
    category: "history",
    difficulty: "medium",
    question: "한글을 창제한 왕은?",
    options: ["세종", "성종", "중종", "인종"],
    correctAnswer: 0,
    explanation: "세종 대왕은 1443년 훈민정음(한글)을 창제했습니다."
  },
  {
    id: 6,
    category: "history",
    difficulty: "hard",
    question: "병자호란이 일어난 연도는?",
    options: ["1616년", "1627년", "1637년", "1647년"],
    correctAnswer: 2,
    explanation: "병자호란은 1637년 청의 침입으로 시작되었습니다."
  },
  {
    id: 7,
    category: "history",
    difficulty: "medium",
    question: "삼국통일을 이룬 국가는?",
    options: ["고구려", "백제", "신라", "가야"],
    correctAnswer: 2,
    explanation: "신라의 문무왕은 676년 삼국통일을 이루었습니다."
  },
  {
    id: 8,
    category: "history",
    difficulty: "easy",
    question: "광복절은 언제인가?",
    options: ["6월 6일", "8월 15일", "10월 3일", "12월 25일"],
    correctAnswer: 1,
    explanation: "광복절은 8월 15일로, 일제강점기로부터 해방된 날을 기념합니다."
  },
  {
    id: 9,
    category: "history",
    difficulty: "hard",
    question: "여몽전쟁이 있었던 시대는?",
    options: ["고려 초기", "고려 중기", "고려 후기", "조선 초기"],
    correctAnswer: 2,
    explanation: "여몽전쟁은 13세기 고려 후기에 있었던 고려와 몽골의 전쟁입니다."
  },
  {
    id: 10,
    category: "history",
    difficulty: "medium",
    question: "을사오적과 관련된 사건은?",
    options: ["삼일운동", "을사늑약", "경술국치", "광주학살"],
    correctAnswer: 1,
    explanation: "을사오적은 을사늑약(1905년)에 조인한 5명의 대신을 말합니다."
  },

  // 지리 (10문제)
  {
    id: 11,
    category: "geography",
    difficulty: "easy",
    question: "한반도에서 가장 높은 산은?",
    options: ["지리산", "설악산", "백두산", "한라산"],
    correctAnswer: 2,
    explanation: "백두산은 높이 2,744m으로 한반도에서 가장 높은 산입니다."
  },
  {
    id: 12,
    category: "geography",
    difficulty: "easy",
    question: "한국의 수도는?",
    options: ["부산", "서울", "대구", "인천"],
    correctAnswer: 1,
    explanation: "서울은 대한민국의 수도입니다."
  },
  {
    id: 13,
    category: "geography",
    difficulty: "medium",
    question: "한국에서 가장 넓은 평야는?",
    options: ["호남평야", "영남평야", "황해평야", "한강평야"],
    correctAnswer: 0,
    explanation: "호남평야는 전라남도와 전라북도에 위치한 한국에서 가장 넓은 평야입니다."
  },
  {
    id: 14,
    category: "geography",
    difficulty: "medium",
    question: "한반도의 시간대는?",
    options: ["GMT+8", "GMT+9", "GMT+10", "GMT+11"],
    correctAnswer: 1,
    explanation: "한반도는 GMT+9 시간대에 위치합니다."
  },
  {
    id: 15,
    category: "geography",
    difficulty: "hard",
    question: "대한민국의 분단선은?",
    options: ["37도선", "38도선", "39도선", "40도선"],
    correctAnswer: 1,
    explanation: "대한민국과 북한은 38도선(현재는 휴전선)으로 분단되어 있습니다."
  },
  {
    id: 16,
    category: "geography",
    difficulty: "easy",
    question: "한반도를 흐르는 가장 긴 강은?",
    options: ["낙동강", "한강", "압록강", "두만강"],
    correctAnswer: 0,
    explanation: "낙동강은 길이 525km으로 한반도에서 가장 긴 강입니다."
  },
  {
    id: 17,
    category: "geography",
    difficulty: "medium",
    question: "한국에서 가장 큰 섬은?",
    options: ["거제도", "진도", "제주도", "남해도"],
    correctAnswer: 2,
    explanation: "제주도는 면적 1,849km²으로 한국에서 가장 큰 섬입니다."
  },
  {
    id: 18,
    category: "geography",
    difficulty: "hard",
    question: "한반도의 위도 범위는 약?",
    options: ["30°~40°N", "33°~43°N", "35°~45°N", "37°~47°N"],
    correctAnswer: 1,
    explanation: "한반도는 약 33°N에서 43°N 사이에 위치합니다."
  },
  {
    id: 19,
    category: "geography",
    difficulty: "medium",
    question: "한국의 기후는?",
    options: ["열대기후", "온대기후", "냉대기후", "건조기후"],
    correctAnswer: 1,
    explanation: "한국은 온대기후에 속하며, 사계절이 뚜렷합니다."
  },
  {
    id: 20,
    category: "geography",
    difficulty: "easy",
    question: "동해의 또 다른 이름은?",
    options: ["일본해", "황해", "서해", "남중국해"],
    correctAnswer: 0,
    explanation: "동해는 국제적으로 일본해(Sea of Japan)로도 불리며, 동해(East Sea)라는 표기를 사용하기 위한 노력이 계속되고 있습니다."
  },

  // 문화 (10문제)
  {
    id: 21,
    category: "culture",
    difficulty: "easy",
    question: "한국의 전통 의상은?",
    options: ["기모노", "한복", "치파오", "사리"],
    correctAnswer: 1,
    explanation: "한복은 한국의 전통 의상으로, 저고리와 치마로 이루어져 있습니다."
  },
  {
    id: 22,
    category: "culture",
    difficulty: "medium",
    question: "팔도 대사습은 어느 도에서 유래했을까?",
    options: ["경주", "전주", "진주", "공주"],
    correctAnswer: 1,
    explanation: "팔도 대사습은 전라도 지역의 민속 예술입니다."
  },
  {
    id: 23,
    category: "culture",
    difficulty: "medium",
    question: "한국의 전통 악기는?",
    options: ["플루트", "거문고", "피아노", "바이올린"],
    correctAnswer: 1,
    explanation: "거문고는 한국의 대표적인 전통 악기 중 하나입니다."
  },
  {
    id: 24,
    category: "culture",
    difficulty: "easy",
    question: "태권도의 기원 국가는?",
    options: ["일본", "중국", "한국", "태국"],
    correctAnswer: 2,
    explanation: "태권도는 한국의 전통 무술로 현재는 올림픽 종목입니다."
  },
  {
    id: 25,
    category: "culture",
    difficulty: "hard",
    question: "팔만대장경이 보관되어 있는 사찰은?",
    options: ["불국사", "해인사", "법주사", "미륵사"],
    correctAnswer: 1,
    explanation: "해인사는 경주에 위치하며 팔만대장경을 보관하고 있습니다."
  },
  {
    id: 26,
    category: "culture",
    difficulty: "medium",
    question: "한국의 전통 예술 중 영상미술은?",
    options: ["서예", "강강술래", "탈춤", "판소리"],
    correctAnswer: 2,
    explanation: "탈춤은 한국의 전통 무용 예술로 마스크를 쓰고 공연합니다."
  },
  {
    id: 27,
    category: "culture",
    difficulty: "easy",
    question: "한국의 대표적인 음식은?",
    options: ["카레", "김치", "파스타", "초밥"],
    correctAnswer: 1,
    explanation: "김치는 한국의 대표적인 발효 음식으로 세계적으로 유명합니다."
  },
  {
    id: 28,
    category: "culture",
    difficulty: "medium",
    question: "한국의 설날 전통 음식은?",
    options: ["만두", "떡국", "송편", "약식"],
    correctAnswer: 1,
    explanation: "떡국은 설날에 먹는 전통 음식으로 새해를 기원합니다."
  },
  {
    id: 29,
    category: "culture",
    difficulty: "hard",
    question: "조선백자의 특징은?",
    options: ["화려한 색상", "순백색", "검은색", "금색 장식"],
    correctAnswer: 1,
    explanation: "조선백자는 순백색의 깔끔한 미감으로 유명하며 세계적으로 높이 평가됩니다."
  },
  {
    id: 30,
    category: "culture",
    difficulty: "medium",
    question: "한국의 유네스코 세계문화유산이 아닌 것은?",
    options: ["불국사", "석굴암", "경주역사유적지구", "한강"],
    correctAnswer: 3,
    explanation: "한강은 현재 유네스코 세계문화유산으로 지정되지 않았습니다. 불국사, 석굴암, 경주역사유적지구는 세계문화유산으로 지정되어 있습니다."
  },

  // 과학 (10문제)
  {
    id: 31,
    category: "science",
    difficulty: "easy",
    question: "물의 분자 기호는?",
    options: ["H2O", "H2O2", "HO", "H3O"],
    correctAnswer: 0,
    explanation: "물은 수소 2개와 산소 1개로 이루어진 H2O 분자입니다."
  },
  {
    id: 32,
    category: "science",
    difficulty: "easy",
    question: "태양에서 지구까지의 거리는 약?",
    options: ["1억km", "5억km", "10억km", "50억km"],
    correctAnswer: 0,
    explanation: "태양에서 지구까지의 거리는 약 1억 5천만km(1AU)입니다."
  },
  {
    id: 33,
    category: "science",
    difficulty: "medium",
    question: "광속(빛의 속도)은 약?",
    options: ["3,000km/s", "30,000km/s", "300,000km/s", "3,000,000km/s"],
    correctAnswer: 2,
    explanation: "광속은 초당 약 299,792km로, 약 300,000km/s입니다."
  },
  {
    id: 34,
    category: "science",
    difficulty: "medium",
    question: "인간의 DNA는 몇 개의 염기쌍으로 이루어져 있을까?",
    options: ["1백만", "1천만", "30억", "300억"],
    correctAnswer: 2,
    explanation: "인간의 DNA는 약 30억 개의 염기쌍으로 이루어져 있습니다."
  },
  {
    id: 35,
    category: "science",
    difficulty: "hard",
    question: "아인슈타인의 질량-에너지 공식은?",
    options: ["E=mc", "E=mc²", "E=m²c", "E=m+c²"],
    correctAnswer: 1,
    explanation: "E=mc²는 아인슈타인의 상대성 이론에서 유도된 유명한 공식입니다."
  },
  {
    id: 36,
    category: "science",
    difficulty: "easy",
    question: "화학 원소 중 가장 가벼운 원소는?",
    options: ["헬륨", "탄소", "수소", "산소"],
    correctAnswer: 2,
    explanation: "수소는 원자 번호 1번으로 가장 가벼운 원소입니다."
  },
  {
    id: 37,
    category: "science",
    difficulty: "medium",
    question: "우주의 나이는 약?",
    options: ["50억년", "100억년", "138억년", "200억년"],
    correctAnswer: 2,
    explanation: "현재 관찰된 우주의 나이는 약 138억년입니다."
  },
  {
    id: 38,
    category: "science",
    difficulty: "hard",
    question: "양자역학의 기본 원리는?",
    options: ["결정론", "불확정성 원리", "인과관계", "선형성"],
    correctAnswer: 1,
    explanation: "하이젠베르크의 불확정성 원리는 양자역학의 기본 원리입니다."
  },
  {
    id: 39,
    category: "science",
    difficulty: "medium",
    question: "지구의 대기는 주로 어떤 기체로 이루어져 있을까?",
    options: ["산소", "이산화탄소", "질소", "헬륨"],
    correctAnswer: 2,
    explanation: "지구 대기는 약 78%의 질소, 21%의 산소, 1%의 기타 기체로 이루어져 있습니다."
  },
  {
    id: 40,
    category: "science",
    difficulty: "easy",
    question: "식물의 광합성의 주요 생성물은?",
    options: ["산소와 이산화탄소", "산소와 포도당", "이산화탄소와 포도당", "물과 산소"],
    correctAnswer: 1,
    explanation: "광합성은 빛 에너지를 이용하여 물과 이산화탄소로부터 포도당과 산소를 생성합니다."
  }
];
