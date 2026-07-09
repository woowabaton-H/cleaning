const MS_PER_DAY = 24 * 60 * 60 * 1000;
const TODAY = new Date("2026-07-09T12:00:00+09:00");

const state = {
  activeView: "home",
  routineFilter: "전체",
  communityTab: "guide",
  flow: null,
  bookingDraft: null,
  bookingStep: 1,
  toastTimer: null,
};

const statusMeta = {
  good: { label: "정상", className: "good" },
  soon: { label: "임박", className: "soon" },
  late: { label: "지연", className: "late" },
  booked: { label: "예약됨", className: "booked" },
};

const tasks = [
  {
    id: "bath",
    category: "욕실·곰팡이",
    short: "욕실",
    icon: "bath",
    title: "욕실 줄눈 곰팡이 점검",
    space: "욕실",
    owner: "보송",
    cycleDays: 21,
    lastDoneAt: "2026-06-10T09:00:00+09:00",
    guideOptions: ["bathMold", "bathWaterScale", "bathDrain"],
    defaultGuide: "bathMold",
    serviceId: "bath-care",
  },
  {
    id: "trash",
    category: "쓰레기·수거",
    short: "수거",
    icon: "trash",
    title: "분리수거와 음식물 정리",
    space: "현관",
    owner: "보송",
    cycleDays: 3,
    lastDoneAt: "2026-07-04T21:00:00+09:00",
    guideOptions: ["trashSort", "foodWaste"],
    defaultGuide: "trashSort",
    serviceId: "trash-pickup",
  },
  {
    id: "bedding",
    category: "침구·빨래",
    short: "침구",
    icon: "laundry",
    title: "침구와 수건 세탁",
    space: "침실",
    owner: "하우",
    cycleDays: 14,
    lastDoneAt: "2026-06-27T12:00:00+09:00",
    guideOptions: ["beddingWash", "laundrySmell"],
    defaultGuide: "beddingWash",
    serviceId: "laundry-pickup",
  },
  {
    id: "kitchen",
    category: "주방",
    short: "주방",
    icon: "kitchen",
    title: "싱크대 배수구 냄새",
    space: "주방",
    owner: "보송",
    cycleDays: 7,
    lastDoneAt: "2026-07-05T20:00:00+09:00",
    guideOptions: ["sinkSmell", "kitchenGrease"],
    defaultGuide: "sinkSmell",
    serviceId: "kitchen-care",
  },
  {
    id: "pest",
    category: "해충·방역",
    short: "방역",
    icon: "pest",
    title: "초파리와 방충 상태 확인",
    space: "주방",
    owner: "보송",
    cycleDays: 30,
    lastDoneAt: "2026-06-20T18:00:00+09:00",
    guideOptions: ["pestFly"],
    defaultGuide: "pestFly",
    serviceId: "pest-care",
  },
  {
    id: "floor",
    category: "바닥·공간",
    short: "바닥",
    icon: "floor",
    title: "바닥 먼지와 머리카락 정리",
    space: "거실",
    owner: "하우",
    cycleDays: 7,
    lastDoneAt: "2026-07-03T19:00:00+09:00",
    guideOptions: ["floorDust"],
    defaultGuide: "floorDust",
    serviceId: "home-clean",
  },
];

