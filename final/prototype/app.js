const MS_PER_DAY = 24 * 60 * 60 * 1000;
const TODAY = new Date("2026-07-10T12:00:00+09:00");

const state = {
  activeView: "home",
  selectionFilter: "전체",
  communityTab: "tips",
  toastTimer: null,
};

let categories = [
  { id: "bath", name: "욕실", icon: "bath", cycleDays: 14, lastDoneAt: "2026-07-01T09:00:00+09:00", note: "물때와 습기만 잡아도 관리가 쉬워져요." },
  { id: "kitchen", name: "주방", icon: "kitchen", cycleDays: 7, lastDoneAt: "2026-07-06T20:00:00+09:00", note: "배수구와 조리대 표면을 기준으로 잡아요." },
  { id: "laundry", name: "세탁/침구", icon: "laundry", cycleDays: 14, lastDoneAt: "2026-06-29T12:00:00+09:00", note: "침구와 수건을 같은 리듬으로 관리해요." },
  { id: "trash", name: "쓰레기/수거", icon: "trash", cycleDays: 3, lastDoneAt: "2026-07-08T21:00:00+09:00", note: "배달이 많은 주에는 조금 짧게 잡아도 좋아요." },
  { id: "floor", name: "바닥/먼지", icon: "floor", cycleDays: 7, lastDoneAt: "2026-07-04T18:00:00+09:00", note: "머리카락과 먼지를 먼저 잡는 카테고리예요." },
  { id: "season", name: "계절/가전", icon: "season", cycleDays: 28, lastDoneAt: "2026-06-24T19:00:00+09:00", note: "에어컨 필터, 제습, 결로처럼 계절에 따라 챙겨요." },
];

let logs = [
  { id: 1, categoryName: "쓰레기/수거", date: "2026-07-08T21:00:00+09:00" },
  { id: 2, categoryName: "주방", date: "2026-07-06T20:00:00+09:00" },
  { id: 3, categoryName: "바닥/먼지", date: "2026-07-04T18:00:00+09:00" },
  { id: 4, categoryName: "욕실", date: "2026-07-01T09:00:00+09:00" },
  { id: 5, categoryName: "세탁/침구", date: "2026-06-29T12:00:00+09:00" },
];

let savedSelections = ["starter-kit"];

const selectionItems = [
  {
    id: "starter-kit",
    type: "kit",
    category: "전체",
    title: "자취 첫 달 기본 청소 키트",
    label: "에디터 픽",
    price: "19,000원대",
    affiliate: "일부 제휴",
    reason: "세제 종류를 늘리기보다 고무장갑, 극세사 천, 중성세제, 배수구망처럼 매주 쓰는 것만 담았어요.",
    fitFor: "처음 자취를 시작했거나 청소 도구가 거의 없는 사용자",
  },
  {
    id: "bath-soft-start",
    type: "product",
    category: "욕실",
    title: "욕실 물때 입문 세트",
    label: "처음 쓰기 쉬움",
    price: "9,000원대",
    affiliate: "제휴",
    reason: "강한 세제보다 부드러운 솔과 물기 제거 도구를 먼저 쓰면 실패가 적어요.",
    fitFor: "욕실 청소를 미루다가 한 번에 크게 하려는 사용자",
  },
  {
    id: "sink-weekly",
    type: "product",
    category: "주방",
    title: "싱크대 주간 관리 팩",
    label: "작게 자주",
    price: "7,000원대",
    affiliate: "비제휴",
    reason: "배수구 클리너 하나보다 거름망과 작은 솔을 같이 쓰는 편이 냄새 재발을 줄여요.",
    fitFor: "주방 냄새가 신경 쓰이지만 큰 청소는 부담스러운 사용자",
  },
  {
    id: "laundry-bedding",
    type: "service",
    category: "세탁/침구",
    title: "침구 수거 서비스 비교",
    label: "서비스 연결",
    price: "품목별",
    affiliate: "일부 제휴",
    reason: "이불처럼 부피가 큰 세탁은 직접보다 수거 서비스가 생활 리듬을 덜 깨뜨려요.",
    fitFor: "집 세탁기로 이불 세탁이 부담스러운 사용자",
  },
  {
    id: "trash-pickup",
    type: "service",
    category: "쓰레기/수거",
    title: "문앞 수거 서비스 3곳",
    label: "반복 밀림에 추천",
    price: "월 9,900원대부터",
    affiliate: "제휴 포함",
    reason: "쓰레기 배출이 매번 밀리는 사람에게는 용품보다 반복 수거 서비스가 더 직접적인 해결책이에요.",
    fitFor: "퇴근 시간이 늦어 배출 요일을 자주 놓치는 사용자",
  },
  {
    id: "floor-easy",
    type: "product",
    category: "바닥/먼지",
    title: "롤클리너와 극세사 조합",
    label: "5분 관리",
    price: "8,000원대",
    affiliate: "비제휴",
    reason: "물걸레 전에 머리카락을 먼저 잡으면 바닥 청소 시간이 줄어들어요.",
    fitFor: "바닥 먼지가 빨리 쌓이는 원룸 사용자",
  },
  {
    id: "season-aircon",
    type: "service",
    category: "계절/가전",
    title: "에어컨 필터와 분해청소 기준",
    label: "계절 셀렉션",
    price: "필터 직접 / 분해청소 7만원대부터",
    affiliate: "비제휴",
    reason: "필터 세척은 직접 가능하지만 송풍팬과 열교환기 분해는 서비스 기준을 확인하는 편이 안전해요.",
    fitFor: "냉방 시즌 전후 냄새가 신경 쓰이는 사용자",
  },
];

