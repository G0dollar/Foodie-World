'use strict';
(() => {
  const page = document.body.dataset.orderPage;
  if (!page) return;

  const items = Array.isArray(window.FOODIE_ORDER_ITEMS) ? window.FOODIE_ORDER_ITEMS : [];
  const itemById = new Map(items.map(item => [item.id, item]));
  const cartKey = 'foodie-world-demo-cart-v1';
  const orderKey = 'foodie-world-demo-latest-order-v1';
  const discountOptions = [5, 10, 15, 20];
  const currency = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });
  const regionNames = {
    asia: 'Asia',
    europe: 'Europe',
    africa: 'Africa',
    americas: 'Americas',
    'middle-east': 'Middle East',
    oceania: 'Oceania'
  };
  const categoryNames = {drinks: 'Drinks', breakies: 'Breakies', fullies: 'Fullies'};
  let storageWarning = '';
  let cart = readCart();

  function readCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(cartKey) || 'null');
      if (!saved || typeof saved !== 'object' || !saved.items || typeof saved.items !== 'object') {
        return {items: {}, discountPercent: 0, promoCode: ''};
      }
      const savedItems = {};
      Object.entries(saved.items).forEach(([id, quantity]) => {
        if (itemById.has(id) && Number.isInteger(quantity) && quantity > 0 && quantity <= 99) {
          savedItems[id] = quantity;
        }
      });
      const validDiscount = discountOptions.includes(saved.discountPercent);
      return {
        items: savedItems,
        discountPercent: Object.keys(savedItems).length && validDiscount ? saved.discountPercent : 0,
        promoCode: Object.keys(savedItems).length && validDiscount && typeof saved.promoCode === 'string'
          ? saved.promoCode
          : ''
      };
    } catch (error) {
      storageWarning = 'Your saved basket could not be read. Browser storage may be unavailable; this demo cannot restore the basket.';
      return {items: {}, discountPercent: 0, promoCode: ''};
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
      storageWarning = '';
      return true;
    } catch (error) {
      storageWarning = 'The basket changed on this page, but browser storage could not save it. It may not be available on the next page.';
      return false;
    }
  }

  function money(amount) {
    return currency.format(amount);
  }

  function text(tag, value, className) {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    return element;
  }

  function cartLines() {
    return Object.entries(cart.items)
      .map(([id, quantity]) => ({item: itemById.get(id), quantity}))
      .filter(line => line.item);
  }

  function totals() {
    const subtotal = cartLines().reduce((sum, line) => sum + line.item.price * line.quantity, 0);
    const delivery = subtotal === 0 || subtotal >= 600 ? 0 : 40;
    const discount = Math.round(subtotal * cart.discountPercent / 100);
    return {subtotal, delivery, discount, total: subtotal + delivery - discount};
  }

  function renderTotals(container) {
    const amounts = totals();
    container.replaceChildren();
    const rows = [
      ['Subtotal', money(amounts.subtotal), ''],
      ['Delivery', amounts.delivery ? money(amounts.delivery) : (amounts.subtotal ? 'Free' : money(0)), ''],
      [`Surprise discount (${cart.discountPercent || 0}%)`, `−${money(amounts.discount)}`, 'discount']
    ];
    rows.forEach(([label, amount, className]) => {
      const row = text('div', '', `price-row${className ? ` ${className}` : ''}`);
      row.append(text('span', label), text('strong', amount));
      container.append(row);
    });
    const total = text('div', '', 'price-row total');
    total.append(text('span', 'Demo total'), text('strong', money(amounts.total)));
    container.append(total);
  }

  function setDiscount() {
    const selected = discountOptions[Math.floor(Math.random() * discountOptions.length)];
    cart.discountPercent = selected;
    cart.promoCode = `SURPRISE${selected}`;
  }

  function updateCartStatus(message) {
    const status = document.getElementById('basket-status');
    if (status) status.textContent = storageWarning || message;
  }

  function renderCart() {
    const list = document.getElementById('basket-items');
    if (!list) return;
    const lines = cartLines();
    list.replaceChildren();
    document.getElementById('basket-empty').hidden = lines.length > 0;
    document.getElementById('basket-totals').hidden = lines.length === 0;
    document.getElementById('basket-promo').hidden = lines.length === 0;
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    document.getElementById('basket-count').textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
    const checkout = document.getElementById('checkout-link');
    checkout.setAttribute('aria-disabled', lines.length ? 'false' : 'true');

    lines.forEach(({item, quantity}) => {
      const row = text('li', '', 'basket-line');
      const top = text('div', '', 'basket-line-top');
      top.append(text('h3', item.name), text('span', money(item.price * quantity), 'basket-line-price'));
      row.append(top, text('p', `${regionNames[item.region]} · ${categoryNames[item.category]}`, 'basket-line-region'));
      const controls = text('div', '', 'quantity-control');
      const decrease = text('button', '−');
      decrease.type = 'button';
      decrease.setAttribute('aria-label', `Decrease ${item.name} quantity`);
      decrease.dataset.action = 'decrease';
      decrease.dataset.id = item.id;
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '1';
      input.max = '99';
      input.step = '1';
      input.value = String(quantity);
      input.inputMode = 'numeric';
      input.setAttribute('aria-label', `${item.name} quantity`);
      input.dataset.quantityFor = item.id;
      const increase = text('button', '+');
      increase.type = 'button';
      increase.setAttribute('aria-label', `Increase ${item.name} quantity`);
      increase.dataset.action = 'increase';
      increase.dataset.id = item.id;
      const remove = text('button', 'Remove', 'remove-item');
      remove.type = 'button';
      remove.dataset.action = 'remove';
      remove.dataset.id = item.id;
      controls.append(decrease, input, increase, remove);
      row.append(controls);
      list.append(row);
    });

    renderTotals(document.getElementById('basket-totals'));
    document.getElementById('basket-promo').textContent = lines.length
      ? `🎉 Random ${cart.discountPercent}% basket discount · ${cart.promoCode}`
      : '';
    updateCartStatus('');
  }

  function changeQuantity(id, quantity) {
    if (!itemById.has(id)) return;
    if (quantity <= 0) delete cart.items[id];
    else cart.items[id] = Math.min(99, quantity);
    if (!Object.keys(cart.items).length) {
      cart.discountPercent = 0;
      cart.promoCode = '';
    }
    saveCart();
    renderCart();
  }

  function renderMenu() {
    const products = document.getElementById('order-products');
    if (!products) return;
    const search = document.getElementById('order-search').value.trim().toLocaleLowerCase();
    const region = document.getElementById('order-region').value;
    const category = document.getElementById('order-category').value;
    const vegetarianOnly = document.getElementById('order-vegetarian').checked;
    const filtered = items.filter(item => {
      const matchesSearch = `${item.name} ${item.origin} ${item.description}`.toLocaleLowerCase().includes(search);
      return matchesSearch &&
        (region === 'all' || item.region === region) &&
        (category === 'all' || item.category === category) &&
        (!vegetarianOnly || item.vegetarian);
    });
    products.replaceChildren();
    filtered.forEach(item => {
      const card = text('article', '', 'order-product');
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = item.name;
      image.loading = 'lazy';
      image.decoding = 'async';
      const body = text('div', '', 'order-product-body');
      const meta = text('div', '', 'order-product-top');
      meta.append(
        text('span', regionNames[item.region], 'food-region'),
        text('span', item.vegetarian ? 'Vegetarian' : 'Includes meat, egg or fish', `badge ${item.vegetarian ? 'veg' : 'nonveg'}`)
      );
      const heading = text('h3', item.name);
      const origin = text('p', item.origin, 'food-origin');
      const description = text('p', item.description, 'food-description');
      const actions = text('div', '', 'order-product-actions');
      actions.append(text('span', money(item.price), 'order-product-price'));
      const add = text('button', 'Add to basket +', 'button');
      add.type = 'button';
      add.dataset.addItem = item.id;
      actions.append(add);
      body.append(meta, heading, origin, description, actions);
      card.append(image, body);
      products.append(card);
    });
    document.getElementById('menu-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'dish' : 'dishes'}`;
    document.getElementById('order-empty').hidden = filtered.length !== 0;
    document.getElementById('menu-status').textContent = items.length
      ? storageWarning
      : 'The dish catalog could not be loaded. Refresh the page or check that js/order-data.js is present.';
  }

  function startMenu() {
    ['order-search', 'order-region', 'order-category', 'order-vegetarian'].forEach(id => {
      document.getElementById(id).addEventListener('input', renderMenu);
      document.getElementById(id).addEventListener('change', renderMenu);
    });
    document.getElementById('order-products').addEventListener('click', event => {
      const button = event.target.closest('[data-add-item]');
      if (!button) return;
      const item = itemById.get(button.dataset.addItem);
      if (!item) {
        updateCartStatus('That dish could not be found in the menu. Refresh and try again.');
        return;
      }
      if (!Object.keys(cart.items).length) setDiscount();
      cart.items[item.id] = Math.min(99, (cart.items[item.id] || 0) + 1);
      saveCart();
      renderCart();
      updateCartStatus(`${item.name} added to your demo basket.`);
    });
    document.getElementById('basket-items').addEventListener('click', event => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const quantity = cart.items[button.dataset.id] || 0;
      if (button.dataset.action === 'increase') changeQuantity(button.dataset.id, quantity + 1);
      if (button.dataset.action === 'decrease') changeQuantity(button.dataset.id, quantity - 1);
      if (button.dataset.action === 'remove') changeQuantity(button.dataset.id, 0);
    });
    document.getElementById('basket-items').addEventListener('change', event => {
      const input = event.target.closest('[data-quantity-for]');
      if (!input) return;
      const quantity = Number(input.value);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        input.value = String(cart.items[input.dataset.quantityFor] || 1);
        updateCartStatus('Choose a whole-number quantity from 1 to 99.');
        return;
      }
      changeQuantity(input.dataset.quantityFor, quantity);
    });
    document.getElementById('checkout-link').addEventListener('click', event => {
      if (!Object.keys(cart.items).length) event.preventDefault();
    });
    renderMenu();
    renderCart();
  }

  function renderCheckout() {
    const list = document.getElementById('checkout-items');
    const lines = cartLines();
    list.replaceChildren();
    document.getElementById('checkout-empty').hidden = lines.length > 0;
    document.getElementById('checkout-totals').hidden = lines.length === 0;
    document.getElementById('checkout-promo').hidden = lines.length === 0;
    document.getElementById('checkout-form').querySelectorAll('input, textarea, button').forEach(field => {
      field.disabled = lines.length === 0;
    });
    lines.forEach(({item, quantity}) => {
      const row = text('li', '', 'checkout-line');
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = '';
      const details = text('div', '');
      const top = text('div', '', 'checkout-line-top');
      top.append(text('h3', item.name), text('span', money(item.price * quantity), 'checkout-line-price'));
      details.append(top, text('p', `${quantity} × ${money(item.price)} · ${regionNames[item.region]} · ${categoryNames[item.category]}`, 'checkout-line-detail'));
      row.append(image, details);
      list.append(row);
    });
    renderTotals(document.getElementById('checkout-totals'));
    document.getElementById('checkout-promo').textContent = lines.length
      ? `Random ${cart.discountPercent}% discount applied · ${cart.promoCode}`
      : '';
    document.getElementById('checkout-status').textContent = storageWarning;
    document.getElementById('place-order').disabled = lines.length === 0 || Boolean(storageWarning);
  }

  function startCheckout() {
    renderCheckout();
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const lines = cartLines();
      if (!lines.length) {
        document.getElementById('checkout-status').textContent = 'Your basket is empty. Add dishes before placing a demo order.';
        renderCheckout();
        return;
      }
      if (storageWarning) {
        document.getElementById('checkout-status').textContent = storageWarning;
        return;
      }
      const values = new FormData(form);
      const order = {
        reference: `FW-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        placedAt: new Date().toISOString(),
        customer: {
          name: String(values.get('name')).trim(),
          phone: String(values.get('phone')).trim(),
          address: String(values.get('address')).trim(),
          notes: String(values.get('notes')).trim()
        },
        items: lines.map(({item, quantity}) => ({id: item.id, quantity})),
        discountPercent: cart.discountPercent,
        promoCode: cart.promoCode,
        totals: totals()
      };
      try {
        localStorage.setItem(orderKey, JSON.stringify(order));
      } catch (error) {
        document.getElementById('checkout-status').textContent = 'Browser storage could not save this demo order. Nothing was placed; check your browser storage settings and try again.';
        return;
      }
      try {
        localStorage.removeItem(cartKey);
      } catch (error) {
        document.getElementById('checkout-status').textContent = 'The demo receipt was saved, but the basket could not be cleared from browser storage.';
      }
      window.location.assign('order-confirmation.html');
    });
  }

  function startReceipt() {
    const empty = document.getElementById('receipt-empty');
    const receipt = document.getElementById('receipt-card');
    let order;
    try {
      order = JSON.parse(localStorage.getItem(orderKey) || 'null');
    } catch (error) {
      empty.hidden = false;
      empty.querySelector('p').textContent = 'Browser storage could not load the saved receipt. It may be unavailable in this browser.';
      return;
    }
    if (!order || typeof order !== 'object' || !Array.isArray(order.items) || !order.customer) {
      empty.hidden = false;
      return;
    }
    const lines = order.items
      .filter(line => line && itemById.has(line.id) && Number.isInteger(line.quantity) && line.quantity > 0)
      .map(line => ({item: itemById.get(line.id), quantity: line.quantity}));
    if (!lines.length) {
      empty.hidden = false;
      return;
    }
    receipt.hidden = false;
    document.getElementById('receipt-order-number').textContent = `Order ${order.reference}`;
    const date = new Date(order.placedAt);
    document.getElementById('receipt-date').textContent = Number.isNaN(date.getTime())
      ? 'Saved in this browser'
      : `Created ${date.toLocaleString()}`;
    document.getElementById('receipt-customer-name').textContent = order.customer.name || '';
    document.getElementById('receipt-customer-phone').textContent = order.customer.phone || '';
    document.getElementById('receipt-customer-address').textContent = order.customer.address || '';
    const notes = document.getElementById('receipt-customer-notes');
    notes.textContent = order.customer.notes ? `Notes: ${order.customer.notes}` : '';
    notes.hidden = !order.customer.notes;
    const list = document.getElementById('receipt-items');
    list.replaceChildren();
    lines.forEach(({item, quantity}) => {
      const row = text('li', '', 'checkout-line');
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = '';
      const details = text('div', '');
      const top = text('div', '', 'checkout-line-top');
      top.append(text('h3', item.name), text('span', money(item.price * quantity), 'checkout-line-price'));
      details.append(top, text('p', `${quantity} × ${money(item.price)}`, 'checkout-line-detail'));
      row.append(image, details);
      list.append(row);
    });
    const receiptCart = cart;
    cart = {
      items: Object.fromEntries(lines.map(({item, quantity}) => [item.id, quantity])),
      discountPercent: discountOptions.includes(order.discountPercent) ? order.discountPercent : 0,
      promoCode: typeof order.promoCode === 'string' ? order.promoCode : ''
    };
    renderTotals(document.getElementById('receipt-totals'));
    document.getElementById('receipt-promo').textContent = cart.discountPercent
      ? `Random ${cart.discountPercent}% discount · ${cart.promoCode}`
      : '';
    cart = receiptCart;
  }

  if (page === 'menu') startMenu();
  if (page === 'checkout') startCheckout();
  if (page === 'receipt') startReceipt();
})();
