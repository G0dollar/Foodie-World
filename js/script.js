/* Shared category-page interactions; other pages safely skip this block. */
'use strict';
const cards = [...document.querySelectorAll('.food-card')];
if (cards.length) {
  const search = document.getElementById('search');
  const vegetarian = document.getElementById('veg-only');
  const message = document.getElementById('pick-message');
  function filterCards() {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const matches = card.dataset.name.toLocaleLowerCase().includes(query)
        && (!vegetarian.checked || card.dataset.veg === 'true');
      card.hidden = !matches;
      card.classList.remove('picked');
      if (matches) visible++;
    });
    document.getElementById('result-count').textContent = `${visible} of ${cards.length} entries shown`;
    document.getElementById('empty').hidden = visible !== 0;
    document.getElementById('surprise').disabled = visible === 0;
    message.textContent = '';
  }
  search.addEventListener('input', filterCards);
  vegetarian.addEventListener('change', filterCards);
  document.getElementById('surprise').addEventListener('click', () => {
    const visible = cards.filter(card => !card.hidden);
    if (!visible.length) return;
    cards.forEach(card => card.classList.remove('picked'));
    const selected = visible[Math.floor(Math.random() * visible.length)];
    selected.classList.add('picked');
    selected.querySelector('details').open = true;
    message.textContent = `Your pick: ${selected.dataset.name}. Enjoy exploring!`;
    selected.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center'});
  });
  filterCards();
}
