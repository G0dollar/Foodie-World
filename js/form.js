/* A frontend demonstration: suggestions stay on the current browser. */
'use strict';
const form = document.getElementById('suggest-form');
const statusMessage = document.getElementById('form-status');
const storageKey = 'foodie-world-suggestions-v1';
const savedList = document.getElementById('saved-list');
const limits = {'your-name': 2, 'dish-name': 2, origin: 2, ingredients: 10, region: 1, category: 1};
let storageAvailable = true;
let suggestions = [];
try {
  const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
  suggestions = Array.isArray(parsed) ? parsed.filter(item => item && typeof item.dishName === 'string' && typeof item.region === 'string').slice(0, 50) : [];
} catch (error) { storageAvailable = false; }
function validateField(id) {
  const field = document.getElementById(id);
  const value = field.value.trim();
  let error = '';
  if (!value) error = 'Please complete this field.';
  else if (value.length < limits[id]) error = `Please enter at least ${limits[id]} characters.`;
  else if (!field.checkValidity()) error = 'Please check this value.';
  field.setAttribute('aria-invalid', error ? 'true' : 'false');
  document.getElementById(`${id}-error`).textContent = error;
  return !error;
}
function renderSaved() {
  savedList.replaceChildren();
  if (!suggestions.length) {
    const item = document.createElement('li');
    item.textContent = storageAvailable ? 'No suggestions yet. Your next favourite could be the first.' : 'Browser storage is unavailable. Suggestions cannot be saved here.';
    savedList.append(item);
  }
  suggestions.slice().reverse().forEach(suggestion => {
    const item = document.createElement('li');
    const heading = document.createElement('strong');
    const description = document.createElement('p');
    const ingredients = document.createElement('p');
    heading.textContent = suggestion.dishName;
    description.textContent = `${suggestion.region} · ${suggestion.category} · ${suggestion.origin} · ${suggestion.vegetarian ? 'Vegetarian' : 'Not marked vegetarian'} · Suggested by ${suggestion.yourName}`;
    ingredients.textContent = suggestion.ingredients;
    item.append(heading, description, ingredients);
    savedList.append(item);
  });
}
Object.keys(limits).forEach(id => {
  const field = document.getElementById(id);
  field.addEventListener('blur', () => validateField(id));
  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validateField(id);
  });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const valid = Object.keys(limits).map(validateField);
  if (valid.includes(false)) {
    statusMessage.textContent = 'Please correct the highlighted fields.';
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }
  const values = Object.fromEntries(new FormData(form));
  Object.keys(values).forEach(key => { values[key] = values[key].trim(); });
  values.vegetarian = document.getElementById('vegetarian').checked;
  const next = [...suggestions, values].slice(-50);
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
    storageAvailable = true;
    suggestions = next;
    form.reset();
    statusMessage.textContent = 'Saved in this browser! Your suggestion appears below.';
    renderSaved();
  } catch (error) {
    statusMessage.textContent = 'Your details are valid, but browser storage is unavailable or full. Nothing was saved. Please copy your suggestion before leaving.';
  }
});
form.addEventListener('reset', () => {
  Object.keys(limits).forEach(id => {
    document.getElementById(id).removeAttribute('aria-invalid');
    document.getElementById(`${id}-error`).textContent = '';
  });
  statusMessage.textContent = '';
});
document.getElementById('clear-suggestions').addEventListener('click', () => {
  if (!suggestions.length) { statusMessage.textContent = 'There are no saved suggestions to delete.'; return; }
  if (!window.confirm('Delete all suggestions saved in this browser?')) return;
  try {
    localStorage.removeItem(storageKey);
    suggestions = [];
    storageAvailable = true;
    renderSaved();
    statusMessage.textContent = 'Saved suggestions deleted.';
  } catch (error) { statusMessage.textContent = 'Could not delete suggestions. Check your browser storage settings.'; }
});
renderSaved();