const guides = {
  bathMold: {
    title: "타일 줄눈 곰팡이",
    problem: "습기와 환기 부족으로 줄눈에 검은 자국이 생긴 상태",
    duration: "15분 + 방치",
    difficulty: "보통",
    checks: ["환기가 가능한지 확인합니다.", "장갑과 마스크를 준비합니다.", "대리석이나 금속 표면에는 전용 세제 사용 여부를 확인합니다."],
    tools: ["곰팡이 제거젤", "줄눈 전용 솔", "고무장갑", "마른 천"],
    steps: ["물기를 먼저 닦아냅니다.", "곰팡이 제거젤을 줄눈에 얇게 바릅니다.", "30분 이상 둔 뒤 줄눈 솔로 가볍게 문지릅니다.", "물로 충분히 헹구고 환기합니다."],
    warnings: "염소계 세제와 산성 세제는 절대 섞지 마세요. 밀폐된 욕실에서는 유독가스 위험이 커집니다.",
    prevention: "샤워 후 3분 환기하고, 물기를 닦으면 다음 곰팡이까지의 간격이 길어져요.",
    productIds: ["mold-gel", "grout-brush"],
    serviceId: "bath-care",
    taskId: "bath",
    expert: "줄눈 깊이 침투, 실리콘 재시공, 배수구 역류가 보이면 전문가에게 맡기는 편이 안전해요.",
  },
  bathWaterScale: {
    title: "샤워부스 물때",
    problem: "물 속 미네랄과 비누 잔여물이 유리나 금속에 굳은 상태",
    duration: "20분",
    difficulty: "보통",
    checks: ["표면이 유리, 금속, 대리석 중 무엇인지 확인합니다.", "산성 세제를 쓸 수 없는 소재는 피합니다."],
    tools: ["산성 물때 제거제", "부드러운 수세미", "극세사 천"],
    steps: ["표면 먼지를 먼저 닦습니다.", "물때 제거제를 묻혀 5분 둡니다.", "부드러운 수세미로 문지릅니다.", "물로 헹군 뒤 마른 천으로 마감합니다."],
    warnings: "대리석과 천연석에는 산성 세제를 쓰면 표면이 상할 수 있습니다.",
    prevention: "샤워 후 스퀴지로 물기를 제거하면 물때가 덜 쌓입니다.",
    productIds: ["scale-cleaner", "microfiber"],
    serviceId: "bath-care",
    taskId: "bath",
    expert: "유리 코팅 손상이나 오래 굳은 석회 자국은 욕실 집중 케어로 처리하는 편이 낫습니다.",
  },
  bathDrain: {
    title: "욕실 배수구 냄새",
    problem: "머리카락과 비누 찌꺼기가 배수구 안쪽에 남은 상태",
    duration: "15분",
    difficulty: "쉬움",
    checks: ["배수구 덮개와 거름망을 분리할 수 있는지 확인합니다.", "막힘이나 역류가 있으면 세제보다 설비 점검이 먼저입니다."],
    tools: ["배수구 클리너", "긴 솔", "장갑"],
    steps: ["덮개와 거름망을 꺼냅니다.", "머리카락과 찌꺼기를 제거합니다.", "클리너를 넣고 권장 시간만큼 둡니다.", "뜨거운 물이 아닌 미지근한 물로 헹굽니다."],
    warnings: "염소계와 산성 제품을 이어서 사용하지 마세요.",
    prevention: "일주일에 한 번 머리카락만 제거해도 냄새가 줄어듭니다.",
    productIds: ["drain-cleaner", "grout-brush"],
    serviceId: "bath-care",
    taskId: "bath",
    expert: "물이 내려가지 않거나 역류하면 배관 문제일 수 있어 설비 업체가 필요합니다.",
  },
  trashSort: {
    title: "분리수거 밀림",
    problem: "퇴근 후 배출을 놓쳐 현관에 재활용과 음식물이 쌓이는 상태",
    duration: "5분",
    difficulty: "쉬움",
    checks: ["오염된 플라스틱은 한 번 헹굽니다.", "지역별 배출 요일을 확인합니다."],
    tools: ["분리수거 봉투", "박스 커터", "장갑"],
    steps: ["종이, 플라스틱, 비닐을 먼저 나눕니다.", "오염물이 묻은 용기는 헹굽니다.", "택배 박스는 테이프를 제거합니다.", "배출 요일에 맞춰 문 앞에 둡니다."],
    warnings: "지역별 배출 규정이 다를 수 있어요. 애매하면 일반쓰레기로 처리하지 말고 지자체 안내를 확인하세요.",
    prevention: "배달음식이 많은 주에는 수거 주기를 짧게 잡는 편이 좋습니다.",
    productIds: ["trash-bag", "sort-bin"],
    serviceId: "trash-pickup",
    taskId: "trash",
    expert: "매주 반복해서 밀리면 문앞 정기 수거가 더 적합할 수 있어요.",
  },
  foodWaste: {
    title: "음식물 쓰레기 냄새",
    problem: "물기와 잔여물이 오래 남아 냄새와 해충 가능성이 커진 상태",
    duration: "5분",
    difficulty: "쉬움",
    checks: ["국물과 물기를 최대한 제거합니다.", "음식물 통 내부를 비우고 말립니다."],
    tools: ["음식물 봉투", "탈취제", "작은 솔"],
    steps: ["물기를 먼저 짜냅니다.", "봉투를 이중으로 묶습니다.", "통 내부를 닦고 완전히 말립니다.", "배출 시간이 멀면 냉동 보관을 고려합니다."],
    warnings: "국물류를 그대로 버리면 악취와 누수 가능성이 큽니다.",
    prevention: "여름에는 배출 간격을 줄이고 통 내부 건조를 우선합니다.",
    productIds: ["deodorizer", "trash-bag"],
    serviceId: "trash-pickup",
    taskId: "trash",
    expert: "음식물 배출이 자주 밀리는 생활 패턴이면 정기 수거가 가장 효과적입니다.",
  },
  beddingWash: {
    title: "침구 세탁 주기",
    problem: "땀과 먼지가 누적되어 냄새와 피부 자극 가능성이 커지는 상태",
    duration: "세탁 1회",
    difficulty: "쉬움",
    checks: ["세탁 라벨과 건조 가능 여부를 확인합니다.", "이불 부피가 세탁기 용량을 넘지 않는지 봅니다."],
    tools: ["이불 세탁망", "중성세제", "건조 공간"],
    steps: ["커버와 속통을 분리합니다.", "세탁망에 넣고 이불 코스를 선택합니다.", "세제는 권장량만 사용합니다.", "완전히 건조한 뒤 보관합니다."],
    warnings: "덜 마른 침구는 냄새와 곰팡이 원인이 됩니다.",
    prevention: "침구는 1~2주 주기로 커버부터 관리하면 부담이 줄어듭니다.",
    productIds: ["laundry-net", "neutral-detergent"],
    serviceId: "laundry-pickup",
    taskId: "bedding",
    expert: "대형 이불이나 계절 침구는 세탁 수거 서비스가 편합니다.",
  },
  laundrySmell: {
    title: "빨래 쉰내",
    problem: "세탁조 내부 오염 또는 젖은 빨래 방치로 냄새가 남은 상태",
    duration: "세탁 1회",
    difficulty: "쉬움",
    checks: ["세탁조 냄새인지 옷감 냄새인지 확인합니다.", "고무패킹과 세제함 오염을 확인합니다."],
    tools: ["세탁조 클리너", "중성세제", "마른 천"],
    steps: ["세제함과 고무패킹을 닦습니다.", "세탁조 클리너로 통세척을 돌립니다.", "문을 열어 내부를 말립니다.", "빨래는 세탁 후 바로 건조합니다."],
    warnings: "젖은 빨래를 세탁기 안에 오래 두지 마세요.",
    prevention: "세탁 후 문을 열어두고 한 달에 한 번 통세척을 합니다.",
    productIds: ["washer-cleaner", "neutral-detergent"],
    serviceId: "laundry-pickup",
    taskId: "bedding",
    expert: "통세척 후에도 냄새가 계속되면 드럼 분해 세척이 필요할 수 있습니다.",
  },
  sinkSmell: {
    title: "싱크대 배수구 냄새",
    problem: "거름망과 배수구 안쪽의 음식물 찌꺼기가 냄새를 만드는 상태",
    duration: "10분",
    difficulty: "쉬움",
    checks: ["거름망을 먼저 비웁니다.", "배수구 부품이 분리되는지 확인합니다."],
    tools: ["배수구 클리너", "거름망", "솔"],
    steps: ["거름망 찌꺼기를 제거합니다.", "배수구 부품을 분리해 닦습니다.", "클리너를 넣고 기다립니다.", "충분히 헹군 뒤 건조합니다."],
    warnings: "표백제와 산성 세제를 섞어 쓰지 마세요.",
    prevention: "일회용 거름망을 쓰면 찌꺼기 제거가 쉬워집니다.",
    productIds: ["drain-cleaner", "strainer-net"],
    serviceId: "kitchen-care",
    taskId: "kitchen",
    expert: "역류나 막힘이 반복되면 배관 점검이 필요합니다.",
  },
  kitchenGrease: {
    title: "주방 기름때",
    problem: "가열 조리 후 기름이 후드와 주변 표면에 굳은 상태",
    duration: "20분",
    difficulty: "보통",
    checks: ["가열 기구가 식었는지 확인합니다.", "코팅 표면에는 금속 수세미를 쓰지 않습니다."],
    tools: ["주방 기름때 세정제", "극세사 천", "장갑"],
    steps: ["기름때 위에 세정제를 뿌립니다.", "5분 둔 뒤 부드럽게 닦습니다.", "물기를 제거합니다.", "필터는 분리 세척합니다."],
    warnings: "뜨거운 표면에 세정제를 바로 뿌리지 마세요.",
    prevention: "조리 후 바로 닦으면 다음 청소 시간이 크게 줄어듭니다.",
    productIds: ["degreaser", "microfiber"],
    serviceId: "kitchen-care",
    taskId: "kitchen",
    expert: "후드 내부 덕트 청소는 전문 장비가 필요합니다.",
  },
  pestFly: {
    title: "초파리 발생",
    problem: "음식물, 배수구, 과일 껍질 주변에 발생원이 남은 상태",
    duration: "10분",
    difficulty: "쉬움",
    checks: ["음식물 통과 배수구를 먼저 확인합니다.", "젖은 걸레나 과일 껍질을 치웁니다."],
    tools: ["배수구 클리너", "초파리 트랩", "밀폐 용기"],
    steps: ["발생원을 제거합니다.", "배수구를 청소합니다.", "트랩을 설치합니다.", "일주일간 발생량을 확인합니다."],
    warnings: "살충제 사용 시 음식물과 조리도구를 치우고 환기하세요.",
    prevention: "여름에는 음식물 배출 간격을 짧게 잡습니다.",
    productIds: ["fly-trap", "drain-cleaner"],
    serviceId: "pest-care",
    taskId: "pest",
    expert: "바퀴벌레나 반복 발생은 방역 업체가 필요합니다.",
  },
  floorDust: {
    title: "바닥 먼지와 머리카락",
    problem: "생활 먼지와 머리카락이 구석과 가구 밑에 쌓인 상태",
    duration: "10분",
    difficulty: "쉬움",
    checks: ["물걸레 전에 큰 먼지를 먼저 제거합니다.", "원목 마루에는 물을 많이 쓰지 않습니다."],
    tools: ["롤클리너", "청소포", "극세사 밀대"],
    steps: ["구석 먼지를 먼저 모읍니다.", "롤클리너로 머리카락을 걷어냅니다.", "청소포로 전체를 닦습니다.", "물기가 남지 않게 환기합니다."],
    warnings: "원목 마루에는 다량의 물을 쓰지 마세요.",
    prevention: "물걸레보다 건식 먼지 제거를 먼저 하면 시간이 줄어듭니다.",
    productIds: ["roller-refill", "microfiber"],
    serviceId: "home-clean",
    taskId: "floor",
    expert: "반복적으로 밀리면 2시간 단위 부분 청소를 고려할 수 있어요.",
  },
};

