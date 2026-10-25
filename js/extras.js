/* Each block runs only on its own activity page. All content stays browser-local. */
'use strict';
(() => {
  const left = document.getElementById('compare-left');
  if (!left) return;
  const right = document.getElementById('compare-right');
  const status = document.getElementById('compare-status');
  const results = document.getElementById('compare-results');
  right.value = 'europe';
  function textElement(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
  }
  function renderComparison(changed) {
    status.textContent = '';
    if (left.value === right.value) {
      const other = changed === left ? right : left;
      other.value = FOODIE_REGIONS.find(region => region.slug !== changed.value).slug;
      status.textContent = 'Two different regions are needed. The other selection has been changed automatically.';
    }
    const pair = [left, right].map(select => FOODIE_REGIONS.find(region => region.slug === select.value));
    const table = document.createElement('table');
    table.className = 'comparison-table';
    table.append(textElement('caption', `${pair[0].name} and ${pair[1].name}: examples from our menu`));
    const thead = document.createElement('thead');
    const headingRow = document.createElement('tr');
    ['Explore', ...pair.map(region => `${region.icon} ${region.name}`)].forEach(label => {
      const heading = textElement('th', label);
      heading.scope = 'col';
      headingRow.append(heading);
    });
    thead.append(headingRow);
    table.append(thead);
    const tbody = document.createElement('tbody');
    [['ingredients', 'Ingredients in our selection'], ['flavours', 'Flavour examples'], ['drinks', 'Drinks'], ['breakies', 'Breakies'], ['fullies', 'Fullies']].forEach(([key, label]) => {
      const row = document.createElement('tr');
      const heading = textElement('th', label);
      heading.scope = 'row';
      row.append(heading);
      pair.forEach(region => {
        const cell = document.createElement('td');
        if (Array.isArray(region[key])) {
          const list = document.createElement('ul');
          region[key].forEach(dish => {
            const item = document.createElement('li');
            const link = textElement('a', dish);
            link.href = `${region.slug}-${key}.html`;
            item.append(link);
            list.append(item);
          });
          cell.append(list);
        } else cell.textContent = region[key];
        row.append(cell);
      });
      tbody.append(row);
    });
    table.append(tbody);
    const scroll = document.createElement('div');
    scroll.className = 'table-scroll';
    scroll.append(table);
    const first = pair[0].ingredients.split(', ').map(item => item.toLowerCase());
    const second = pair[1].ingredients.split(', ').map(item => item.toLowerCase());
    const shared = first.filter(item => second.includes(item));
    const note = textElement('p', shared.length ? `Shared in these selections: ${shared.join(', ')}.` : 'No exact ingredient matches in these short lists. Explore the menus for a broader picture.');
    note.className = 'shared-ingredients';
    results.replaceChildren(scroll, note);
  }
  left.addEventListener('change', () => renderComparison(left));
  right.addEventListener('change', () => renderComparison(right));
  document.getElementById('swap-regions').addEventListener('click', () => {
    [left.value, right.value] = [right.value, left.value];
    renderComparison();
    status.textContent = 'Regions swapped.';
  });
  renderComparison();
})();

