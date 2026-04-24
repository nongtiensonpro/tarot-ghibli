export function shuffleDeck(cards) {
  const deck = [...cards];

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }

  return deck;
}

export function drawCards(cards, count, allowReversed = true) {
  if (!Array.isArray(cards)) {
    throw new Error('Cards must be an array.');
  }

  if (count < 1 || count > cards.length) {
    throw new Error('Requested card count is out of range.');
  }

  const deck = shuffleDeck(cards);

  return deck.slice(0, count).map((card, index) => ({
    draw_order: index,
    is_reversed: allowReversed ? Math.random() >= 0.5 : false,
    card
  }));
}

export function createReading({ cards, spread, positions, allowReversed = true }) {
  if (!spread?.id || !Array.isArray(positions)) {
    throw new Error('Spread metadata is required.');
  }

  const draws = drawCards(cards, spread.count, allowReversed);

  return {
    spread: {
      id: spread.id,
      label: spread.label,
      title: spread.title,
      count: spread.count
    },
    reversed_enabled: allowReversed,
    created_at: new Date().toISOString(),
    cards: draws.map((draw, index) => ({
      position_index: index,
      position_label: positions[index] ?? `Vi tri ${index + 1}`,
      is_reversed: draw.is_reversed,
      card: draw.card
    }))
  };
}
