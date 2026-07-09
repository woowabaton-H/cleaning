const MS_PER_DAY = 24 * 60 * 60 * 1000;
const TODAY = new Date("2026-07-10T12:00:00+09:00");

const iconPath = (name) => `../assets/icons/category-${name}.png`;
const imagePath = (name) => `../assets/images/${name}`;

const categoryPresets = [
  { id: "bath", name: "욕실", icon: "bath", defaultCycle: 14 },
  { id: "kitchen", name: "주방", icon: "kitchen", defaultCycle: 7 },
  { id: "laundry", name: "세탁/침구", icon: "laundry", defaultCycle: 14 },
  { id: "trash", name: "쓰레기/수거", icon: "trash", defaultCycle: 3 },
  { id: "floor", name: "바닥/먼지", icon: "floor", defaultCycle: 7 },
  { id: "season", name: "계절/가전", icon: "season", defaultCycle: 28 },
  { id: "pet", name: "반려동물", icon: "pet", defaultCycle: 7 },
];

const state = {
  activeView: "home",
  selectionFilter: "전체",
  communityTab: "tips",
  activePostId: null,
  activeSheet: null,
  addCycleDraft: null,
  toastTimer: null,
};

let categories = [
  { id: "bath", name: "욕실", icon: "bath", cycleDays: 14, lastDoneAt: "2026-06-26T09:00:00+09:00" },
  { id: "kitchen", name: "주방", icon: "kitchen", cycleDays: 7, lastDoneAt: "2026-07-03T20:00:00+09:00" },
  { id: "laundry", name: "세탁/침구", icon: "laundry", cycleDays: 14, lastDoneAt: "2026-06-23T12:00:00+09:00" },
  { id: "trash", name: "쓰레기/수거", icon: "trash", cycleDays: 3, lastDoneAt: "2026-07-08T21:00:00+09:00" },
  { id: "floor", name: "바닥/먼지", icon: "floor", cycleDays: 7, lastDoneAt: "2026-07-04T18:00:00+09:00" },
  { id: "season", name: "계절/가전", icon: "season", cycleDays: 28, lastDoneAt: "2026-06-24T19:00:00+09:00" },
];

let logs = [
  { id: 1, categoryName: "쓰레기/수거", icon: "trash", date: "2026-07-08T21:00:00+09:00", method: "직접 완료" },
  { id: 2, categoryName: "바닥/먼지", icon: "floor", date: "2026-07-04T18:00:00+09:00", method: "직접 완료" },
  { id: 3, categoryName: "주방", icon: "kitchen", date: "2026-07-03T20:00:00+09:00", method: "직접 완료" },
  { id: 4, categoryName: "욕실", icon: "bath", date: "2026-06-26T09:00:00+09:00", method: "직접 완료" },
  { id: 5, categoryName: "세탁/침구", icon: "laundry", date: "2026-06-23T12:00:00+09:00", method: "서비스 이용" },
];

let savedSelections = ["downy-odor"];

const selectionBanners = [
  {
    eyebrow: "셀렉션 이용법",
    title: "상품은 구매처와 가격을 함께 확인합니다",
    body: "실제 구매 전에는 배송비, 옵션, 재고를 한 번 더 확인하세요.",
  },
  {
    eyebrow: "이번 주 추천",
    title: "세탁 냄새 관리 제품 모아보기",
    body: "세탁/침구 카테고리에서 바로 살 수 있는 상품을 먼저 보여줍니다.",
  },
  {
    eyebrow: "서비스 안내",
    title: "침구 수거는 지역과 시간대를 먼저 봅니다",
    body: "예약형 서비스는 가능 지역과 수거 시간을 카드에 표시합니다.",
  },
];