(() => {
  const questionHeading = document.getElementById('quiz-question');
  if (!questionHeading) return;
  const options = document.getElementById('quiz-options');
  const feedback = document.getElementById('quiz-feedback');
  const next = document.getElementById('quiz-next');
  const round = document.getElementById('quiz-round');
  const finish = document.getElementById('quiz-finish');
  const progress = document.getElementById('quiz-progress');
  let questions = [], answers = [], index = 0, score = 0, answered = false;
  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function start(focus = false) {
    questions = shuffle(FOODIE_REGIONS).slice(0, 5).map(region => {
      const category = shuffle(['drinks', 'breakies', 'fullies'])[0];
      return {region, category, dish: shuffle(region[category])[0], choices: shuffle([region, ...shuffle(FOODIE_REGIONS.filter(item => item !== region)).slice(0, 3)])};
    });
    answers = []; index = 0; score = 0;
    finish.hidden = true;
    round.hidden = false;
    renderQuestion(focus);
  }
  function renderQuestion(focus = true) {
    answered = false;
    const question = questions[index];
    document.getElementById('quiz-count').textContent = `Question ${index + 1} of 5`;
    document.getElementById('quiz-score').textContent = `Score: ${score}`;
    progress.value = index;
    questionHeading.textContent = question.dish;
    feedback.textContent = '';
    feedback.className = 'quiz-feedback';
    next.hidden = true;
    next.textContent = index === 4 ? 'See results →' : 'Next question →';
    options.replaceChildren();
    question.choices.forEach(region => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      button.textContent = `${region.icon} ${region.name}`;
      button.dataset.region = region.slug;
      button.addEventListener('click', () => choose(region, button));
      options.append(button);
    });
    if (focus) questionHeading.focus();
  }
  function choose(chosen, button) {
    if (answered) return;
    answered = true;
    const question = questions[index];
    const correct = chosen.slug === question.region.slug;
    if (correct) score++;
    answers.push({question, chosen, correct});
    options.querySelectorAll('button').forEach(option => {
      option.disabled = true;
      if (option.dataset.region === question.region.slug) {
        option.classList.add('answer-correct');
        option.textContent += ' ✓';
      }
    });
    if (!correct) { button.classList.add('answer-wrong'); button.textContent += ' ✕'; }
    feedback.textContent = correct ? `Correct! ${question.dish} is listed under ${question.region.name}.` : `This one is listed under ${question.region.name}. You chose ${chosen.name}.`;
    feedback.classList.add(correct ? 'correct-feedback' : 'wrong-feedback');
    document.getElementById('quiz-score').textContent = `Score: ${score}`;
    progress.value = index + 1;
    next.hidden = false;
    next.focus();
  }
  function showResults() {
    round.hidden = true;
    finish.hidden = false;
    document.getElementById('quiz-count').textContent = '5 questions answered';
    document.getElementById('quiz-final-score').textContent = `${score} / 5 — ${score === 5 ? 'A perfect food trail!' : score >= 3 ? 'A tasty effort!' : 'More flavours to discover!'}`;
    let best = score;
    let stored = true;
    try {
      const previous = Number(localStorage.getItem('foodie-world-quiz-best') || 0);
      if (Number.isInteger(previous) && previous >= 0 && previous <= 5) best = Math.max(score, previous);
      localStorage.setItem('foodie-world-quiz-best', String(best));
    } catch (error) { stored = false; }
    document.getElementById('quiz-best').textContent = stored ? `Best score in this browser: ${best} / 5` : 'Browser storage is unavailable; your score is shown above.';
    const review = document.getElementById('quiz-review');
    review.replaceChildren();
    answers.forEach(({question, chosen, correct}) => {
      const item = document.createElement('li');
      const title = document.createElement('strong');
      title.textContent = `${correct ? '✓' : '✕'} ${question.dish}`;
      const detail = document.createElement('p');
      detail.textContent = `Your answer: ${chosen.name}. Listed region: ${question.region.name}.`;
      const link = document.createElement('a');
      link.href = `${question.region.slug}-${question.category}.html`;
      link.textContent = 'Explore this menu →';
      item.append(title, detail, link);
      review.append(item);
    });
    document.getElementById('quiz-final-heading').focus();
  }
  next.addEventListener('click', () => {
    if (!answered) return;
    index++;
    if (index === questions.length) showResults();
    else renderQuestion();
  });
  document.getElementById('quiz-restart').addEventListener('click', () => start(true));
  start();
})();

(() => {
  const filter = document.getElementById('gallery-region');
  if (!filter) return;
  const figures = [...document.querySelectorAll('.gallery-card')];
  const dialog = document.getElementById('photo-dialog');
  const previous = document.getElementById('photo-prev');
  const next = document.getElementById('photo-next');
  let current = 0, opener = null;
  const visible = () => figures.filter(figure => !figure.hidden);
  function showPhoto() {
    const pictures = visible();
    const figure = pictures[current];
    const image = figure.querySelector('img');
    const displayed = document.getElementById('photo-dialog-image');
    displayed.src = image.src;
    displayed.alt = image.alt;
    document.getElementById('photo-dialog-title').textContent = figure.querySelector('.gallery-title').textContent;
    document.getElementById('photo-dialog-description').textContent = figure.querySelector('.gallery-description').textContent;
    document.getElementById('photo-dialog-credit').replaceChildren(figure.querySelector('.photo-credit').cloneNode(true));
    const source = figure.querySelector('.photo-source');
    document.getElementById('photo-dialog-source').href = source.href;
    document.getElementById('photo-position').textContent = `${current + 1} of ${pictures.length}`;
    previous.disabled = next.disabled = pictures.length < 2;
  }
  function move(direction) {
    const length = visible().length;
    if (length < 2) return;
    current = (current + direction + length) % length;
    showPhoto();
  }
  figures.forEach(figure => {
    const link = figure.querySelector('.gallery-open');
    link.addEventListener('click', event => {
      if (typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      opener = link;
      current = visible().indexOf(figure);
      showPhoto();
      dialog.showModal();
      document.getElementById('photo-close').focus();
    });
  });
  function filterGallery() {
    figures.forEach(figure => { figure.hidden = filter.value !== 'all' && figure.dataset.galleryRegion !== filter.value; });
    const count = visible().length;
    document.getElementById('gallery-count').textContent = `${count} photograph${count === 1 ? '' : 's'}`;
  }
  filter.addEventListener('change', filterGallery);
  const requestedRegion = new URLSearchParams(window.location.search).get('region');
  if ([...filter.options].some(option => option.value === requestedRegion)) filter.value = requestedRegion;
  filterGallery();
  const requestedPhoto = document.getElementById(window.location.hash.slice(1));
  if (requestedPhoto && requestedPhoto.classList.contains('gallery-card') && !requestedPhoto.hidden) requestedPhoto.scrollIntoView({block: 'center'});
  document.getElementById('photo-close').addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { if (opener && !opener.closest('figure').hidden) opener.focus(); });
})();

