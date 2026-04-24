import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/utilities.css';
import '../../styles/components.css';
import '../../styles/animations.css';
import '../../styles/pages/reading.css';
import { loadReading } from '../core/storage.js';

document.documentElement.classList.add('is-ready');

const eyebrow = document.querySelector('[data-reading-eyebrow]');
const title = document.querySelector('[data-reading-title]');
const copy = document.querySelector('[data-reading-copy]');
const summary = document.querySelector('[data-reading-summary]');
const summarySpread = document.querySelector('[data-summary-spread]');
const summaryReversed = document.querySelector('[data-summary-reversed]');
const summaryCount = document.querySelector('[data-summary-count]');
const spreadList = document.querySelector('[data-reading-spread]');
const detailPosition = document.querySelector('[data-detail-position]');
const detailName = document.querySelector('[data-detail-name]');
const detailMeta = document.querySelector('[data-detail-meta]');
const detailKeywords = document.querySelector('[data-detail-keywords]');
const detailMeaning = document.querySelector('[data-detail-meaning]');
const detailHeading = document.querySelector('[data-reading-detail-heading]');
const readingTabs = document.querySelectorAll('[data-reading-tab]');

// Track active tab mode and current entry
let activeReadingTab = 'main';
let currentEntry = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getOrientationLabel(entry) {
  return entry.is_reversed ? 'Ngược' : 'Xuôi';
}

function getMainMeaning(entry) {
  return entry.is_reversed
    ? entry.card.meaning_reversed
    : entry.card.meaning_upright;
}

function getKeywords(entry) {
  return entry.is_reversed
    ? entry.card.keywords_reversed
    : entry.card.keywords_upright;
}

function getGlyph(entry) {
  if (entry.card.arcana === 'major') return entry.card.rank;
  return entry.card.rank.slice(0, 1);
}

// ─── Tab content resolver ─────────────────────────────────────────────────────

function resolveReadingTabContent(entry, tabMode) {
  const card = entry.card;
  const isReversed = entry.is_reversed;

  switch (tabMode) {
    case 'main':
      return {
        heading: isReversed ? 'Nghĩa ngược' : 'Nghĩa xuôi',
        meaning: getMainMeaning(entry) ?? 'Chưa có nội dung.',
        keywords: getKeywords(entry)
      };
    case 'love':
      return {
        heading: 'Tình cảm',
        meaning: (isReversed ? card.love_reversed : card.love_upright)
          ?? card.love_upright
          ?? 'Chưa có nội dung cho lĩnh vực này.',
        keywords: getKeywords(entry)
      };
    case 'career':
      return {
        heading: 'Sự nghiệp',
        meaning: (isReversed ? card.career_reversed : card.career_upright)
          ?? card.career_upright
          ?? 'Chưa có nội dung cho lĩnh vực này.',
        keywords: getKeywords(entry)
      };
    case 'spiritual':
      return {
        heading: 'Tâm linh',
        meaning: card.spiritual ?? 'Chưa có nội dung cho lĩnh vực này.',
        keywords: getKeywords(entry)
      };
    default:
      return {
        heading: 'Nghĩa xuôi',
        meaning: card.meaning_upright ?? '',
        keywords: getKeywords(entry)
      };
  }
}

// ─── Render detail panel ──────────────────────────────────────────────────────

function renderDetail(entry) {
  if (!detailPosition || !detailName || !detailMeta || !detailKeywords || !detailMeaning) return;
  currentEntry = entry;

  const { heading, meaning, keywords } = resolveReadingTabContent(entry, activeReadingTab);

  detailPosition.textContent = entry.position_label;
  detailName.textContent = entry.card.name;
  detailMeta.textContent = `${entry.card.name_vi} • ${getOrientationLabel(entry)} • ${entry.card.element}`;
  if (detailHeading) detailHeading.textContent = heading;
  detailMeaning.textContent = meaning;

  detailKeywords.replaceChildren(
    ...keywords.map((keyword) => {
      const chip = document.createElement('span');
      chip.className = 'keyword-chip';
      chip.textContent = keyword;
      return chip;
    })
  );

  // Sync tab active state
  readingTabs.forEach((tab) => {
    const isActive = tab.dataset.readingTab === activeReadingTab;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-pressed', String(isActive));
  });
}