const selectionItems = [
  {
    id: "downy-odor",
    type: "product",
    category: "세탁/침구",
    icon: "laundry",
    title: "다우니 오도 프로텍트 부스터",
    price: "12,900원대",
    rating: "4.8",
    reviews: "2,184",
    store: "쿠팡",
    image: imagePath("71IcdrweiBL._SL1500_.jpg"),
    summary: "운동복과 수건 냄새 관리에 쓰는 세탁 향 부스터",
    fitFor: "세탁 후에도 냄새가 남는 수건이나 운동복 관리",
    checks: ["세제 투입구가 아니라 세탁조에 직접 넣는 제품인지 확인하세요.", "향이 강할 수 있어 소량부터 쓰는 편이 안전합니다."],
    tags: ["세탁 냄새", "수건", "운동복"],
    highlight: true,
  },
  {
    id: "downy-light",
    type: "product",
    category: "세탁/침구",
    icon: "laundry",
    title: "다우니 라이트 오션 미스트",
    price: "18,900원대",
    rating: "4.7",
    reviews: "1,063",
    store: "네이버쇼핑",
    image: imagePath("laundry.jpeg"),
    summary: "향이 과하지 않은 타입의 세탁 향 부스터 2개 구성",
    fitFor: "강한 향보다 가벼운 세탁 향을 선호할 때",
    checks: ["묶음 수량과 용량을 구매처에서 확인하세요.", "민감한 피부라면 사용량을 줄여 테스트하세요."],
    tags: ["2개 구성", "세탁 향", "가벼운 향"],
  },
  {
    id: "laundrego-bedding",
    type: "service",
    category: "세탁/침구",
    icon: "laundry",
    title: "런드리고 침구 수거",
    price: "이불 16,000원대",
    rating: "4.7",
    reviews: "2,051",
    provider: "런드리고",
    summary: "부피 큰 침구를 문앞에서 수거하고 다시 배송하는 서비스",
    fitFor: "집 세탁기로 이불 세탁이 부담스럽거나 건조 공간이 부족할 때",
    checks: ["수거 가능 지역을 먼저 확인하세요.", "품목과 소재에 따라 가격이 달라질 수 있습니다."],
    tags: ["수거 배송", "침구", "지역 확인"],
    highlight: true,
  },
  {
    id: "today-pickup",
    type: "service",
    category: "쓰레기/수거",
    icon: "trash",
    title: "오늘수거 정기 수거",
    price: "월 9,900원부터",
    rating: "4.9",
    reviews: "3,105",
    provider: "오늘수거",
    summary: "주 1~2회 문앞 수거로 배출 요일을 놓치지 않게 돕는 서비스",
    fitFor: "퇴근 시간이 늦어 쓰레기 배출이 자주 밀릴 때",
    checks: ["건물 출입 방식과 수거 가능 지역을 확인하세요.", "분리배출 기준은 지역별로 다를 수 있습니다."],
    tags: ["정기 수거", "문앞", "지역 확인"],
  },
  {
    id: "miso-aircon",
    type: "service",
    category: "계절/가전",
    icon: "season",
    title: "미소 에어컨 청소",
    price: "79,000원대부터",
    rating: "4.7",
    reviews: "2,312",
    provider: "미소",
    summary: "송풍팬과 열교환기까지 분해 청소를 예약하는 방문 서비스",
    fitFor: "냄새가 심하거나 냉방 시즌 전에 깊게 청소하고 싶을 때",
    checks: ["기종에 따라 가격이 달라집니다.", "예약 전 실외기나 배관 포함 여부를 확인하세요."],
    tags: ["방문 예약", "분해청소", "기종 확인"],
    highlight: true,
  },
];