const community = {
  tips: [
    { id: "tip1", title: "욕실은 세제보다 물기 제거가 먼저였어요", tag: "욕실", body: "샤워 후 스퀴지로 30초만 닦아도 물때가 확 줄었습니다.", helpful: 128, comments: 24, saved: 64 },
    { id: "tip2", title: "음식물 쓰레기는 냄새 잡기보다 주기를 줄이는 게 답", tag: "수거", body: "여름에는 탈취제보다 배출 간격을 짧게 잡는 게 훨씬 효과적이었어요.", helpful: 104, comments: 18, saved: 43 },
    { id: "tip3", title: "물걸레 전에 롤클리너 한 번이면 두 번 일 안 해요", tag: "바닥", body: "머리카락을 먼저 걷어내야 물걸레가 밀리지 않습니다.", helpful: 91, comments: 15, saved: 38 },
    { id: "tip4", title: "이불 세탁은 세탁보다 완전 건조가 핵심", tag: "세탁", body: "덜 마른 냄새가 싫어서 건조 시간을 기준으로 주말 오전에만 돌립니다.", helpful: 75, comments: 9, saved: 31 },
  ],
  qa: [
    { id: "qa1", title: "대리석 세면대에 물때 제거제 써도 되나요?", tag: "욕실", body: "산성 세제는 표면을 상하게 할 수 있다는 답변이 가장 많이 도움을 받았어요.", answers: 6, helpful: 88, saved: 22 },
    { id: "qa2", title: "수건 냄새가 세탁 후에도 남을 때 뭘 먼저 봐야 하나요?", tag: "세탁", body: "세탁조, 고무패킹, 건조 시간을 차례대로 확인해보라는 답변이 채택됐습니다.", answers: 8, helpful: 81, saved: 29 },
    { id: "qa3", title: "분리수거함은 몇 칸짜리가 현실적으로 좋나요?", tag: "수거", body: "종이, 플라스틱, 비닐 3칸이면 충분하다는 답변이 많아요.", answers: 5, helpful: 63, saved: 18 },
  ],
};

