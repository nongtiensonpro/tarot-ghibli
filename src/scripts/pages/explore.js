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

function getFilterLabel(filter) {
  const labels = {
    all: 'Tat ca',
    major: 'Major Arcana',
    wands: 'Wands',
    cups: 'Cups',
    swords: 'Swords',
    pentacles: 'Pentacles'
  };

  return labels[filter] ?? 'Tat ca';
}

function getCardGlyph(card) {
  if (card.arcana === 'major') {
    return card.rank;
  }

  return card.rank.slice(0, 1);
}

function getActiveCard() {
  return (
    state.filteredCards.find((card) => card.id === state.activeCardId) ??
    state.filteredCards[0] ??
    null
  );
}

function updateSummary() {
  if (resultCount) {
    resultCount.textContent = String(state.filteredCards.length);
  }

  if (activeFilterLabel) {
    activeFilterLabel.textContent = getFilterLabel(state.activeFilter);
  }

  if (searchState) {
    searchState.textContent = state.query
      ? `Tim: "${state.query}"`
      : 'San sang tra cuu';
  }

  document.title = state.query
    ? `Explore: ${state.query} | Tarot Ghibli Inspired`
    : 'Explore | Tarot Ghibli Inspired';
}

function renderDetail(card) {
  if (!detailArcana || !detailName || !detailMeta || !detailKeywords || !detailHeading || !detailMeaning) {
    return;
  }

  if (!card) {
    detailArcana.textContent = 'Khong co ket qua';
    detailName.textContent = 'Khong tim thay la bai phu hop';
    detailMeta.textContent = 'Thu doi bo loc hoac tu khoa tim kiem khac.';
    detailHeading.textContent = 'Khong co du lieu';
    detailMeaning.textContent = 'Danh sach hien tai khong co la bai nao khop voi bo loc dang chon.';
    detailKeywords.replaceChildren();
    return;
  }

  const meaning =
    state.detailMode === 'reversed' ? card.meaning_reversed : card.meaning_upright;
  const keywords =
    state.detailMode === 'reversed' ? card.keywords_reversed : card.keywords_upright;

  detailArcana.textContent =
    card.arcana === 'major'
      ? `Major Arcana • ${card.rank}`
      : `${card.suit_vi} • ${card.rank}`;
  detailName.textContent = card.name;
  detailMeta.textContent = `${card.name_vi} • ${card.element} • ${getFilterLabel(card.suit ?? 'major')}`;
  detailHeading.textContent = state.detailMode === 'reversed' ? 'Nghia nguoc' : 'Nghia xuoi';
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
  if (!catalog) {
    return;
  }

  catalog.setAttribute('aria-busy', 'false');

  if (!state.filteredCards.length) {
    const empty = document.createElement('li');
    empty.className = 'catalog-empty';
    empty.textContent = 'Khong co la bai nao khop voi bo loc va tu khoa hien tai.';
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

async function initializeExplorePage() {
  try {
    const payload = await loadTarotData();
    state.cards = payload.cards;
    state.filteredCards = payload.cards;
    state.activeCardId = payload.cards[0]?.id ?? null;
    applyFilters();
  } catch (error) {
    if (searchState) {
      searchState.textContent = 'Khong tai duoc du lieu';
    }
    if (catalog) {
      catalog.setAttribute('aria-busy', 'false');
      const empty = document.createElement('li');
      empty.className = 'catalog-empty';
      empty.textContent = 'Khong the tai tarot.json. Kiem tra duong dan va build output.';
      catalog.replaceChildren(empty);
    }
    console.error(error);
  }
}

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