const community = {
  tips: [
    {
      id: "tip1",
      title: "욕실 물때는 세제보다 물기 제거가 먼저입니다",
      tag: "욕실",
      icon: "bath",
      body: "샤워 후 벽면과 거울의 물기를 바로 제거하면 물때가 쌓이는 속도가 확실히 느려집니다. 강한 세제를 쓰기 전에는 남아 있는 물기를 줄이는 루틴부터 만드는 편이 효율적입니다.",
      helpful: 128,
      comments: 24,
      saved: 64,
      time: "3분",
      level: "쉬움",
      safety: "환기",
      steps: ["샤워 후 벽면 위쪽부터 아래로 물기를 내립니다.", "수전 주변은 마른 천으로 한 번 더 닦습니다.", "스퀴지는 물이 고이지 않게 세워서 말립니다."],
      answers: ["물때 제거제를 매일 쓰는 것보다 물기 제거를 먼저 해보세요.", "거울 얼룩은 마른 극세사 천으로 마무리하면 덜 남습니다."],
    },
    {
      id: "tip2",
      title: "음식물 쓰레기는 탈취보다 배출 주기가 먼저입니다",
      tag: "수거",
      icon: "trash",
      body: "여름에는 탈취제를 추가하는 것보다 배출 간격을 줄이는 쪽이 냄새 재발을 줄이는 데 효과적입니다.",
      helpful: 104,
      comments: 18,
      saved: 43,
      time: "5분",
      level: "쉬움",
      safety: "냄새",
      steps: ["작은 봉투로 나눠 담습니다.", "물기를 최대한 빼고 밀봉합니다.", "배출 요일 전날 알림을 걸어둡니다."],
      answers: ["냉동 보관은 식품과 섞이지 않게 전용 용기를 써야 합니다.", "탈취제는 보조 수단으로만 두는 편이 좋습니다."],
    },
    {
      id: "tip3",
      title: "물걸레 전 롤클리너 한 번이면 바닥 청소가 줄어듭니다",
      tag: "바닥",
      icon: "floor",
      body: "머리카락과 큰 먼지를 먼저 걷어내면 물걸레가 밀리지 않고 바닥 자국도 덜 남습니다.",
      helpful: 91,
      comments: 15,
      saved: 38,
      time: "5분",
      level: "쉬움",
      safety: "바닥재",
      steps: ["방 입구에서 안쪽으로 롤클리너를 굴립니다.", "먼지가 많은 모서리를 먼저 정리합니다.", "마지막에 물걸레를 가볍게 사용합니다."],
      answers: ["강한 접착 롤러는 일부 러그나 매트에 붙을 수 있습니다.", "마루는 물걸레 물기를 많이 짜서 쓰는 편이 안전합니다."],
    },
  ],
  qa: [
    {
      id: "qa1",
      title: "대리석 세면대에 물때 제거제를 써도 되나요?",
      tag: "욕실",
      icon: "bath",
      body: "산성 세제는 대리석 표면을 상하게 할 수 있습니다. 전용 세제 또는 중성세제를 먼저 확인하는 답변이 가장 많이 도움을 받았습니다.",
      helpful: 88,
      comments: 6,
      saved: 22,
      time: "확인 필요",
      level: "주의",
      safety: "표면 손상",
      steps: ["제품 라벨에서 산성 여부를 확인합니다.", "눈에 띄지 않는 곳에 먼저 테스트합니다.", "확신이 없으면 중성세제로 시작합니다."],
      answers: ["대리석에는 산성 세제를 피하는 편이 안전합니다.", "연마제가 든 제품도 광택을 해칠 수 있습니다."],
    },
    {
      id: "qa2",
      title: "수건 냄새가 세탁 후에도 남으면 뭘 먼저 봐야 하나요?",
      tag: "세탁",
      icon: "laundry",
      body: "세탁조, 고무패킹, 건조 시간을 차례대로 확인해보라는 답변이 채택됐습니다.",
      helpful: 81,
      comments: 8,
      saved: 29,
      time: "10분",
      level: "보통",
      safety: "세탁조",
      steps: ["세탁조 클리너 사용 주기를 확인합니다.", "고무패킹 사이 물때를 닦습니다.", "수건은 세탁 후 바로 널거나 건조합니다."],
      answers: ["세제 양이 많아도 냄새가 남을 수 있습니다.", "건조 시간이 길어지면 냄새가 다시 올라옵니다."],
    },
  ],
};