(() => {
  const massForm = document.getElementById('mass-form');
  if (!massForm) return;
  const massInput = document.getElementById('mass-amount');
  const massDirection = document.getElementById('mass-direction');
  const ingredient = document.getElementById('mass-ingredient');
  const massResult = document.getElementById('mass-result');
  const massError = document.getElementById('mass-error');
  const tempForm = document.getElementById('temperature-form');
  const tempInput = document.getElementById('temperature-amount');
  const tempDirection = document.getElementById('temperature-direction');
  const tempResult = document.getElementById('temperature-result');
  const tempError = document.getElementById('temperature-error');
  function format(value) {
    if (value === 0 || Object.is(value, -0)) return '0';
    if (Math.abs(value) < 0.001 || Math.abs(value) >= 1e9) return value.toExponential(3);
    return new Intl.NumberFormat('en', {maximumFractionDigits: 3}).format(value);
  }
  function clearMass() {
    massResult.textContent = '';
    massError.textContent = '';
    massInput.removeAttribute('aria-invalid');
    document.getElementById('mass-amount-label').textContent = massDirection.value === 'cups-to-grams' ? 'Amount in US cups' : 'Amount in grams';
    const chosen = INGREDIENT_WEIGHTS[ingredient.value];
    document.getElementById('mass-explanation').textContent = `Using 1 US cup of ${chosen.name.toLowerCase()} ≈ ${chosen.grams} g.`;
  }
  function clearTemperature() {
    tempResult.textContent = '';
    tempError.textContent = '';
    tempInput.removeAttribute('aria-invalid');
    document.getElementById('temperature-amount-label').textContent = tempDirection.value === 'c-to-f' ? 'Temperature in °C' : 'Temperature in °F';
  }
  massForm.addEventListener('submit', event => {
    event.preventDefault();
    clearMass();
    try {
      const value = massInput.valueAsNumber;
      const chosen = INGREDIENT_WEIGHTS[ingredient.value];
      const result = FoodieConversions.mass(value, chosen.grams, massDirection.value);
      const forward = massDirection.value === 'cups-to-grams';
      const inputUnit = forward ? (value === 1 ? 'US cup' : 'US cups') : 'g';
      const outputUnit = forward ? 'g' : (result === 1 ? 'US cup' : 'US cups');
      massResult.textContent = `${format(value)} ${inputUnit} ${chosen.name.toLowerCase()} ≈ ${format(result)} ${outputUnit}`;
    } catch (error) {
      massError.textContent = error.message;
      massInput.setAttribute('aria-invalid', 'true');
      massInput.focus();
    }
  });
  tempForm.addEventListener('submit', event => {
    event.preventDefault();
    clearTemperature();
    try {
      const value = tempInput.valueAsNumber;
      const result = FoodieConversions.temperature(value, tempDirection.value);
      tempResult.textContent = `${format(value)} ${tempDirection.value === 'c-to-f' ? '°C' : '°F'} = ${format(result)} ${tempDirection.value === 'c-to-f' ? '°F' : '°C'}`;
    } catch (error) {
      tempError.textContent = error.message;
      tempInput.setAttribute('aria-invalid', 'true');
      tempInput.focus();
    }
  });
  massInput.addEventListener('input', clearMass);
  ingredient.addEventListener('change', clearMass);
  massDirection.addEventListener('change', clearMass);
  tempInput.addEventListener('input', clearTemperature);
  tempDirection.addEventListener('change', clearTemperature);
  clearMass(); clearTemperature();
})();