const products = [
  { id: "mold-gel", name: "곰팡이 제거 젤 250g", brand: "욕실클린", price: 6900, discount: "12%", rating: 4.7, reviews: 812, tags: ["줄눈", "제휴"], affiliate: true, checkedAt: "2026.07.09", problem: "욕실 곰팡이", sellers: ["쿠팡 6,900원", "네이버쇼핑 7,400원"] },
  { id: "grout-brush", name: "줄눈 전용 브러시 세트", brand: "홈디테일", price: 3200, discount: "0%", rating: 4.5, reviews: 214, tags: ["틈새", "초보"], affiliate: false, checkedAt: "2026.07.09", problem: "줄눈 청소", sellers: ["B마트 3,200원", "다이소 3,000원대"] },
  { id: "scale-cleaner", name: "산성 물때 제거제", brand: "스케일오프", price: 5900, discount: "8%", rating: 4.6, reviews: 531, tags: ["물때", "주의"], affiliate: true, checkedAt: "2026.07.09", problem: "샤워부스 물때", sellers: ["쿠팡 5,900원", "네이버쇼핑 6,300원"] },
  { id: "microfiber", name: "극세사 청소천 5매", brand: "보송패드", price: 4200, discount: "0%", rating: 4.8, reviews: 328, tags: ["마감", "재사용"], affiliate: false, checkedAt: "2026.07.09", problem: "물기 제거", sellers: ["온라인몰 4,200원", "B마트 4,500원"] },
  { id: "drain-cleaner", name: "배수구 클리너", brand: "드레인핏", price: 4800, discount: "5%", rating: 4.4, reviews: 672, tags: ["냄새", "제휴"], affiliate: true, checkedAt: "2026.07.09", problem: "배수구 냄새", sellers: ["쿠팡 4,800원", "네이버쇼핑 5,100원"] },
  { id: "trash-bag", name: "분리수거 봉투 묶음", brand: "정리생활", price: 3900, discount: "0%", rating: 4.3, reviews: 188, tags: ["수거", "소모품"], affiliate: false, checkedAt: "2026.07.09", problem: "분리수거", sellers: ["B마트 3,900원", "온라인몰 4,200원"] },
  { id: "sort-bin", name: "3분류 접이식 정리함", brand: "오거나이즈", price: 12900, discount: "15%", rating: 4.5, reviews: 255, tags: ["정리", "제휴"], affiliate: true, checkedAt: "2026.07.09", problem: "분리수거", sellers: ["쿠팡 12,900원", "네이버쇼핑 14,200원"] },
  { id: "deodorizer", name: "음식물 통 탈취제", brand: "냄새제로", price: 3500, discount: "0%", rating: 4.2, reviews: 143, tags: ["냄새", "여름"], affiliate: false, checkedAt: "2026.07.09", problem: "음식물 냄새", sellers: ["온라인몰 3,500원"] },
  { id: "laundry-net", name: "대형 이불 세탁망", brand: "런드리핏", price: 7900, discount: "10%", rating: 4.6, reviews: 376, tags: ["침구", "제휴"], affiliate: true, checkedAt: "2026.07.09", problem: "침구 세탁", sellers: ["쿠팡 7,900원", "네이버쇼핑 8,200원"] },
  { id: "neutral-detergent", name: "이불용 중성세제 1L", brand: "소프트워시", price: 8900, discount: "0%", rating: 4.7, reviews: 454, tags: ["세탁", "저자극"], affiliate: false, checkedAt: "2026.07.09", problem: "침구 세탁", sellers: ["네이버쇼핑 8,900원"] },
  { id: "washer-cleaner", name: "세탁조 클리너 2입", brand: "통세척", price: 4900, discount: "7%", rating: 4.8, reviews: 934, tags: ["세탁조", "추천"], affiliate: true, checkedAt: "2026.07.09", problem: "빨래 쉰내", sellers: ["쿠팡 4,900원", "B마트 5,200원"] },
  { id: "strainer-net", name: "일회용 배수구 거름망 100매", brand: "싱크핏", price: 4500, discount: "0%", rating: 4.6, reviews: 298, tags: ["주방", "소모품"], affiliate: false, checkedAt: "2026.07.09", problem: "싱크대 냄새", sellers: ["B마트 4,500원"] },
  { id: "degreaser", name: "주방 기름때 세정제", brand: "그리스컷", price: 5400, discount: "6%", rating: 4.4, reviews: 412, tags: ["주방", "제휴"], affiliate: true, checkedAt: "2026.07.09", problem: "기름때", sellers: ["쿠팡 5,400원", "네이버쇼핑 5,900원"] },
  { id: "fly-trap", name: "초파리 트랩 3개입", brand: "썸머케어", price: 7800, discount: "0%", rating: 4.1, reviews: 198, tags: ["여름", "발생형"], affiliate: false, checkedAt: "2026.07.09", problem: "초파리", sellers: ["온라인몰 7,800원"] },
  { id: "roller-refill", name: "롤클리너 리필 6입", brand: "플로어핏", price: 6200, discount: "5%", rating: 4.7, reviews: 377, tags: ["바닥", "소모품"], affiliate: true, checkedAt: "2026.07.09", problem: "머리카락", sellers: ["B마트 6,200원", "쿠팡 6,500원"] },
];