function addDays(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function dayDiff(iso) {
  return Math.max(0, Math.floor((TODAY.getTime() - new Date(iso).getTime()) / MS_PER_DAY));
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

function categoryMessage(category) {
  const left = daysUntilNext(category);
  if (left <= 0) return "이번 주에 챙기면 좋아요";
  if (left <= 2) return `${left}일 안에 하면 좋아요`;
  return `${left}일 뒤 다시 보면 충분해요`;
}

function iconSvg(type) {
  const icons = {
    bath: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 11h12v4.5A4.5 4.5 0 0 1 13.5 20h-3A4.5 4.5 0 0 1 6 15.5V11Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V7a3 3 0 0 1 5.7-1.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 11h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    kitchen: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 13h14v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-3Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 9c0-2 1.5-3 3-3s3 1 3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    laundry: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="5" y="3.5" width="14" height="17" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="14" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 7h.01M11 7h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    trash: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 8h8l-.8 12H8.8L8 8Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 8h10M10 8V5h4v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    floor: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 18c4-3 10-3 14 0M7 13c3-2 7-2 10 0M9 8c2-1 4-1 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    season: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 3v18M5.6 6.2l12.8 11.6M18.4 6.2 5.6 17.8M4 12h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    product: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  };
  return icons[type] || icons.product;
}

function render() {
  renderHome();
  renderSelection();
  renderCommunity();
  renderMy();
}

function renderHome() {
  const monthlyCount = logs.length;
  const meter = document.getElementById("monthlyMeter");
  meter.style.strokeDashoffset = 219.91 * (1 - Math.min(monthlyCount, 12) / 12);
  document.getElementById("monthlyMeterText").textContent = monthlyCount;

  document.getElementById("categoryList").innerHTML = categories.map(categoryCard).join("");
  document.getElementById("recentLogs").innerHTML = logs.slice(0, 6).map((log) => `
    <article class="quick-card">
      <strong>${log.categoryName}</strong>
      <span>${fmtDate(log.date)} 완료</span>
    </article>
  `).join("");
}

function categoryCard(category) {
  const left = daysUntilNext(category);
  const softClass = left <= 0 ? "soon" : "good";
  return `<article class="task-card">
    <div class="task-top">
      <div class="category-icon">${iconSvg(category.icon)}</div>
      <div class="task-main">
        <div class="task-title">${category.name}</div>
        <div class="task-meta">마지막 ${fmtDate(category.lastDoneAt)} · ${category.cycleDays}일 주기 · 다음 ${fmtDate(nextDate(category))}</div>
        <div class="task-meta">${category.note}</div>
      </div>
      <span class="pill ${softClass}">${categoryMessage(category)}</span>
    </div>
    <div class="task-actions">
      <button class="primary-button" type="button" onclick="completeCategory('${category.id}')">완료</button>
      <button class="ghost-button" type="button" onclick="openCycleEditor('${category.id}')">주기 수정</button>
      <button class="secondary-button" type="button" onclick="openCategoryHelp('${category.id}')">도움 보기</button>
    </div>
  </article>`;
}

function renderSelection() {
  const filters = ["전체", ...categories.map((category) => category.name)];
  document.getElementById("selectionFilters").innerHTML = filters.map((filter) => `
    <button class="filter-chip ${state.selectionFilter === filter ? "active" : ""}" type="button" onclick="setSelectionFilter('${filter}')">${filter}</button>
  `).join("");

  const featured = selectionItems.slice(0, 2);
  document.getElementById("featuredSelection").innerHTML = featured.map(selectionCard).join("");

  const list = state.selectionFilter === "전체"
    ? selectionItems
    : selectionItems.filter((item) => item.category === state.selectionFilter || item.category === "전체");
  document.getElementById("selectionList").innerHTML = list.map(selectionCard).join("");
}

function selectionCard(item) {
  const saved = savedSelections.includes(item.id);
  return `<article class="selection-card">
    <div class="selection-card-head">
      <div>
        <span class="pill ${item.type === "service" ? "info" : "good"}">${item.label}</span>
        <h3>${item.title}</h3>
        <p>${item.fitFor}</p>
      </div>
      <div class="selection-price">${item.price}</div>
    </div>
    <div class="editor-note">
      <strong>고른 이유</strong>
      <span>${item.reason}</span>
    </div>
    <div class="partner-tags">
      <span class="tag ${item.affiliate !== "비제휴" ? "aff" : ""}">${item.affiliate}</span>
      <span class="tag">${item.category}</span>
      <span class="tag">${item.type === "service" ? "서비스 연결" : item.type === "kit" ? "키트" : "용품"}</span>
    </div>
    <div class="sheet-actions two">
      <button class="ghost-button" type="button" onclick="toggleSave('${item.id}')">${saved ? "저장됨" : "저장"}</button>
      <button class="secondary-button" type="button" onclick="openSelectionDetail('${item.id}')">자세히</button>
    </div>
  </article>`;
}

function renderCommunity() {
  document.querySelectorAll("[data-community-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.communityTab === state.communityTab);
  });

  const popular = [...community.tips, ...community.qa]
    .sort((a, b) => (b.helpful + (b.saved || 0)) - (a.helpful + (a.saved || 0)))
    .slice(0, 2);
  document.getElementById("popularCommunity").innerHTML = popular.map((post) => communityCard(post, true)).join("");

  document.getElementById("communityList").innerHTML = community[state.communityTab].map((post) => communityCard(post, false)).join("");
}

function communityCard(post, popular) {
  const isQa = "answers" in post;
  return `<article class="community-card" onclick="openCommunityPost('${post.id}')">
    <div class="community-top">
      <div>
        <span class="pill ${popular ? "info" : "neutral"}">${popular ? "상단 추천" : isQa ? "Q&A" : "꿀팁"}</span>
        <div class="community-title" style="margin-top:9px;">${post.title}</div>
        <div class="community-meta">#${post.tag} · 도움됨 ${post.helpful} · ${isQa ? `답변 ${post.answers}` : `댓글 ${post.comments}`}</div>
      </div>
    </div>
    <p>${post.body}</p>
  </article>`;
}

function renderMy() {
  document.getElementById("myStats").innerHTML = [
    { value: logs.length, label: "이번 달 완료" },
    { value: categories.length, label: "관리 카테고리" },
    { value: savedSelections.length, label: "저장 셀렉션" },
  ].map((item) => `<div class="stat-card"><strong>${item.value}</strong><span>${item.label}</span></div>`).join("");

  const levels = [1, 0, 2, 1, 0, 1, 2, 1, 3, 2, 2, Math.min(3, Math.max(1, logs.length - 3))];
  document.getElementById("footprintGrid").innerHTML = levels.map((level, index) => `<div class="foot-cell ${level ? `l${level}` : ""} ${index === levels.length - 1 ? "now" : ""}"></div>`).join("");

  document.getElementById("historyList").innerHTML = logs.slice(0, 7).map((log) => `
    <article class="history-card">
      <div class="category-icon">${iconSvg("product")}</div>
      <div>
        <div class="task-title">${log.categoryName}</div>
        <div class="history-meta">${fmtDate(log.date)} 완료</div>
      </div>
    </article>
  `).join("");

  const saved = selectionItems.filter((item) => savedSelections.includes(item.id));
  document.getElementById("savedSelection").innerHTML = saved.length
    ? saved.map(selectionCard).join("")
    : `<article class="task-card"><div class="task-title">저장한 셀렉션이 없어요.</div><div class="task-meta">셀렉션 탭에서 마음에 드는 추천을 저장해보세요.</div></article>`;
}

function setSelectionFilter(filter) {
  state.selectionFilter = filter;
  renderSelection();
}

function completeCategory(id) {
  const category = categories.find((item) => item.id === id);
  category.lastDoneAt = TODAY.toISOString();
  logs.unshift({ id: Date.now(), categoryName: category.name, date: TODAY.toISOString() });
  render();
  toast(`${category.name} 완료. 다음 관리는 ${fmtDate(nextDate(category))}에 보면 충분해요.`);
}

function openCycleEditor(id) {
  const category = categories.find((item) => item.id === id);
  openSheet({
    step: "주기 수정",
    title: category.name,
    sub: "큰 카테고리 단위로만 관리합니다. 세부 항목은 만들지 않아도 돼요.",
    body: `<div class="option-row">
      ${[3, 7, 14, 21, 28].map((days) => `<button class="option-chip ${category.cycleDays === days ? "active" : ""}" type="button" onclick="updateCycle('${id}', ${days})">${days}일</button>`).join("")}
    </div>
    <div class="notice-box"><h3>현재 기준</h3><p>마지막 완료일은 ${fmtDate(category.lastDoneAt)}이고, 다음 관리는 ${fmtDate(nextDate(category))}입니다.</p></div>`,
  });
}

function updateCycle(id, days) {
  const category = categories.find((item) => item.id === id);
  category.cycleDays = days;
  render();
  openCycleEditor(id);
  toast(`${category.name} 주기를 ${days}일로 바꿨어요.`);
}

function openCategoryHelp(id) {
  const category = categories.find((item) => item.id === id);
  state.selectionFilter = category.name;
  renderSelection();
  showView("selection");
  toast(`${category.name}에 맞는 셀렉션을 모아봤어요.`);
}

function addCategory() {
  if (categories.some((item) => item.id === "pet")) {
    toast("반려동물 카테고리는 이미 추가되어 있어요.");
    return;
  }
  categories.push({
    id: "pet",
    name: "반려동물",
    icon: "floor",
    cycleDays: 7,
    lastDoneAt: TODAY.toISOString(),
    note: "털, 냄새, 패드 주변을 한 카테고리로 관리해요.",
  });
  render();
  toast("반려동물 카테고리를 추가했어요.");
}

function toggleSave(id) {
  if (savedSelections.includes(id)) {
    savedSelections = savedSelections.filter((item) => item !== id);
    toast("저장을 해제했어요.");
  } else {
    savedSelections.push(id);
    toast("셀렉션을 저장했어요.");
  }
  render();
}

function openSelectionDetail(id) {
  const item = selectionItems.find((entry) => entry.id === id);
  openSheet({
    step: "브랜드 셀렉션",
    title: item.title,
    sub: `${item.category} · ${item.price}`,
    body: `<div class="notice-box"><h3>이런 상황에 맞아요</h3><p>${item.fitFor}</p></div>
      <div class="guide-block"><h3>고른 이유</h3><p class="product-meta">${item.reason}</p></div>
      <div class="guide-block"><h3>고지</h3><p class="product-meta">${item.affiliate}. 가격은 예시 또는 범위이며 외부 페이지에서 최종 확인해야 합니다.</p></div>
      <div class="sheet-actions two">
        <button class="ghost-button" type="button" onclick="toggleSave('${item.id}')">저장</button>
        <button class="secondary-button" type="button" onclick="toast('외부 페이지 연결 CTA 예시입니다.')">외부 보기</button>
      </div>`,
  });
}

function openCommunityPost(id) {
  const post = [...community.tips, ...community.qa].find((item) => item.id === id);
  const isQa = "answers" in post;
  openSheet({
    step: isQa ? "Q&A" : "꿀팁 공유",
    title: post.title,
    sub: `#${post.tag} · 도움됨 ${post.helpful}`,
    body: `<div class="guide-block"><p class="product-meta">${post.body}</p></div>
      <div class="sheet-actions two">
        <button class="ghost-button" type="button" onclick="toast('도움됨을 표시했어요.')">도움됨</button>
        <button class="secondary-button" type="button" onclick="toast('${isQa ? "답변" : "댓글"} 작성 진입점 예시입니다.')">${isQa ? "답변" : "댓글"}</button>
      </div>`,
  });
}

function openNotification() {
  document.getElementById("alertDot").classList.add("hidden");
  openSheet({
    step: "알림",
    title: "이번 주에는 욕실만 챙겨도 충분해요",
    sub: "압박이 아니라 기억 보조로만 알려드려요.",
    body: `<div class="notice-box"><h3>오늘의 제안</h3><p>욕실 카테고리를 이번 주 안에 한 번 완료하면 다음 관리는 자동으로 다시 잡아둘게요.</p></div>
      <div class="sheet-actions two">
        <button class="ghost-button" type="button" onclick="openCycleEditor('bath')">주기 보기</button>
        <button class="primary-button" type="button" onclick="completeCategory('bath'); closeSheet();">욕실 완료</button>
      </div>`,
  });
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
}

function openSheet({ step, title, sub = "", body }) {
  document.getElementById("sheetStep").textContent = step;
  document.getElementById("sheetTitle").textContent = title;
  document.getElementById("sheetSub").textContent = sub;
  document.getElementById("sheetBody").innerHTML = body;
  document.getElementById("sheetBackdrop").classList.add("open");
}

function closeSheet() {
  document.getElementById("sheetBackdrop").classList.remove("open");
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

document.querySelectorAll("[data-community-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    state.communityTab = button.dataset.communityTab;
    renderCommunity();
  });
});

document.getElementById("notificationButton").addEventListener("click", openNotification);
document.getElementById("addCategoryButton").addEventListener("click", addCategory);
document.getElementById("sheetClose").addEventListener("click", closeSheet);
document.getElementById("sheetBackdrop").addEventListener("click", (event) => {
  if (event.target.id === "sheetBackdrop") closeSheet();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSheet();
});

render();
