export async function loadTarotData() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/tarot.json`);

  if (!response.ok) {
    throw new Error('Unable to load tarot data.');
  }

  const payload = await response.json();
  const cards = Array.isArray(payload?.cards) ? payload.cards : [];

  return {
    meta: {
      version: payload?.meta?.version ?? 1,
      language: payload?.meta?.language ?? 'vi',
      card_count: cards.length,
      major_count: cards.filter((card) => card.arcana === 'major').length,
      minor_count: cards.filter((card) => card.arcana === 'minor').length,
      suits: payload?.meta?.suits ?? ['wands', 'cups', 'swords', 'pentacles']
    },
    cards
  };
}