const services = [
  {
    id: "bath-care",
    title: "욕실 집중 청소",
    icon: "bath",
    description: "줄눈, 물때, 배수구 냄새를 부분 청소 단위로 맡겨요.",
    basePrice: 39000,
    unit: "1회",
    taskId: "bath",
    guideId: "bathMold",
    partners: [
      { id: "miso-bath", name: "미소 부분 청소", price: 39000, rating: 4.8, reviews: 1240, region: "서울 전역", scope: "욕실 바닥, 세면대, 줄눈, 배수구", exclude: "실리콘 재시공, 타일 교체", insurance: "영업배상책임보험", affiliate: true, badge: "가장 많이 선택" },
      { id: "local-bath", name: "로컬 욕실 케어", price: 35000, rating: 4.6, reviews: 311, region: "마포·서대문", scope: "욕실 1칸 집중 케어", exclude: "배관 공사", insurance: "업체 보상 정책", affiliate: false, badge: "부분 청소" },
      { id: "deep-bath", name: "청연 심화 케어", price: 69000, rating: 4.7, reviews: 890, region: "수도권", scope: "곰팡이 심화, 물때, 배수구", exclude: "줄눈 재시공 별도", insurance: "60일 AS 안내", affiliate: false, badge: "심화 케어" },
    ],
  },
  {
    id: "trash-pickup",
    title: "문앞 수거",
    icon: "trash",
    description: "재활용과 음식물 배출이 반복해서 밀릴 때 정기 수거를 연결해요.",
    basePrice: 9900,
    unit: "월",
    taskId: "trash",
    guideId: "trashSort",
    partners: [
      { id: "today-pickup", name: "오늘수거", price: 15900, rating: 4.9, reviews: 3105, region: "서울·경기·인천 일부", scope: "주 2회 문앞 수거, 분리수거 지원", exclude: "대형폐기물 별도", insurance: "파트너 보상 정책", affiliate: true, badge: "정기 추천" },
      { id: "covering", name: "커버링", price: 9900, rating: 4.6, reviews: 1872, region: "서울 일부", scope: "주 1회 정기 수거", exclude: "음식물 별도 지역 있음", insurance: "고객센터 접수", affiliate: false, badge: "저가 시작" },
      { id: "local-pickup", name: "로컬 수거팀", price: 0, rating: 4.5, reviews: 214, region: "동네별 상이", scope: "대형폐기물, 맞춤 수거", exclude: "견적 후 확정", insurance: "업체별 상이", affiliate: false, badge: "견적형" },
    ],
  },
  {
    id: "laundry-pickup",
    title: "침구·세탁 수거",
    icon: "laundry",
    description: "이불, 수건, 운동화처럼 부피 있는 세탁을 문앞 수거로 처리해요.",
    basePrice: 12000,
    unit: "품목",
    taskId: "bedding",
    guideId: "beddingWash",
    partners: [
      { id: "laundrygo", name: "런드리고", price: 14000, rating: 4.8, reviews: 2040, region: "수도권 주요 지역", scope: "비대면 수거·배송, 이불 세탁", exclude: "오염 심화 추가비", insurance: "분실/훼손 보상 안내", affiliate: true, badge: "구독 보유" },
      { id: "washswat", name: "세탁특공대", price: 11000, rating: 4.7, reviews: 1760, region: "수도권", scope: "이불, 운동화, 물세탁", exclude: "특수 소재 별도", insurance: "고객 보상 정책", affiliate: false, badge: "저가 대안" },
      { id: "cleantopia", name: "크린토피아", price: 9000, rating: 4.4, reviews: 980, region: "전국 지점", scope: "지점 접수와 일부 수거", exclude: "수거 가능 지역 상이", insurance: "지점 정책", affiliate: false, badge: "오프라인" },
    ],
  },
  {
    id: "kitchen-care",
    title: "주방 부분 청소",
    icon: "kitchen",
    description: "배수구 냄새, 기름때, 후드 필터를 문제 단위로 정리해요.",
    basePrice: 42000,
    unit: "1회",
    taskId: "kitchen",
    guideId: "sinkSmell",
    partners: [
      { id: "miso-kitchen", name: "미소 주방 케어", price: 42000, rating: 4.8, reviews: 1064, region: "서울 전역", scope: "싱크대, 배수구, 가스레인지", exclude: "후드 내부 덕트", insurance: "영업배상책임보험", affiliate: true, badge: "제휴" },
      { id: "hood-pro", name: "후드 전문 케어", price: 69000, rating: 4.6, reviews: 420, region: "수도권", scope: "후드 필터, 주변 기름때", exclude: "덕트 전체 교체", insurance: "AS 30일", affiliate: false, badge: "전문" },
    ],
  },
  {
    id: "pest-care",
    title: "해충·방역",
    icon: "pest",
    description: "발생원을 줄이고 반복 발생은 전문 방역으로 연결해요.",
    basePrice: 45000,
    unit: "1회",
    taskId: "pest",
    guideId: "pestFly",
    partners: [
      { id: "pest-local", name: "로컬 방역 파트너", price: 45000, rating: 4.5, reviews: 283, region: "서울 일부", scope: "초파리, 개미, 바퀴 초기 방역", exclude: "건물 전체 방역", insurance: "업체 보상 정책", affiliate: false, badge: "발생형" },
      { id: "pest-pro", name: "방역 전문팀", price: 79000, rating: 4.7, reviews: 530, region: "수도권", scope: "원인 점검, 약제 처리, 재방문", exclude: "구조 보수", insurance: "재방문 보증", affiliate: true, badge: "제휴" },
    ],
  },
  {
    id: "home-clean",
    title: "2시간 부분 청소",
    icon: "floor",
    description: "바닥, 먼지, 현관처럼 반복해서 밀리는 공간을 짧게 맡겨요.",
    basePrice: 34900,
    unit: "2시간",
    taskId: "floor",
    guideId: "floorDust",
    partners: [
      { id: "miso-home", name: "미소 2시간 청소", price: 34900, rating: 4.8, reviews: 2160, region: "서울 전역", scope: "바닥, 먼지, 주방 표면", exclude: "심화 오염, 창틀", insurance: "영업배상책임보험", affiliate: true, badge: "짧은 외주" },
      { id: "local-home", name: "동네 청소 파트너", price: 30000, rating: 4.5, reviews: 321, region: "동네별 상이", scope: "바닥, 현관, 간단 정리", exclude: "전문 장비 작업", insurance: "업체별 상이", affiliate: false, badge: "근거리" },
    ],
  },
];

let bookings = [];

let logs = [
  { id: 1, title: "바닥 먼지 정리", method: "SELF", date: "2026-07-08T18:00:00+09:00", owner: "하우" },
  { id: 2, title: "싱크대 배수구 클리너 확인", method: "COMMERCE", date: "2026-07-04T21:00:00+09:00", owner: "보송" },
  { id: 3, title: "침구 세탁", method: "SELF", date: "2026-06-27T12:00:00+09:00", owner: "하우" },
  { id: 4, title: "쓰레기 수거 예약", method: "PARTNER", date: "2026-06-24T20:00:00+09:00", owner: "보송" },
];

const members = [
  { name: "김보송", role: "욕실·주방 담당", count: 8 },
  { name: "이하우", role: "침구·바닥 담당", count: 5 },
];

const community = {
  guide: [
    { id: "bathMold", type: "관리자 가이드", title: "타일 줄눈 곰팡이, 어디까지 직접 할 수 있을까요?", meta: "욕실 · 15분 · 관련 청소템/서비스", body: "줄눈 표면 곰팡이는 직접 해결할 수 있지만, 깊이 침투했거나 실리콘이 손상된 경우는 전문가 기준선에 해당합니다." },
    { id: "trashSort", type: "관리자 가이드", title: "분리수거가 밀릴 때 5분 정리 순서", meta: "수거 · 5분 · 정기 수거 연결", body: "재질별로 먼저 나누고, 오염된 용기를 헹군 뒤 지역 배출 요일에 맞춰 정리합니다." },
    { id: "sinkSmell", type: "관리자 가이드", title: "싱크대 냄새는 거름망과 배수구를 같이 봐야 해요", meta: "주방 · 10분 · 준비물 2개", body: "냄새 원인은 거름망보다 안쪽 부품에 남은 찌꺼기인 경우가 많습니다." },
  ],
  qa: [
    { id: "qa1", type: "Q&A", title: "대리석 세면대에 물때 제거제를 써도 되나요?", meta: "답변 4 · 욕실 · 소재 주의", body: "산성 세제가 표면을 상하게 할 수 있어요. 중성세제와 부드러운 천을 먼저 권장합니다." },
    { id: "qa2", type: "Q&A", title: "수건 냄새가 세탁 후에도 남아요", meta: "답변 7 · 세탁 · 세탁조", body: "세탁조, 고무패킹, 건조 시간 세 가지를 함께 확인해야 합니다." },
    { id: "qa3", type: "Q&A", title: "음식물 쓰레기 냄새를 줄이는 현실적인 방법이 있을까요?", meta: "답변 5 · 수거 · 여름", body: "물기 제거와 배출 주기 단축이 가장 효과적입니다." },
  ],
  talk: [
    { id: "talk1", type: "잡담", title: "이번 주는 욕실만 해도 충분한 주였어요", meta: "댓글 12 · 보송", body: "모든 걸 다 하려다 포기하는 것보다 하나만 끝내는 쪽이 오래 갑니다." },
    { id: "talk2", type: "잡담", title: "자취 시작 키트에서 정말 필요한 것만 고르면?", meta: "댓글 9 · 초보", body: "중성세제, 고무장갑, 극세사 천, 배수구망이면 첫 달은 충분하다는 의견이 많아요." },
  ],
};

function dayDiff(iso) {
  return Math.max(0, Math.floor((TODAY.getTime() - new Date(iso).getTime()) / MS_PER_DAY));
}

