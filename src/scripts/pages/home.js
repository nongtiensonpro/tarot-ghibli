import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/utilities.css';
import '../../styles/components.css';
import '../../styles/animations.css';
import '../../styles/pages/home.css';
import { getSpreadDefinition } from '../../content/spread-definitions.js';
import { createReading } from '../core/tarot-engine.js';
import { loadTarotData } from '../core/tarot-data.js';
import { spreads } from '../core/spreads.js';
import { saveReading } from '../core/storage.js';

const spreadMeta = {
  single: {
    label: '1 lá',
    detail: 'Thông điệp trong ngày'
  },
  three: {
    label: '3 lá',
    detail: 'Quá khứ, hiện tại, tương lai'
  },
  celtic: {
    label: 'Celtic Cross',
    detail: 'Đọc bối cảnh với 10 lá'
  }
};

document.documentElement.classList.add('is-ready');

const form = document.querySelector('[data-spread-form]');
const spreadLabel = document.querySelector('[data-spread-label]');
const spreadDetail = document.querySelector('[data-spread-detail]');
const readingCta = document.querySelector('[data-reading-cta]');
const homeStatus = document.querySelector('[data-home-status]');
let tarotCards = [];

function updateSpreadState() {
  if (!form || !spreadLabel || !spreadDetail || !readingCta) {
    return;
  }

  const formData = new FormData(form);
  const spread = formData.get('spread') ?? 'single';
  const reversed = formData.get('reversed') === 'on';
  const optionMeta = spreadMeta[spread] ?? spreadMeta.single;

  spreadLabel.textContent = optionMeta.label;
  spreadDetail.textContent = optionMeta.detail;
  readingCta.textContent = tarotCards.length
    ? `Bắt đầu trải ${optionMeta.label}`
    : 'Đang nạp bộ bài...';
  readingCta.disabled = tarotCards.length === 0;
  readingCta.dataset.spread = spread;
  readingCta.dataset.reversed = String(reversed);

  form.querySelectorAll('.spread-option').forEach((option) => {
    const input = option.querySelector('input[name="spread"]');
    option.classList.toggle('is-active', input?.checked ?? false);
  });
}

async function initializeHomePage() {
  try {
    const payload = await loadTarotData();
    tarotCards = payload.cards;
    if (homeStatus) {
      homeStatus.textContent = `Bộ bài đã sẵn sàng: ${payload.meta.card_count} lá.`;
    }
    updateSpreadState();
  } catch (error) {
    if (readingCta) {
      readingCta.textContent = 'Không tải được dữ liệu';
      readingCta.disabled = true;
    }
    if (homeStatus) {
      homeStatus.textContent = 'Không tải được tarot.json. Vui lòng thử lại.';
    }
    console.error(error);
  }
}

if (form) {
  form.addEventListener('change', updateSpreadState);
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!tarotCards.length) {
      return;
    }

    const formData = new FormData(form);
    const spreadId = formData.get('spread') ?? 'single';
    const reversed = formData.get('reversed') === 'on';
    const spread = spreads[spreadId] ?? spreads.single;
    const definition = getSpreadDefinition(spread.id);
    const reading = createReading({
      cards: tarotCards,
      spread,
      positions: definition.positions,
      allowReversed: reversed
    });

    saveReading(reading);
    window.location.href = `./reading.html?spread=${spread.id}`;
  });
  updateSpreadState();
}

initializeHomePage();
