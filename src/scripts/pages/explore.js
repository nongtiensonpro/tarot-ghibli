import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/utilities.css';
import '../../styles/components.css';
import '../../styles/animations.css';
import '../../styles/pages/explore.css';
import { loadTarotData } from '../core/tarot-data.js';
import { filterCards } from '../ui/filters.js';

document.documentElement.classList.add('is-ready');

const state = {
  cards: [],
  filteredCards: [],
  activeFilter: 'all',
  query: '',
  activeCardId: null,
  detailMode: 'upright'
};

const catalog = document.querySelector('[data-card-catalog]');
const searchInput = document.querySelector('[data-search-input]');
const filterButtons = document.querySelectorAll('[data-filter]');
const resultCount = document.querySelector('[data-result-count]');
const activeFilterLabel = document.querySelector('[data-active-filter]');
const searchState = document.querySelector('[data-search-state]');
const detailArcana = document.querySelector('[data-detail-arcana]');
const detailName = document.querySelector('[data-detail-name]');
const detailMeta = document.querySelector('[data-detail-meta]');
const detailKeywords = document.querySelector('[data-detail-keywords]');
const detailHeading = document.querySelector('[data-detail-heading]');
const detailMeaning = document.querySelector('[data-detail-meaning]');
const detailTabs = document.querySelectorAll('[data-detail-tab]');
const relatedSection = document.querySelector('[data-related-section]');
const relatedCards = document.querySelector('[data-related-cards]');

function getFilterLabel(filter) {
  const labels = {
    all: 'Tất cả',
    major: 'Bộ Ẩn Chính',
    wands: 'Gậy',
    cups: 'Chén',
    swords: 'Kiếm',
    pentacles: 'Tiền'
  };
  return labels[filter] ?? 'Tất cả';
}

function getCardGlyph(card) {
  if (card.arcana === 'major') return card.rank;
  return card.rank.slice(0, 1);
}

function getActiveCard() {
  return (
    state.filteredCards.find((card) => card.id === state.activeCardId) ??
    state.filteredCards[0] ??
    null
  );
}

// ─── Tab content resolver ────────────────────────────────────────────────────

const TAB_CONFIG = {
  upright:  { headingFn: () => 'Nghĩa xuôi',    contentKey: 'meaning_upright',  kwKey: 'keywords_upright' },
  reversed: { headingFn: () => 'Nghĩa ngược',   contentKey: 'meaning_reversed', kwKey: 'keywords_reversed' },
  love:     { headingFn: () => 'Tình cảm',      contentKey: null, kwKey: null },
  career:   { headingFn: () => 'Sự nghiệp',     contentKey: null, kwKey: null },
  spiritual:{ headingFn: () => 'Tâm linh',      contentKey: null, kwKey: null }
};

function resolveTabContent(card, mode) {
  const isReversed = mode === 'reversed';

  switch (mode) {
    case 'upright':
      return {
        heading: 'Nghĩa xuôi',
        meaning: card.meaning_upright ?? 'Chưa có nội dung.',
        keywords: card.keywords_upright ?? []
      };
    case 'reversed':
      return {
        heading: 'Nghĩa ngược',
        meaning: card.meaning_reversed ?? 'Chưa có nội dung.',
        keywords: card.keywords_reversed ?? []
      };
    case 'love':
      return {
        heading: 'Tình cảm',
        meaning: (card.love_upright ?? '') || 'Chưa có nội dung cho lĩnh vực này.',
        keywords: card.keywords_upright ?? []
      };
    case 'career':
      return {
        heading: 'Sự nghiệp',
        meaning: (card.career_upright ?? '') || 'Chưa có nội dung cho lĩnh vực này.',
        keywords: card.keywords_upright ?? []
      };
    case 'spiritual':
      return {
        heading: 'Tâm linh',
        meaning: (card.spiritual ?? '') || 'Chưa có nội dung cho lĩnh vực này.',
        keywords: card.keywords_upright ?? []
      };
    default:
      return {
        heading: 'Nghĩa xuôi',
        meaning: card.meaning_upright ?? '',
        keywords: card.keywords_upright ?? []
      };
  }
}

// ─── Related cards ───────────────────────────────────────────────────────────

