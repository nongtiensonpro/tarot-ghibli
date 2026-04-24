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
    label: '1 la',
    detail: 'Thong diep trong ngay'
  },
  three: {
    label: '3 la',
    detail: 'Qua khu, hien tai, tuong lai'
  },
  celtic: {
    label: 'Celtic Cross',
    detail: 'Doc boi canh voi 10 la'
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
    ? `Bat dau trai ${optionMeta.label}`
    : 'Dang nap bo bai...';
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
      homeStatus.textContent = `Bo bai da san sang: ${payload.meta.card_count} la.`;
    }
    updateSpreadState();
  } catch (error) {
    if (readingCta) {
      readingCta.textContent = 'Khong tai duoc du lieu';
      readingCta.disabled = true;
    }
    if (homeStatus) {
      homeStatus.textContent = 'Khong tai duoc tarot.json. Vui long thu lai.';
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