function addDays(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function fmtDate(input) {
  const date = typeof input === "string" ? new Date(input) : input;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function nextDate(category) {
  return addDays(new Date(category.lastDoneAt), category.cycleDays);
}

function daysUntilNext(category) {
  return Math.ceil((nextDate(category).getTime() - TODAY.getTime()) / MS_PER_DAY);
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function categoryStatus(category) {
  if (isSameDay(new Date(category.lastDoneAt), TODAY)) return { key: "doneToday", days: 0 };
  const left = daysUntilNext(category);
  if (left < 0) return { key: "late", days: left };
  if (left === 0) return { key: "due", days: 0 };
  if (left <= 2) return { key: "soon", days: left };
  return { key: "good", days: left };
}

function statusDday(days) {
  if (days < 0) return `D+${Math.abs(days)}`;
  if (days === 0) return "D-DAY";
  return `D-${days}`;
}

function statusPriority(category) {
  const order = { late: 0, due: 1, soon: 2, doneToday: 3, good: 4 };
  return order[categoryStatus(category).key];
}

function weeklyDoneCount() {
  const weekStart = addDays(TODAY, -6);
  return logs.filter((log) => {
    const date = new Date(log.date);
    return date >= weekStart && date <= TODAY;
  }).length;
}

function iconTile(type, className = "") {
  return `<div class="category-icon ${className}" aria-hidden="true"><img src="${iconPath(type)}" alt="" /></div>`;
}

function productImage(item, className = "") {
  if (item.image) {
    return `<div class="product-image ${className}"><img src="${item.image}" alt="${item.title}" /></div>`;
  }
  return `<div class="product-image ${className} placeholder">${iconTile(item.icon)}</div>`;
}

function getPostById(id) {
  return [...community.tips, ...community.qa].find((post) => post.id === id);
}

function render() {
  renderHome();
  renderSelection();
  renderCommunity();
  renderMy();
  if (state.activePostId) renderCommunityDetail(state.activePostId);
}

function renderHome() {
  const counts = categories.reduce((acc, category) => {
    acc[categoryStatus(category).key] += 1;
    return acc;
  }, { late: 0, due: 0, soon: 0, doneToday: 0, good: 0 });

  const nearest = categories.slice().sort((a, b) => statusPriority(a) - statusPriority(b))[0];
  const nearestStatus = categoryStatus(nearest);
  document.getElementById("homeInfoGrid").innerHTML = [
    { value: categories.length, label: "관리 중인 주기" },
    { value: weeklyDoneCount(), label: "최근 7일 완료" },
    { value: statusDday(nearestStatus.days), label: `${nearest.name} 다음 기준` },
    { value: counts.late + counts.due, label: "오늘 기준 항목" },
  ].map((item) => `<article class="info-tile"><strong>${item.value}</strong><span>${item.label}</span></article>`).join("");

  document.getElementById("homeHistoryStrip").innerHTML = logs.slice(0, 5).map((log) => `
    <article class="mini-log">
      ${iconTile(log.icon)}
      <strong>${log.categoryName}</strong>
      <span>${fmtDate(log.date)}</span>
    </article>
  `).join("");

  document.getElementById("categoryList").innerHTML = categories
    .slice()
    .sort((a, b) => statusPriority(a) - statusPriority(b))
    .map(categoryCard)
    .join("");
}

function categoryCard(category) {
  const status = categoryStatus(category);
  return `<article class="task-card status-${status.key}">
    <div class="task-head">
      ${iconTile(category.icon)}
      <div class="task-main">
        <div class="task-title">${category.name}</div>
        <div class="task-meta">마지막 ${fmtDate(category.lastDoneAt)} · ${category.cycleDays}일 주기 · 다음 ${fmtDate(nextDate(category))}</div>
      </div>
      <span class="status-pill">${statusDday(status.days)}</span>
    </div>
    <div class="task-actions three">
      <button class="primary-button" type="button" onclick="completeCategory('${category.id}')">완료</button>
      <button class="secondary-button" type="button" onclick="openCycleEditor('${category.id}')">수정</button>
      <button class="ghost-button danger" type="button" onclick="openDeleteCategory('${category.id}')">삭제</button>
    </div>
  </article>`;
}

function renderSelection() {
  document.getElementById("selectionBanners").innerHTML = selectionBanners.map((banner, index) => `
    <article class="selection-banner ${index === 1 ? "accent" : ""}">
      <span>${banner.eyebrow}</span>
      <strong>${banner.title}</strong>
      <p>${banner.body}</p>
    </article>
  `).join("");

  const filters = ["전체", ...categories.map((category) => category.name)];
  document.getElementById("selectionFilters").innerHTML = filters.map((filter) => `
    <button class="filter-chip ${state.selectionFilter === filter ? "active" : ""}" type="button" onclick="setSelectionFilter('${filter}')">${filter}</button>
  `).join("");

  const list = state.selectionFilter === "전체"
    ? selectionItems
    : selectionItems.filter((item) => item.category === state.selectionFilter || item.category === "전체");

  document.getElementById("selectionList").innerHTML = list.length
    ? list
      .slice()
      .sort((a, b) => Number(Boolean(b.highlight)) - Number(Boolean(a.highlight)))
      .map(selectionCard)
      .join("")
    : `<div class="empty-state"><strong>아직 등록된 셀렉션이 없습니다</strong><span>상품 이미지를 확인한 항목부터 추가합니다</span></div>`;
}

function selectionCard(item) {
  const saved = savedSelections.includes(item.id);
  const isProduct = item.type === "product";
  return `<article class="selection-card ${isProduct ? "product" : "service"} ${item.highlight ? "featured" : ""}">
    ${isProduct ? productImage(item, "card-thumb") : iconTile(item.icon, "service-thumb")}
    <div class="selection-info">
      <div class="selection-kicker">${item.category} · ${selectionTypeLabel(item.type)}</div>
      <h3>${item.title}</h3>
      <div class="selection-price">${item.price}</div>
      <div class="selection-rating">★ ${item.rating} · 후기 ${item.reviews}</div>
      <p>${item.summary}</p>
      <div class="store-line"><span>${isProduct ? "구매처" : "제공처"}</span><strong>${isProduct ? item.store : item.provider}</strong></div>
      <div class="partner-tags">${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      <div class="sheet-actions two">
        <button class="ghost-button" type="button" onclick="toggleSave('${item.id}')">${saved ? "담김" : "담기"}</button>
        <button class="secondary-button" type="button" onclick="openSelectionDetail('${item.id}')">${isProduct ? "구매처 보기" : "예약 정보"}</button>
      </div>
    </div>
  </article>`;
}

function selectionTypeLabel(type) {
  if (type === "service") return "서비스";
  return "상품";
}

function renderCommunity() {
  document.querySelectorAll("[data-community-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.communityTab === state.communityTab);
  });

  const posts = community[state.communityTab]
    .slice()
    .sort((a, b) => (b.helpful + (b.saved || 0)) - (a.helpful + (a.saved || 0)));
  document.getElementById("communityList").innerHTML = posts.map(communityCard).join("");
}

function communityCard(post) {
  const isQa = state.communityTab === "qa";
  return `<article class="community-card" onclick="openCommunityPost('${post.id}')">
    <div class="community-top">
      ${iconTile(post.icon)}
      <div>
        <span class="pill neutral">${isQa ? "Q&A" : "꿀팁"}</span>
        <div class="community-title">${post.title}</div>
        <div class="community-meta">#${post.tag} · ${post.level} · ${post.time} · 도움 ${post.helpful}</div>
      </div>
    </div>
    <p>${post.body}</p>
  </article>`;
}

function renderCommunityDetail(id) {
  const post = getPostById(id);
  if (!post) return;
  document.getElementById("communityDetail").innerHTML = `
    <header class="detail-head">
      ${iconTile(post.icon)}
      <div>
        <p class="eyebrow">커뮤니티 · ${post.tag}</p>
        <h1 id="communityDetailTitle">${post.title}</h1>
        <div class="detail-meta">${post.level} · ${post.time} · 도움 ${post.helpful} · 저장 ${post.saved}</div>
      </div>
    </header>
    <section class="detail-section">
      <h2>요약</h2>
      <p>${post.body}</p>
    </section>
    <section class="detail-section">
      <h2>진행 순서</h2>
      <ol>${post.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
    </section>
    <section class="safety-panel">
      <strong>확인 필요</strong>
      <span>${post.safety} 관련 내용은 재질과 제품 표기를 먼저 확인하세요.</span>
    </section>
    <section class="detail-section">
      <h2>댓글과 답변</h2>
      <div class="answer-list">${post.answers.map((answer) => `<p>${answer}</p>`).join("")}</div>
    </section>
  `;
}

function renderMy() {
  document.getElementById("myStats").innerHTML = [
    { value: logs.length, label: "이번 달 완료" },
    { value: categories.length, label: "사용 중인 주기" },
    { value: savedSelections.length, label: "담은 셀렉션" },
  ].map((item) => `<div class="stat-card"><strong>${item.value}</strong><span>${item.label}</span></div>`).join("");

  const levels = [1, 0, 2, 1, 0, 1, 2, 1, 3, 2, 2, Math.min(3, Math.max(1, logs.length - 3))];
  document.getElementById("footprintGrid").innerHTML = levels.map((level, index) => `<div class="foot-cell ${level ? `l${level}` : ""} ${index === levels.length - 1 ? "now" : ""}"></div>`).join("");

  const menus = [
    { title: "완료 히스토리", summary: `이번 달 ${logs.length}개`, action: "openHistorySheet()" },
    { title: "저장한 셀렉션", summary: `${savedSelections.length}개 담김`, action: "openSavedSelectionSheet()" },
    { title: "주기 관리", summary: `${categories.length}개 사용 중`, action: "openCycleManager()" },
    { title: "알림 설정", summary: "조용한 알림", action: "openNotificationSettings()" },
    { title: "내 정보", summary: "김보송", action: "openProfileInfo()" },
  ];

  document.getElementById("myMenus").innerHTML = menus.map((menu) => `
    <button class="menu-row" type="button" onclick="${menu.action}">
      <span>${menu.title}</span>
      <strong>${menu.summary}</strong>
      <em aria-hidden="true">›</em>
    </button>
  `).join("");
}

function setSelectionFilter(filter) {
  state.selectionFilter = filter;
  renderSelection();
}

function completeCategory(id) {
  const category = categories.find((item) => item.id === id);
  if (!category) return;
  category.lastDoneAt = TODAY.toISOString();
  logs.unshift({ id: Date.now(), categoryName: category.name, icon: category.icon, date: TODAY.toISOString(), method: "직접 완료" });
  render();
  toast("완료했습니다", `${category.name} 다음 기준일이 갱신됐습니다`);
}

function getAvailablePresets() {
  return categoryPresets.filter((preset) => !categories.some((category) => category.id === preset.id));
}

function openAddCycleSheet() {
  const available = getAvailablePresets();
  if (!available.length) {
    openSheet({
      step: "주기 추가",
      title: "추가 가능한 기본 카테고리가 없습니다",
      sub: "현재 제공되는 카테고리는 모두 사용 중입니다.",
      body: `<button class="primary-button full-width" type="button" onclick="closeSheet()">확인</button>`,
      sheetId: "addCycle",
    });
    return;
  }
  state.addCycleDraft = {
    categoryId: available[0].id,
    cycleDays: available[0].defaultCycle,
    lastDonePreset: "today",
  };
  renderAddCycleSheet();
}

function renderAddCycleSheet() {
  const available = getAvailablePresets();
  const draft = state.addCycleDraft;
  const selected = categoryPresets.find((preset) => preset.id === draft.categoryId);
  openSheet({
    step: "주기 추가",
    title: "새 청소 주기",
    sub: "카테고리와 반복 기준을 선택하세요.",
    body: `<div class="form-block">
        <h3>카테고리</h3>
        <div class="category-choice-grid">
          ${available.map((preset) => `<button class="category-choice ${draft.categoryId === preset.id ? "active" : ""}" type="button" onclick="selectAddCategory('${preset.id}')">
            ${iconTile(preset.icon)}
            <span>${preset.name}</span>
          </button>`).join("")}
        </div>
      </div>
      <div class="form-block">
        <h3>반복 주기</h3>
        <div class="option-row">
          ${[3, 7, 14, 21, 28].map((days) => `<button class="option-chip ${draft.cycleDays === days ? "active" : ""}" type="button" onclick="selectAddCycleDays(${days})">${days}일</button>`).join("")}
        </div>
      </div>
      <div class="form-block">
        <h3>마지막 완료일</h3>
        <div class="option-row">
          ${[
            ["today", "오늘"],
            ["yesterday", "어제"],
            ["week", "7일 전"],
            ["month", "30일 전"],
          ].map(([value, label]) => `<button class="option-chip ${draft.lastDonePreset === value ? "active" : ""}" type="button" onclick="selectAddLastDone('${value}')">${label}</button>`).join("")}
        </div>
      </div>
      <div class="add-preview">
        ${iconTile(selected.icon)}
        <div>
          <strong>${selected.name}</strong>
          <span>${draft.cycleDays}일 주기로 추가됩니다</span>
        </div>
      </div>
      <button class="primary-button full-width" type="button" onclick="createCycle()">추가</button>`,
    sheetId: "addCycle",
  });
}

function selectAddCategory(id) {
  const preset = categoryPresets.find((item) => item.id === id);
  state.addCycleDraft.categoryId = id;
  state.addCycleDraft.cycleDays = preset.defaultCycle;
  renderAddCycleSheet();
}

function selectAddCycleDays(days) {
  state.addCycleDraft.cycleDays = days;
  renderAddCycleSheet();
}

function selectAddLastDone(value) {
  state.addCycleDraft.lastDonePreset = value;
  renderAddCycleSheet();
}

function lastDoneFromPreset(value) {
  const days = { today: 0, yesterday: 1, week: 7, month: 30 }[value] || 0;
  return addDays(TODAY, -days).toISOString();
}

function createCycle() {
  const draft = state.addCycleDraft;
  const preset = categoryPresets.find((item) => item.id === draft.categoryId);
  if (!preset || categories.some((category) => category.id === preset.id)) return;
  categories.push({
    id: preset.id,
    name: preset.name,
    icon: preset.icon,
    cycleDays: draft.cycleDays,
    lastDoneAt: lastDoneFromPreset(draft.lastDonePreset),
  });
  closeSheet();
  render();
  toast("주기를 추가했습니다", `${preset.name} · ${draft.cycleDays}일`);
}

function openCycleEditor(id) {
  const category = categories.find((item) => item.id === id);
  if (!category) return;
  openSheet({
    step: "주기 수정",
    title: category.name,
    sub: `현재 ${category.cycleDays}일 주기입니다.`,
    body: `<div class="add-preview">
        ${iconTile(category.icon)}
        <div>
          <strong>${category.name}</strong>
          <span>다음 기준일 ${fmtDate(nextDate(category))}</span>
        </div>
      </div>
      <div class="form-block">
        <h3>반복 주기</h3>
        <div class="option-row">
          ${[3, 7, 14, 21, 28].map((days) => `<button class="option-chip ${category.cycleDays === days ? "active" : ""}" type="button" onclick="updateCycle('${id}', ${days})">${days}일</button>`).join("")}
        </div>
      </div>
      <div class="sheet-actions two">
        <button class="ghost-button danger" type="button" onclick="openDeleteCategory('${id}')">삭제</button>
        <button class="primary-button" type="button" onclick="closeSheet()">완료</button>
      </div>`,
    sheetId: "cycle",
  });
}

function updateCycle(id, days) {
  const category = categories.find((item) => item.id === id);
  if (!category) return;
  category.cycleDays = days;
  render();
  openCycleEditor(id);
  toast("주기를 수정했습니다", `${category.name} · ${days}일`);
}

function openDeleteCategory(id) {
  const category = categories.find((item) => item.id === id);
  if (!category) return;
  openSheet({
    step: "주기 삭제",
    title: `${category.name} 주기를 삭제할까요?`,
    sub: "완료 히스토리는 유지되고, 홈 주기 목록에서만 사라집니다.",
    body: `<div class="add-preview danger-preview">
        ${iconTile(category.icon)}
        <div>
          <strong>${category.name}</strong>
          <span>${category.cycleDays}일 주기</span>
        </div>
      </div>
      <div class="sheet-actions two">
        <button class="ghost-button" type="button" onclick="closeSheet()">취소</button>
        <button class="primary-button danger-fill" type="button" onclick="deleteCategory('${id}')">삭제</button>
      </div>`,
    sheetId: "deleteCycle",
  });
}

function deleteCategory(id) {
  const category = categories.find((item) => item.id === id);
  categories = categories.filter((item) => item.id !== id);
  closeSheet();
  render();
  toast("주기를 삭제했습니다", category ? category.name : "");
}

function toggleSave(id) {
  const item = selectionItems.find((entry) => entry.id === id);
  if (savedSelections.includes(id)) {
    savedSelections = savedSelections.filter((entry) => entry !== id);
    toast("담기 해제", item.title);
  } else {
    savedSelections.push(id);
    toast("담았습니다", item.title);
  }
  render();
  if (state.activeSheet === "saved") openSavedSelectionSheet();
}

function openSelectionDetail(id) {
  const item = selectionItems.find((entry) => entry.id === id);
  if (!item) return;
  const isProduct = item.type === "product";
  openSheet({
    step: isProduct ? "상품 정보" : "서비스 정보",
    title: item.title,
    sub: `${item.category} · ${isProduct ? item.store : item.provider}`,
    body: `${isProduct ? productImage(item, "detail-product-image") : `<div class="add-preview">${iconTile(item.icon)}<div><strong>${item.provider}</strong><span>${item.price}</span></div></div>`}
      <div class="detail-summary">
        <div><span>가격</span><strong>${item.price}</strong></div>
        <div><span>후기</span><strong>★ ${item.rating} · ${item.reviews}</strong></div>
        <div><span>${isProduct ? "구매처" : "제공처"}</span><strong>${isProduct ? item.store : item.provider}</strong></div>
      </div>
      <div class="guide-block"><h3>맞는 상황</h3><p class="product-meta">${item.fitFor}</p></div>
      <div class="guide-block"><h3>확인할 점</h3><ul>${item.checks.map((check) => `<li>${check}</li>`).join("")}</ul></div>
      <div class="notice-box"><h3>구매 전 확인</h3><p>가격, 옵션, 배송비, 예약 가능 여부는 외부 구매처에서 달라질 수 있습니다.</p></div>
      <div class="sheet-actions two">
        <button class="ghost-button" type="button" onclick="toggleSave('${item.id}')">${savedSelections.includes(item.id) ? "담김" : "담기"}</button>
        <button class="secondary-button" type="button" onclick="toast('${isProduct ? "구매처 확인" : "예약 정보 확인"}', '${isProduct ? item.store : item.provider}')">${isProduct ? "구매처 보기" : "예약 정보"}</button>
      </div>`,
    sheetId: "selectionDetail",
  });
}

function openCommunityPost(id) {
  state.activePostId = id;
  renderCommunityDetail(id);
  showView("community-detail");
}

function openHistorySheet() {
  const body = logs.length
    ? `<div class="filter-row in-sheet">
        <button class="filter-chip active" type="button">7월</button>
        <button class="filter-chip" type="button">전체</button>
        <button class="filter-chip" type="button">직접 완료</button>
        <button class="filter-chip" type="button">서비스 이용</button>
      </div>
      <div class="stack">${logs.map(historyRow).join("")}</div>`
    : `<div class="empty-state"><strong>아직 기록이 없습니다</strong><span>완료한 주기가 생기면 이곳에 쌓입니다</span></div>`;

  openSheet({
    step: "마이",
    title: "완료 히스토리",
    sub: "월별 완료 기록입니다.",
    body,
    sheetId: "history",
  });
}

function historyRow(log) {
  return `<article class="history-card">
    ${iconTile(log.icon)}
    <div>
      <div class="task-title">${log.categoryName}</div>
      <div class="history-meta">${fmtDate(log.date)} · ${log.method}</div>
    </div>
  </article>`;
}

function openSavedSelectionSheet() {
  const saved = selectionItems.filter((item) => savedSelections.includes(item.id));
  const body = saved.length
    ? `<div class="stack">${saved.map(selectionCard).join("")}</div>`
    : `<div class="empty-state"><strong>담은 셀렉션이 없습니다</strong><span>상품이나 서비스를 담으면 여기에서 다시 볼 수 있습니다</span></div>`;

  openSheet({
    step: "마이",
    title: "저장한 셀렉션",
    sub: `${savedSelections.length}개 담김`,
    body,
    sheetId: "saved",
  });
}

function openCycleManager() {
  openSheet({
    step: "마이",
    title: "주기 관리",
    sub: "수정과 삭제를 여기에서도 할 수 있습니다.",
    body: `<div class="stack">${categories.map((category) => {
      const status = categoryStatus(category);
      return `<article class="history-card cycle-manager-row">
        ${iconTile(category.icon)}
        <div>
          <div class="task-title">${category.name}</div>
          <div class="history-meta">${category.cycleDays}일 주기 · ${statusDday(status.days)}</div>
        </div>
        <button class="small-button" type="button" onclick="openCycleEditor('${category.id}')">수정</button>
      </article>`;
    }).join("")}</div>`,
    sheetId: "cycles",
  });
}

function openNotificationSettings() {
  openSheet({
    step: "마이",
    title: "알림 설정",
    sub: "알림 빈도를 선택합니다.",
    body: `<div class="option-grid">
      <button class="option-card active" type="button"><strong>기준일 알림</strong><span>D-DAY 항목만 하루에 한 번 알려줍니다.</span></button>
      <button class="option-card" type="button"><strong>주간 요약</strong><span>일요일 저녁에 한 번 정리합니다.</span></button>
      <button class="option-card" type="button"><strong>끄기</strong><span>홈 화면에서만 확인합니다.</span></button>
    </div>`,
    sheetId: "notifications",
  });
}

function openProfileInfo() {
  openSheet({
    step: "마이",
    title: "내 정보",
    sub: "프로토타입용 프로필입니다.",
    body: `<div class="summary-list">
      <div class="summary-row"><span>닉네임</span><strong>김보송</strong></div>
      <div class="summary-row"><span>생활 형태</span><strong>1인 가구</strong></div>
      <div class="summary-row"><span>기본 화면</span><strong>홈</strong></div>
    </div>`,
    sheetId: "profile",
  });
}

function openNotification() {
  document.getElementById("alertDot").classList.add("hidden");
  openSheet({
    step: "알림",
    title: "오늘 기준 항목",
    sub: "D-DAY 기준으로 표시합니다.",
    body: `<div class="stack">${categories
      .filter((category) => categoryStatus(category).days <= 0)
      .map((category) => `<article class="history-card">
        ${iconTile(category.icon)}
        <div>
          <div class="task-title">${category.name}</div>
          <div class="history-meta">${statusDday(categoryStatus(category).days)} · 다음 ${fmtDate(nextDate(category))}</div>
        </div>
        <button class="small-button" type="button" onclick="completeCategory('${category.id}'); closeSheet();">완료</button>
      </article>`).join("")}</div>`,
    sheetId: "notification",
  });
}

function showView(view) {
  state.activeView = view;
  document.querySelectorAll(".view").forEach((node) => {
    node.classList.toggle("active", node.id === `view-${view}`);
  });
  document.querySelectorAll(".tab-button").forEach((button) => {
    const active = button.dataset.view === view || (view === "community-detail" && button.dataset.view === "community");
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function openSheet({ step, title, sub = "", body, sheetId = null }) {
  state.activeSheet = sheetId;
  document.getElementById("sheetStep").textContent = step;
  document.getElementById("sheetTitle").textContent = title;
  document.getElementById("sheetSub").textContent = sub;
  document.getElementById("sheetBody").innerHTML = body;
  document.getElementById("sheetBackdrop").classList.add("open");
}

function closeSheet() {
  state.activeSheet = null;
  document.getElementById("sheetBackdrop").classList.remove("open");
}

function toast(title, description = "") {
  const el = document.getElementById("toast");
  el.innerHTML = `<span class="toast-icon" aria-hidden="true">✓</span><div><strong>${title}</strong>${description ? `<span>${description}</span>` : ""}</div>`;
  el.classList.add("show");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.view !== "community") state.activePostId = null;
    showView(button.dataset.view);
  });
});

document.querySelectorAll("[data-community-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    state.communityTab = button.dataset.communityTab;
    renderCommunity();
  });
});

document.getElementById("notificationButton").addEventListener("click", openNotification);
document.getElementById("addCategoryButton").addEventListener("click", openAddCycleSheet);
document.getElementById("communityBackButton").addEventListener("click", () => showView("community"));
document.getElementById("sheetClose").addEventListener("click", closeSheet);
document.getElementById("sheetBackdrop").addEventListener("click", (event) => {
  if (event.target.id === "sheetBackdrop") closeSheet();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSheet();
});

render();