function addDays(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function fmtDate(input) {
  const date = typeof input === "string" ? new Date(input) : input;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function money(value) {
  if (!value) return "견적";
  return `${value.toLocaleString("ko-KR")}원`;
}

function taskStatus(task) {
  if (task.bookingId) return "booked";
  const ratio = dayDiff(task.lastDoneAt) / task.cycleDays;
  if (ratio >= 1) return "late";
  if (ratio >= 0.7) return "soon";
  return "good";
}

function taskStatusText(task) {
  const status = taskStatus(task);
  if (status === "booked") {
    const booking = bookings.find((item) => item.id === task.bookingId);
    return booking ? `${booking.date} ${booking.time}` : "예약 확인";
  }
  const elapsed = dayDiff(task.lastDoneAt);
  if (status === "late") return `${elapsed - task.cycleDays}일 지연`;
  if (status === "soon") return `${task.cycleDays - elapsed}일 뒤 권장`;
  return `${task.cycleDays - elapsed}일 남음`;
}

function dueDate(task) {
  return fmtDate(addDays(new Date(task.lastDoneAt), task.cycleDays));
}

function iconSvg(type) {
  const icons = {
    bath: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 11h12v4.5A4.5 4.5 0 0 1 13.5 20h-3A4.5 4.5 0 0 1 6 15.5V11Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V7a3 3 0 0 1 5.7-1.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 11h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    trash: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 8h8l-.8 12H8.8L8 8Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 8h10M10 8V5h4v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    laundry: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="5" y="3.5" width="14" height="17" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="14" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 7h.01M11 7h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    kitchen: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 13h14v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-3Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 9c0-2 1.5-3 3-3s3 1 3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    pest: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="13" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 9 6 7M16 9l2-2M7 14H4M20 14h-3M9 17l-2 2M15 17l2 2M12 8V5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    floor: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 18c4-3 10-3 14 0M7 13c3-2 7-2 10 0M9 8c2-1 4-1 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    product: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  };
  return icons[type] || icons.product;
}

function render() {
  renderHome();
  renderSolve();
  renderRoutine();
  renderCommunity();
  renderMy();
}

function renderHome() {
  const resolved = tasks.filter((task) => taskStatus(task) === "good").length;
  const meterValue = 219.91 * (1 - resolved / tasks.length);
  document.getElementById("weeklyMeter").style.strokeDashoffset = meterValue;
  document.getElementById("weeklyMeterText").textContent = `${resolved}/${tasks.length}`;
  const needs = tasks.filter((task) => ["late", "soon", "booked"].includes(taskStatus(task))).length;
  document.getElementById("weeklySummary").textContent = needs === 0 ? "이번 주 클리어" : `${needs}개 확인`;

  document.getElementById("statusGrid").innerHTML = tasks.map((task) => {
    const status = taskStatus(task);
    const meta = statusMeta[status];
    return `<button class="status-card ${meta.className}" type="button" onclick="openTaskSummary('${task.id}')">
      <span class="status-icon">${iconSvg(task.icon)}</span>
      <strong>${task.short}</strong>
      <span>${meta.label} · ${taskStatusText(task)}</span>
    </button>`;
  }).join("");

  const urgentTasks = tasks
    .filter((task) => taskStatus(task) !== "good")
    .sort((a, b) => {
      const order = { late: 0, booked: 1, soon: 2, good: 3 };
      return order[taskStatus(a)] - order[taskStatus(b)];
    });

  document.getElementById("urgentList").innerHTML = urgentTasks.length
    ? urgentTasks.map(taskCard).join("")
    : `<div class="task-card"><div class="task-title">오늘은 크게 밀린 항목이 없어요.</div><div class="task-meta">필요하면 주기 보드에서 완료 기록만 남겨도 돼요.</div></div>`;

  const activeBookings = bookings.filter((booking) => booking.status !== "done");
  document.getElementById("bookingSection").style.display = activeBookings.length ? "block" : "none";
  document.getElementById("bookingList").innerHTML = activeBookings.map(bookingCard).join("");

  document.getElementById("quickTasks").innerHTML = [
    { taskId: "bath", title: "배수구 머리카락 제거", meta: "욕실 · 5분" },
    { taskId: "floor", title: "현관 먼지 쓸기", meta: "바닥 · 5분" },
    { taskId: "kitchen", title: "거름망 비우기", meta: "주방 · 3분" },
  ].map((item) => `<article class="quick-card">
    <strong>${item.title}</strong>
    <span>${item.meta}</span>
    <button class="small-button" type="button" style="margin-top:10px;width:100%;" onclick="completeTask('${item.taskId}', 'SELF', '${item.title}')">완료</button>
  </article>`).join("");
}

function taskCard(task) {
  const status = taskStatus(task);
  const meta = statusMeta[status];
  const booking = task.bookingId ? bookings.find((item) => item.id === task.bookingId) : null;
  const actionLabel = status === "booked" ? "예약" : status === "late" ? "지연" : "임박";
  return `<article class="task-card">
    <div class="task-top">
      <div class="category-icon">${iconSvg(task.icon)}</div>
      <div class="task-main">
        <div class="task-title">${task.title}</div>
        <div class="task-meta">마지막 ${fmtDate(task.lastDoneAt)} · 다음 ${dueDate(task)} · 담당 ${task.owner}</div>
        ${booking ? `<div class="task-meta">${booking.partnerName} · ${booking.date} ${booking.time}</div>` : ""}
      </div>
      <span class="pill ${meta.className}">${actionLabel}</span>
    </div>
    <div class="task-actions">
      <button class="secondary-button" type="button" onclick="openIssueFlow('${task.id}')">방법</button>
      <button class="ghost-button" type="button" onclick="startBooking('${task.serviceId}', '${task.id}')">예약</button>
      <button class="primary-button" type="button" onclick="completeTask('${task.id}', 'SELF')">완료</button>
    </div>
  </article>`;
}

function bookingCard(booking) {
  return `<article class="booking-card">
    <div class="community-top">
      <div>
        <div class="task-title">${booking.partnerName}</div>
        <div class="task-meta">${booking.serviceTitle} · ${booking.date} ${booking.time}</div>
      </div>
      <span class="pill booked">예약됨</span>
    </div>
    <div class="task-actions two">
      <button class="secondary-button" type="button" onclick="openBookingDetail('${booking.id}')">상세</button>
      <button class="primary-button" type="button" onclick="completeBooking('${booking.id}')">완료 처리</button>
    </div>
  </article>`;
}

function renderSolve() {
  document.getElementById("serviceGrid").innerHTML = services.map((service) => `<button class="service-card" type="button" onclick="openIssueFlow('${service.taskId}')">
    <div>
      <div class="category-icon">${iconSvg(service.icon)}</div>
      <h2>${service.title}</h2>
      <p>${service.description}</p>
    </div>
    <span class="pill info">${service.basePrice ? money(service.basePrice) + "부터" : "견적"}</span>
  </button>`).join("");

  document.getElementById("productStrip").innerHTML = products.slice(0, 6).map((product) => productCard(product)).join("");
}

function productCard(product) {
  return `<article class="product-card">
    <div class="product-thumb">${iconSvg("product")}</div>
    <div class="product-name">${product.name}</div>
    <div class="product-meta">${product.brand} · ${product.problem} · 후기 ${product.reviews}</div>
    <div class="tag-row">${product.tags.map((tag) => `<span class="tag ${tag === "제휴" ? "aff" : ""}">${tag}</span>`).join("")}</div>
    <div class="product-price">${money(product.price)} <span class="muted">· ${product.checkedAt}</span></div>
    <button class="small-button" type="button" style="margin-top:10px;width:100%;" onclick="openProductDetail('${product.id}')">보기</button>
  </article>`;
}

function renderRoutine() {
  const filters = ["전체", "욕실", "수거", "침구", "주방", "바닥", "방역"];
  document.getElementById("routineFilters").innerHTML = filters.map((filter) => `<button class="filter-chip ${state.routineFilter === filter ? "active" : ""}" type="button" onclick="setRoutineFilter('${filter}')">${filter}</button>`).join("");
  const filtered = state.routineFilter === "전체"
    ? tasks
    : tasks.filter((task) => task.category.includes(state.routineFilter) || task.short === state.routineFilter);
  document.getElementById("routineList").innerHTML = filtered.map((task) => {
    const status = taskStatus(task);
    const meta = statusMeta[status];
    return `<article class="routine-card">
      <div class="routine-top">
        <div class="category-icon">${iconSvg(task.icon)}</div>
        <div class="routine-main">
          <div class="routine-title">${task.title}</div>
          <div class="routine-meta">마지막 ${fmtDate(task.lastDoneAt)} · ${task.cycleDays}일 주기 · 다음 ${dueDate(task)} · 담당 ${task.owner}</div>
        </div>
        <span class="pill ${meta.className}">${meta.label}</span>
      </div>
      <div class="routine-actions">
        <button class="secondary-button" type="button" onclick="openIssueFlow('${task.id}')">방법</button>
        <button class="ghost-button" type="button" onclick="snoozeTask('${task.id}')">미루기</button>
        <button class="primary-button" type="button" onclick="completeTask('${task.id}', 'SELF')">완료</button>
      </div>
    </article>`;
  }).join("");
}

function renderCommunity() {
  document.querySelectorAll("[data-community-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.communityTab === state.communityTab);
  });
  document.getElementById("communityList").innerHTML = community[state.communityTab].map((post) => `<article class="community-card" onclick="openCommunityPost('${state.communityTab}', '${post.id}')">
    <div class="community-top">
      <div>
        <span class="pill ${post.type === "관리자 가이드" ? "info" : "neutral"}">${post.type}</span>
        <div class="community-title" style="margin-top:9px;">${post.title}</div>
        <div class="community-meta">${post.meta}</div>
      </div>
    </div>
    <p>${post.body}</p>
  </article>`).join("");
}

function renderMy() {
  const total = logs.length;
  const self = logs.filter((log) => log.method === "SELF").length;
  const partner = logs.filter((log) => log.method === "PARTNER").length;
  document.getElementById("myStats").innerHTML = [
    { label: "이번 달", value: total },
    { label: "직접 해결", value: self },
    { label: "예약 해결", value: partner },
  ].map((item) => `<div class="stat-card"><strong>${item.value}</strong><span>${item.label}</span></div>`).join("");

  const levels = [1, 0, 2, 1, 0, 1, 2, 1, 3, 2, 2, Math.min(3, Math.max(1, total - 2))];
  document.getElementById("footprintGrid").innerHTML = levels.map((level, index) => `<div class="foot-cell ${level ? `l${level}` : ""} ${index === levels.length - 1 ? "now" : ""}"></div>`).join("");

  document.getElementById("historyList").innerHTML = logs.slice(0, 7).map((log) => `<article class="history-card">
    <div class="category-icon">${methodIcon(log.method)}</div>
    <div>
      <div class="task-title">${log.title}</div>
      <div class="history-meta">${fmtDate(log.date)} · ${methodLabel(log.method)} · ${log.owner}</div>
    </div>
  </article>`).join("");

  document.getElementById("memberList").innerHTML = members.map((member) => `<article class="member-card">
    <div class="avatar" aria-hidden="true">${member.name.slice(0, 1)}</div>
    <div>
      <div class="task-title">${member.name}</div>
      <div class="member-meta">${member.role} · 최근 완료 ${member.count}건</div>
    </div>
  </article>`).join("");
}

function methodIcon(method) {
  if (method === "PARTNER") return iconSvg("product");
  if (method === "COMMERCE") return iconSvg("product");
  return '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 12.5 10 16l8-9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function methodLabel(method) {
  return { SELF: "직접 해결", COMMERCE: "청소템 확인", PARTNER: "맡겨서 해결", SUBSCRIPTION: "정기 연결" }[method] || method;
}

function setRoutineFilter(filter) {
  state.routineFilter = filter;
  renderRoutine();
}

function showView(view) {
  state.activeView = view;
  document.querySelectorAll(".view").forEach((node) => {
    node.classList.toggle("active", node.id === `view-${view}`);
  });
  document.querySelectorAll(".tab-button").forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  document.getElementById("views").scrollTop = 0;
}

function openSheet({ step = "클린루프", title, sub = "", body }) {
  document.getElementById("sheetStep").textContent = step;
  document.getElementById("sheetTitle").textContent = title;
  document.getElementById("sheetSub").textContent = sub;
  document.getElementById("sheetBody").innerHTML = body;
  document.getElementById("sheetBackdrop").classList.add("open");
}

function closeSheet() {
  document.getElementById("sheetBackdrop").classList.remove("open");
}

function stepper(current, total = 4) {
  return `<div class="stepper">${Array.from({ length: total }, (_, index) => `<span class="${index < current ? "active" : ""}"></span>`).join("")}</div>`;
}

function openTaskSummary(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  const status = taskStatus(task);
  const meta = statusMeta[status];
  openSheet({
    step: task.category,
    title: task.title,
    sub: `마지막 ${fmtDate(task.lastDoneAt)} · 다음 ${dueDate(task)} · 담당 ${task.owner}`,
    body: `<div class="notice-box">
      <h3>현재 상태</h3>
      <p>${meta.label} 상태예요. ${status === "late" ? "오늘은 방법을 확인하거나 전문가 예약을 볼 수 있어요." : status === "booked" ? "예약이 끝나면 완료 처리로 다음 주기를 잡을 수 있어요." : "필요하면 가이드만 확인해도 돼요."}</p>
    </div>
    <div class="sheet-actions">
      <button class="secondary-button" type="button" onclick="openIssueFlow('${task.id}')">방법 보기</button>
      <button class="ghost-button" type="button" onclick="startBooking('${task.serviceId}', '${task.id}')">예약 견적</button>
      <button class="primary-button" type="button" onclick="completeTask('${task.id}', 'SELF')">완료</button>
    </div>`,
  });
}

function openIssueFlow(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  state.flow = { taskId, guideId: task.defaultGuide };
  openSheet({
    step: "STEP 1 / 4",
    title: `${task.category} 문제 선택`,
    sub: "가장 가까운 문제를 고르면 현장에서 바로 볼 수 있는 가이드를 보여드려요.",
    body: `${stepper(1)}
      <div class="option-grid">
        ${task.guideOptions.map((guideId) => {
          const guide = guides[guideId];
          return `<button class="option-card" type="button" onclick="selectGuide('${guideId}')">
            <strong>${guide.title}</strong>
            <span>${guide.duration} · 난이도 ${guide.difficulty}</span>
          </button>`;
        }).join("")}
      </div>`,
  });
}

function selectGuide(guideId) {
  state.flow.guideId = guideId;
  renderGuideStep();
}

function renderGuideStep() {
  const guide = guides[state.flow.guideId];
  openSheet({
    step: "STEP 2 / 4",
    title: guide.title,
    sub: `${guide.duration} · 난이도 ${guide.difficulty}`,
    body: `${stepper(2)}
      <div class="guide-block">
        <h3>먼저 확인할 것</h3>
        <ul>${guide.checks.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="guide-block">
        <h3>준비물</h3>
        <ul>${guide.tools.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="guide-block">
        <h3>순서</h3>
        <ol>${guide.steps.map((item) => `<li>${item}</li>`).join("")}</ol>
      </div>
      <div class="notice-box"><h3>안전 주의</h3><p>${guide.warnings}</p></div>
      <div class="sheet-actions two">
        <button class="ghost-button" type="button" onclick="openProductsForGuide('${state.flow.guideId}')">청소템</button>
        <button class="primary-button" type="button" onclick="renderCompareStep()">도구·예약 비교</button>
      </div>`,
  });
}

function renderCompareStep() {
  const guide = guides[state.flow.guideId];
  const service = services.find((item) => item.id === guide.serviceId);
  const relatedProducts = guide.productIds.map((id) => products.find((item) => item.id === id)).filter(Boolean);
  openSheet({
    step: "STEP 3 / 4",
    title: "직접 해결과 맡기기 비교",
    sub: "구매하지 않고 되는 방법과 전문가 기준선을 함께 보여드려요.",
    body: `${stepper(3)}
      <div class="notice-box"><h3>전문가 기준선</h3><p>${guide.expert}</p></div>
      <div class="guide-block">
        <h3>필요한 청소템</h3>
        <div class="stack">${relatedProducts.map((product) => `<article class="product-card" style="min-width:0;">
          <div class="product-name">${product.name}</div>
          <div class="product-meta">${product.problem} · 평점 ${product.rating} · 후기 ${product.reviews}</div>
          <div class="product-price">${money(product.price)} <span class="muted">· ${product.checkedAt}</span></div>
          <div class="tag-row">${product.tags.map((tag) => `<span class="tag ${tag === "제휴" ? "aff" : ""}">${tag}</span>`).join("")}</div>
        </article>`).join("")}</div>
      </div>
      <div class="guide-block">
        <h3>맡길 수 있는 서비스</h3>
        <div class="partner-title">${service.title}</div>
        <div class="partner-meta">${money(service.basePrice)}부터 · ${service.description}</div>
      </div>
      <div class="sheet-actions">
        <button class="ghost-button" type="button" onclick="completeFromFlow('SELF')">직접 완료</button>
        <button class="secondary-button" type="button" onclick="openProductsForGuide('${state.flow.guideId}')">청소템 보기</button>
        <button class="primary-button" type="button" onclick="startBooking('${service.id}', '${guide.taskId}')">예약 견적</button>
      </div>`,
  });
}

function completeFromFlow(method) {
  const guide = guides[state.flow.guideId];
  const task = tasks.find((item) => item.id === guide.taskId);
  task.lastDoneAt = TODAY.toISOString();
  task.bookingId = null;
  logs.unshift({ id: Date.now(), title: guide.title, method, date: TODAY.toISOString(), owner: task.owner });
  render();
  openSheet({
    step: "STEP 4 / 4",
    title: "해결했어요",
    sub: "다음 점검일은 자동으로 다시 잡아둘게요.",
    body: `${stepper(4)}
      <div class="notice-box"><h3>${task.category} 주기 갱신</h3><p>${fmtDate(addDays(TODAY, task.cycleDays))}에 다시 확인하면 충분해요.</p></div>
      <button class="primary-button" type="button" style="width:100%;" onclick="closeSheet(); showView('home')">홈으로 돌아가기</button>`,
  });
}

function openProductsForGuide(guideId) {
  const guide = guides[guideId];
  const relatedProducts = guide.productIds.map((id) => products.find((item) => item.id === id)).filter(Boolean);
  openSheet({
    step: "청소템",
    title: `${guide.title} 준비물`,
    sub: "가격은 예시이며 외부 판매처에서 최종 확인해야 해요.",
    body: `<div class="stack">${relatedProducts.map((product) => productDetailBlock(product)).join("")}</div>
      <div class="notice-box" style="margin-top:12px;"><h3>제휴 안내</h3><p>제휴 표시가 있는 판매처로 이동하면 클린루프가 수수료를 받을 수 있어요. 추천 순서는 제휴 여부만으로 정하지 않습니다.</p></div>`,
  });
}

function openProductDetail(productId) {
  const product = products.find((item) => item.id === productId);
  openSheet({
    step: "청소템",
    title: product.name,
    sub: `${product.brand} · ${product.problem}`,
    body: `${productDetailBlock(product)}
      <div class="notice-box"><h3>가격 안내</h3><p>표시 가격은 ${product.checkedAt} 확인한 예시입니다. 실시간 최저가를 보장하지 않으며, 구매는 외부 판매처에서 진행돼요.</p></div>`,
  });
}

function productDetailBlock(product) {
  return `<article class="product-card" style="min-width:0;">
    <div class="product-thumb">${iconSvg("product")}</div>
    <div class="product-name">${product.name}</div>
    <div class="product-meta">${product.brand} · 평점 ${product.rating} · 후기 ${product.reviews}</div>
    <div class="tag-row">${product.tags.map((tag) => `<span class="tag ${tag === "제휴" ? "aff" : ""}">${tag}</span>`).join("")}</div>
    <div class="product-price">${money(product.price)} <span class="muted">· ${product.checkedAt}</span></div>
    <div class="summary-list">${product.sellers.map((seller) => `<div class="summary-row"><span>${seller}</span><strong>외부</strong></div>`).join("")}</div>
    <button class="secondary-button" type="button" style="width:100%;" onclick="toast('외부 판매처 이동 CTA 예시입니다.')">판매처 보기</button>
  </article>`;
}

function startBooking(serviceId, taskId = "") {
  const service = services.find((item) => item.id === serviceId);
  state.bookingDraft = {
    serviceId,
    taskId: taskId || service.taskId,
    homeType: "원룸",
    area: "10평 이하",
    condition: "보통",
    date: "7월 12일",
    time: "오전 10시",
    partnerId: service.partners[0].id,
  };
  state.bookingStep = 1;
  renderBookingStep();
}

function renderBookingStep() {
  const draft = state.bookingDraft;
  const service = services.find((item) => item.id === draft.serviceId);
  const task = tasks.find((item) => item.id === draft.taskId);
  const selectedPartner = service.partners.find((partner) => partner.id === draft.partnerId);

  if (state.bookingStep === 1) {
    openSheet({
      step: "예약 STEP 1 / 4",
      title: service.title,
      sub: "공간과 오염도를 고르면 예상 견적을 좁혀볼게요.",
      body: `${stepper(1)}
        <div class="guide-block"><h3>서비스 범위</h3><p class="product-meta">${service.description}</p></div>
        ${bookingOptions("거주 형태", "homeType", ["원룸", "오피스텔", "아파트", "빌라"])}
        ${bookingOptions("평수", "area", ["10평 이하", "11~20평", "21~30평", "31평 이상"])}
        ${bookingOptions("오염도", "condition", ["가벼움", "보통", "심함"])}
        <button class="primary-button" type="button" style="width:100%;" onclick="nextBookingStep()">일정 선택</button>`,
    });
    return;
  }

  if (state.bookingStep === 2) {
    openSheet({
      step: "예약 STEP 2 / 4",
      title: "일정 선택",
      sub: "MVP에서는 예약 가능 시간을 정적 데이터로 보여줘요.",
      body: `${stepper(2)}
        ${bookingOptions("날짜", "date", ["7월 12일", "7월 13일", "7월 15일", "7월 18일"])}
        ${bookingOptions("시간", "time", ["오전 10시", "오후 2시", "저녁 7시"])}
        <div class="sheet-actions two">
          <button class="ghost-button" type="button" onclick="prevBookingStep()">이전</button>
          <button class="primary-button" type="button" onclick="nextBookingStep()">견적 보기</button>
        </div>`,
    });
    return;
  }

  if (state.bookingStep === 3) {
    openSheet({
      step: "예약 STEP 3 / 4",
      title: "견적과 전문가 매칭",
      sub: `${draft.homeType} · ${draft.area} · 오염도 ${draft.condition}`,
      body: `${stepper(3)}
        <div class="stack">${service.partners.map((partner) => partnerCard(partner, service)).join("")}</div>
        <div class="notice-box"><h3>가격 기준</h3><p>지역, 일자, 평수, 오염도, 추가 작업에 따라 실제 가격은 달라질 수 있어요. 카드에는 제공 범위와 제외 범위를 함께 표시합니다.</p></div>
        <div class="sheet-actions two">
          <button class="ghost-button" type="button" onclick="prevBookingStep()">이전</button>
          <button class="primary-button" type="button" onclick="nextBookingStep()">예약 확인</button>
        </div>`,
    });
    return;
  }

  openSheet({
    step: "예약 STEP 4 / 4",
    title: "예약 확인",
    sub: `${selectedPartner.name} · ${draft.date} ${draft.time}`,
    body: `${stepper(4)}
      <div class="summary-list">
        <div class="summary-row"><span>서비스</span><strong>${service.title}</strong></div>
        <div class="summary-row"><span>공간</span><strong>${draft.homeType} · ${draft.area}</strong></div>
        <div class="summary-row"><span>오염도</span><strong>${draft.condition}</strong></div>
        <div class="summary-row"><span>업체</span><strong>${selectedPartner.name}</strong></div>
        <div class="summary-row"><span>예상 가격</span><strong>${estimatePartnerPrice(selectedPartner)}</strong></div>
        <div class="summary-row"><span>제공 범위</span><strong>${selectedPartner.scope}</strong></div>
      </div>
      <div class="notice-box"><h3>중개 고지</h3><p>예약과 결제는 파트너와 진행돼요. 클린루프는 서비스 가능 정보와 연결을 돕는 중개자입니다.</p></div>
      <div class="sheet-actions two">
        <button class="ghost-button" type="button" onclick="prevBookingStep()">이전</button>
        <button class="primary-button" type="button" onclick="confirmBooking()">예약 확정</button>
      </div>`,
  });
}

function bookingOptions(label, field, options) {
  const value = state.bookingDraft[field];
  return `<div class="guide-block">
    <h3>${label}</h3>
    <div class="option-row">${options.map((option) => `<button class="option-chip ${value === option ? "active" : ""}" type="button" onclick="setBookingField('${field}', '${option}')">${option}</button>`).join("")}</div>
  </div>`;
}

function partnerCard(partner, service) {
  const selected = state.bookingDraft.partnerId === partner.id;
  return `<article class="partner-card ${selected ? "selected" : ""}" onclick="selectPartner('${partner.id}')">
    <div class="partner-head">
      <div>
        <div class="partner-title">${partner.name}</div>
        <div class="partner-meta">평점 ${partner.rating} · 후기 ${partner.reviews} · ${partner.region}</div>
      </div>
      <div class="partner-price">${estimatePartnerPrice(partner, service)}</div>
    </div>
    <div class="partner-tags">
      <span class="tag ${partner.affiliate ? "aff" : ""}">${partner.affiliate ? "제휴" : "비제휴"}</span>
      <span class="tag">${partner.badge}</span>
      <span class="tag">${partner.insurance}</span>
    </div>
    <div class="summary-list">
      <div class="summary-row"><span>제공</span><strong>${partner.scope}</strong></div>
      <div class="summary-row"><span>제외</span><strong>${partner.exclude}</strong></div>
    </div>
  </article>`;
}

function estimatePartnerPrice(partner) {
  if (!partner.price) return "견적";
  const draft = state.bookingDraft;
  const areaAdd = { "10평 이하": 0, "11~20평": 6000, "21~30평": 14000, "31평 이상": 26000 }[draft.area] || 0;
  const conditionAdd = { "가벼움": -3000, "보통": 0, "심함": 12000 }[draft.condition] || 0;
  return money(Math.max(0, partner.price + areaAdd + conditionAdd));
}

function setBookingField(field, value) {
  state.bookingDraft[field] = value;
  renderBookingStep();
}

function selectPartner(partnerId) {
  state.bookingDraft.partnerId = partnerId;
  renderBookingStep();
}

function nextBookingStep() {
  state.bookingStep = Math.min(4, state.bookingStep + 1);
  renderBookingStep();
}

function prevBookingStep() {
  state.bookingStep = Math.max(1, state.bookingStep - 1);
  renderBookingStep();
}

function confirmBooking() {
  const draft = state.bookingDraft;
  const service = services.find((item) => item.id === draft.serviceId);
  const partner = service.partners.find((item) => item.id === draft.partnerId);
  const booking = {
    id: `booking-${Date.now()}`,
    serviceId: service.id,
    serviceTitle: service.title,
    taskId: draft.taskId,
    partnerId: partner.id,
    partnerName: partner.name,
    date: draft.date,
    time: draft.time,
    price: estimatePartnerPrice(partner),
    status: "booked",
  };
  bookings.unshift(booking);
  const task = tasks.find((item) => item.id === draft.taskId);
  if (task) task.bookingId = booking.id;
  logs.unshift({ id: Date.now(), title: `${service.title} 예약`, method: "PARTNER", date: TODAY.toISOString(), owner: task ? task.owner : "보송" });
  render();
  closeSheet();
  showView("home");
  toast(`${partner.name} 예약이 잡혔어요. 예약 상태로 주기 보드에 반영했습니다.`);
}

function openBookingDetail(bookingId) {
  const booking = bookings.find((item) => item.id === bookingId);
  openSheet({
    step: "예약 상세",
    title: booking.partnerName,
    sub: `${booking.serviceTitle} · ${booking.date} ${booking.time}`,
    body: `<div class="summary-list">
      <div class="summary-row"><span>상태</span><strong>예약됨</strong></div>
      <div class="summary-row"><span>예상 가격</span><strong>${booking.price}</strong></div>
      <div class="summary-row"><span>일정</span><strong>${booking.date} ${booking.time}</strong></div>
    </div>
    <button class="primary-button" type="button" style="width:100%;" onclick="completeBooking('${booking.id}')">서비스 완료 처리</button>`,
  });
}

function completeBooking(bookingId) {
  const booking = bookings.find((item) => item.id === bookingId);
  if (!booking) return;
  booking.status = "done";
  const task = tasks.find((item) => item.id === booking.taskId);
  if (task) {
    task.bookingId = null;
    task.lastDoneAt = TODAY.toISOString();
  }
  logs.unshift({ id: Date.now(), title: `${booking.serviceTitle} 완료`, method: "PARTNER", date: TODAY.toISOString(), owner: task ? task.owner : "보송" });
  render();
  closeSheet();
  toast("서비스 완료를 기록했어요. 다음 점검일을 자동으로 잡았습니다.");
}

function completeTask(taskId, method = "SELF", title = "") {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;
  task.lastDoneAt = TODAY.toISOString();
  task.bookingId = null;
  logs.unshift({ id: Date.now(), title: title || task.title, method, date: TODAY.toISOString(), owner: task.owner });
  render();
  closeSheet();
  toast(`${title || task.title} 완료. 다음 권장일을 다시 계산했어요.`);
}

function snoozeTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;
  task.lastDoneAt = new Date(new Date(task.lastDoneAt).getTime() + MS_PER_DAY * 2).toISOString();
  render();
  toast(`${task.title}을 조금 미뤘어요. 반복해서 밀리면 주기 조정을 제안할게요.`);
}

