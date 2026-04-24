export function createCardPlaceholder(label) {
  const element = document.createElement('div');
  element.className = 'card-placeholder';
  element.textContent = label;
  return element;
}
