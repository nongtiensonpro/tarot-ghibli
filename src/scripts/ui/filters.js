export function filterCards(cards, { filter = 'all', query = '' } = {}) {
  const normalizedQuery = query.trim().toLowerCase();

  return cards.filter((card) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'major' && card.arcana === 'major') ||
      card.suit === filter;

    if (!matchesFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableFields = [
      card.name,
      card.name_vi,
      card.arcana,
      card.suit,
      card.suit_vi,
      card.element,
      ...(card.keywords_upright ?? []),
      ...(card.keywords_reversed ?? [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableFields.includes(normalizedQuery);
  });
}