function openCommunityPost(tab, postId) {
  const post = community[tab].find((item) => item.id === postId);
  if (tab === "guide") {
    state.flow = { taskId: guides[post.id].taskId, guideId: post.id };
    renderGuideStep();
    return;
  }
  openSheet({
    step: post.type,
    title: post.title,
    sub: post.meta,
    body: `<div class="guide-block"><p class="product-meta">${post.body}</p></div>
      <div class="sheet-actions two">
        <button class="ghost-button" type="button" onclick="toast('도움됨을 표시했어요.')">도움됨</button>
        <button class="secondary-button" type="button" onclick="toast('답변 작성 진입점 예시입니다.')">답변</button>
      </div>`,
  });
}

function openNotification() {
  document.getElementById("alertDot").classList.add("hidden");
  openSheet({
    step: "알림",
    title: "수거가 반복해서 밀릴 수 있어요",
    sub: "직접 정리하거나, 작은 단위의 정기 수거로 부담을 줄일 수 있어요.",
    body: `<div class="task-card">
      <div class="task-title">분리수거와 음식물 정리</div>
      <div class="task-meta">지금은 문앞 정기 수거가 가장 적합한 후보예요.</div>
      <div class="task-actions two">
        <button class="secondary-button" type="button" onclick="openIssueFlow('trash')">방법 보기</button>
        <button class="primary-button" type="button" onclick="startBooking('trash-pickup', 'trash')">정기 수거 보기</button>
      </div>
    </div>`,
  });
}

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

document.querySelectorAll("[data-view-link]").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.viewLink));
});

document.querySelectorAll("[data-community-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    state.communityTab = button.dataset.communityTab;
    renderCommunity();
  });
});

document.getElementById("sheetClose").addEventListener("click", closeSheet);
document.getElementById("sheetBackdrop").addEventListener("click", (event) => {
  if (event.target.id === "sheetBackdrop") closeSheet();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSheet();
});
document.getElementById("notificationButton").addEventListener("click", openNotification);
document.getElementById("openAllProducts").addEventListener("click", () => {
  openSheet({
    step: "청소템",
    title: "문제별 준비물",
    sub: "외부 판매처 이동 전 사용 맥락과 가격 기준을 먼저 확인해요.",
    body: `<div class="stack">${products.map((product) => productDetailBlock(product)).join("")}</div>`,
  });
});

render();