// ─── Card list ────────────────────────────────────────────────────────────────

function createCardButton(entry, index, onSelect) {
  const item = document.createElement('li');
  item.className = 'reading-card-slot';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = `tarot-card${entry.is_reversed ? ' is-reversed' : ''}`;
  button.style.setProperty('--reveal-index', String(index));
  button.style.setProperty('--tarot-accent', entry.card.accent ?? '#f0c060');
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = `
    <div class="tarot-card__frame">
      <span class="tarot-card__position">${entry.position_label}</span>
      <span class="tarot-card__glyph">${getGlyph(entry)}</span>
      <div class="tarot-card__title">
        <strong>${entry.card.name}</strong>
        <span>${entry.card.name_vi}</span>
      </div>
      <div class="tarot-card__footer">
        <span class="tarot-card__orientation">${getOrientationLabel(entry)}</span>
        <span class="tarot-card__orientation">${entry.card.arcana}</span>
      </div>
    </div>
    <span class="tarot-card__keywords">${getKeywords(entry).join(', ')}</span>
  `;
  button.addEventListener('click', () => onSelect(index));
  item.append(button);
  return item;
}

function setActiveCard(index) {
  const cards = spreadList?.querySelectorAll('.tarot-card') ?? [];
  cards.forEach((card, cardIndex) => {
    const isActive = cardIndex === index;
    card.classList.toggle('is-active', isActive);
    card.setAttribute('aria-pressed', String(isActive));
  });
}

// ─── Page states ──────────────────────────────────────────────────────────────

function renderEmptyState() {
  if (!eyebrow || !title || !copy || !summary) return;
  eyebrow.textContent = 'Reading Guard';
  title.textContent = 'Chưa có trải bài nào trong session hiện tại.';
  copy.textContent =
    'Bạn cần quay lại trang chủ để rút bài trước. Hệ thống đã bật guard cho trường hợp vào trực tiếp reading page mà không có dữ liệu.';
  summary.hidden = true;
  document.title = 'Reading Guard | Tarot Ghibli Inspired';
}

function renderReading(reading) {
  if (!eyebrow || !title || !copy || !summary || !summarySpread ||
      !summaryReversed || !summaryCount || !spreadList) return;

  eyebrow.textContent = reading.spread.label;
  title.textContent = reading.spread.title;
  copy.textContent =
    'Mỗi lá bài được đặt vào vị trí của spread đã chọn. Nhấn vào từng lá để xem ý nghĩa chi tiết và từ khóa theo trạng thái xuôi hoặc ngược.';
  summarySpread.textContent = reading.spread.label;
  summaryReversed.textContent = reading.reversed_enabled ? 'Bật' : 'Tắt';
  summaryCount.textContent = String(reading.cards.length);
  document.title = `${reading.spread.label} | Tarot Ghibli Inspired`;
  spreadList.dataset.spread = reading.spread.id;

  spreadList.replaceChildren(
    ...reading.cards.map((entry, index) =>
      createCardButton(entry, index, (selectedIndex) => {
        renderDetail(reading.cards[selectedIndex]);
        setActiveCard(selectedIndex);
      })
    )
  );
  spreadList.dataset.ready = 'true';
  renderDetail(reading.cards[0]);
  setActiveCard(0);
  summary.hidden = false;
}

// ─── Tab events ───────────────────────────────────────────────────────────────

readingTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activeReadingTab = tab.dataset.readingTab ?? 'main';
    if (currentEntry) renderDetail(currentEntry);
  });
});

// ─── Init ────────────────────────────────────────────────────────────────────

const reading = loadReading();
if (reading?.cards?.length) {
  renderReading(reading);
} else {
  renderEmptyState();
}