function renderRelatedCards(card) {
  if (!relatedSection || !relatedCards) return;

  const ids = card.related_cards ?? [];
  if (!ids.length) {
    relatedSection.hidden = true;
    return;
  }

  const found = ids
    .map(id => state.cards.find(c => c.id === id))
    .filter(Boolean);

  if (!found.length) {
    relatedSection.hidden = true;
    return;
  }

  relatedSection.hidden = false;
  relatedCards.replaceChildren(
    ...found.map(related => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'related-card-chip';
      btn.style.setProperty('--chip-accent', related.accent ?? '#f0c060');
      btn.innerHTML = `
        <span class="related-card-chip__glyph">${getCardGlyph(related)}</span>
        <span class="related-card-chip__name">${related.name_vi}</span>
      `;
      btn.addEventListener('click', () => {
        state.activeCardId = related.id;
        // Nếu lá này không có trong filteredCards thì reset filter
        if (!state.filteredCards.some(c => c.id === related.id)) {
          state.activeFilter = 'all';
          state.query = '';
          state.filteredCards = state.cards;
          if (searchInput) searchInput.value = '';
          filterButtons.forEach(b => b.classList.toggle('is-active', b.dataset.filter === 'all'));
          renderCatalog();
        } else {
          syncActiveCardState();
          renderDetail(related);
          // Scroll catalog item into view
          const items = catalog?.querySelectorAll('.catalog-card') ?? [];
          const idx = state.filteredCards.findIndex(c => c.id === related.id);
          if (idx >= 0 && items[idx]) {
            items[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
      return btn;
    })
  );
}

// ─── Card image with fallback ─────────────────────────────────────────────────

function getCardImageHTML(card) {
  if (!card.image) return '';
  return `
    <div class="explore-detail__image-wrap">
      <img
        class="explore-detail__card-img"
        src="${card.image}"
        alt="${card.name_vi}"
        loading="lazy"
        onerror="this.closest('.explore-detail__image-wrap').hidden=true"
      />
    </div>
  `;
}

// ─── Render detail panel ──────────────────────────────────────────────────────

function renderDetail(card) {
  if (!detailArcana || !detailName || !detailMeta || !detailKeywords || !detailHeading || !detailMeaning) return;

  if (!card) {
    detailArcana.textContent = 'Không có kết quả';
    detailName.textContent = 'Không tìm thấy lá bài phù hợp';
    detailMeta.textContent = 'Thử đổi bộ lọc hoặc từ khóa tìm kiếm khác.';
    detailHeading.textContent = 'Không có dữ liệu';
    detailMeaning.textContent = 'Danh sách hiện tại không có lá bài nào khớp với bộ lọc đang chọn.';
    detailKeywords.replaceChildren();
    if (relatedSection) relatedSection.hidden = true;
    return;
  }

  const { heading, meaning, keywords } = resolveTabContent(card, state.detailMode);

  detailArcana.textContent =
    card.arcana === 'major'
      ? `Major Arcana • ${card.rank}`
      : `${card.suit_vi} • ${card.rank}`;
  detailName.textContent = card.name;
  detailMeta.textContent = `${card.name_vi} • ${card.element} • ${getFilterLabel(card.suit ?? 'major')}`;
  detailHeading.textContent = heading;
  detailMeaning.textContent = meaning;

  detailKeywords.replaceChildren(
    ...keywords.map((keyword) => {
      const chip = document.createElement('span');
      chip.className = 'keyword-chip';
      chip.textContent = keyword;
      return chip;
    })
  );

  detailTabs.forEach((tab) => {
    const isActive = tab.dataset.detailTab === state.detailMode;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-pressed', String(isActive));
  });

  // Card image (only inject once when card changes)
  const detailPanel = detailArcana.closest('.explore-detail');
  if (detailPanel) {
    let imgWrap = detailPanel.querySelector('.explore-detail__image-wrap');
    if (!imgWrap && card.image) {
      const keywordsEl = detailPanel.querySelector('[data-detail-keywords]');
      if (keywordsEl) {
        keywordsEl.insertAdjacentHTML('beforebegin', getCardImageHTML(card));
      }
    } else if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img && img.alt !== card.name_vi) {
        img.src = card.image ?? '';
        img.alt = card.name_vi;
        imgWrap.hidden = false;
      }
    }
  }

  renderRelatedCards(card);
}

// ─── Catalog ──────────────────────────────────────────────────────────────────

function updateSummary() {
  if (resultCount) resultCount.textContent = String(state.filteredCards.length);
  if (activeFilterLabel) activeFilterLabel.textContent = getFilterLabel(state.activeFilter);
  if (searchState) {
    searchState.textContent = state.query
      ? `Tìm: "${state.query}"`
      : 'Sẵn sàng tra cứu';
  }
  document.title = state.query
    ? `Explore: ${state.query} | Tarot Ghibli Inspired`
    : 'Explore | Tarot Ghibli Inspired';
}

function createCardItem(card) {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'catalog-card';
  button.style.setProperty('--catalog-accent', card.accent ?? '#f0c060');
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = `
    <div class="catalog-card__art">
      <span class="catalog-card__arcana">${card.arcana === 'major' ? 'Major Arcana' : card.suit}</span>
      <span class="catalog-card__glyph">${getCardGlyph(card)}</span>
      <div class="catalog-card__names">
        <strong>${card.name}</strong>
        <span>${card.name_vi}</span>
      </div>
    </div>
    <span class="catalog-card__keywords">${card.keywords_upright.join(', ')}</span>
  `;
  button.addEventListener('click', () => {
    state.activeCardId = card.id;
    syncActiveCardState();
    renderDetail(card);
  });
  item.append(button);
  return item;
}

function syncActiveCardState() {
  const activeCard = getActiveCard();
  const buttons = catalog?.querySelectorAll('.catalog-card') ?? [];
  buttons.forEach((button, index) => {
    const card = state.filteredCards[index];
    const isActive = activeCard ? card?.id === activeCard.id : false;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function renderCatalog() {
  if (!catalog) return;
  catalog.setAttribute('aria-busy', 'false');

  if (!state.filteredCards.length) {
    const empty = document.createElement('li');
    empty.className = 'catalog-empty';
    empty.textContent = 'Không có lá bài nào khớp với bộ lọc và từ khóa hiện tại.';
    catalog.replaceChildren(empty);
    renderDetail(null);
    updateSummary();
    return;
  }

  if (!state.filteredCards.some((card) => card.id === state.activeCardId)) {
    state.activeCardId = state.filteredCards[0].id;
  }

  catalog.replaceChildren(...state.filteredCards.map(createCardItem));
  catalog.querySelectorAll('.catalog-card').forEach((button, index) => {
    button.style.setProperty('--reveal-index', String(index));
  });
  catalog.dataset.ready = 'true';
  syncActiveCardState();
  renderDetail(getActiveCard());
  updateSummary();
}

function applyFilters() {
  state.filteredCards = filterCards(state.cards, {
    filter: state.activeFilter,
    query: state.query
  });
  renderCatalog();
}

// ─── Init ────────────────────────────────────────────────────────────────────

async function initializeExplorePage() {
  try {
    const payload = await loadTarotData();
    state.cards = payload.cards;
    state.filteredCards = payload.cards;
    state.activeCardId = payload.cards[0]?.id ?? null;
    applyFilters();
  } catch (error) {
    if (searchState) searchState.textContent = 'Không tải được dữ liệu';
    if (catalog) {
      catalog.setAttribute('aria-busy', 'false');
      const empty = document.createElement('li');
      empty.className = 'catalog-empty';
      empty.textContent = 'Không thể tải tarot.json. Kiểm tra đường dẫn và build output.';
      catalog.replaceChildren(empty);
    }
    console.error(error);
  }
}

// ─── Event listeners ─────────────────────────────────────────────────────────

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    state.query = event.currentTarget.value.trim();
    applyFilters();
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.activeFilter = button.dataset.filter ?? 'all';
    filterButtons.forEach((entry) => {
      entry.classList.toggle('is-active', entry === button);
    });
    applyFilters();
  });
});

detailTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    state.detailMode = tab.dataset.detailTab ?? 'upright';
    renderDetail(getActiveCard());
  });
});

initializeExplorePage();
