// import images as relative image path won't work with vite/vercel.
import check from '../assets/check.svg';
import star from '../assets/star.svg';
import sushi12 from '../assets/sushi-12.png';
import sushi11 from '../assets/sushi-11.png';
import sushi10 from '../assets/sushi-10.png';
import sushi4 from '../assets/sushi-4.png';
import sushi9 from '../assets/sushi-9.png';
import sushi8 from '../assets/sushi-8.png';
import sushi7 from '../assets/sushi-7.png';
import dumplings from '../assets/dumplings.svg';

import AOS from 'aos';
import 'aos/dist/aos.css';

// init AOS animation
AOS.init({
  duration: 500,
  offset: 100,
});

const mobileMenuToggle = document.querySelector('.header__menu-toggle');
const mobileNavigation = document.querySelector('.header__mobile-navigation');

// Focus trap for mobile menu
function getFocusableElements(container) {
  return container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
}

function trapFocus(e, focusableElements) {
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
}

function openMobileMenu() {
  mobileNavigation.hidden = false;
  mobileNavigation.setAttribute('aria-hidden', 'false');
  const focusableElements = getFocusableElements(mobileNavigation);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
  document.addEventListener('keydown', handleMobileMenuKeydown);
}

function closeMobileMenu() {
  mobileNavigation.hidden = true;
  mobileNavigation.setAttribute('aria-hidden', 'true');
  mobileMenuToggle.focus();
  document.removeEventListener('keydown', handleMobileMenuKeydown);
}

const handleMobileMenuKeydown = (e) => {
  if (e.key === 'Escape') {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', 'Open navigation menu');
    closeMobileMenu();
  } else {
    const focusableElements = getFocusableElements(mobileNavigation);
    trapFocus(e, focusableElements);
  }
};

mobileMenuToggle.addEventListener('click', () => {
  const isOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
  mobileMenuToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

mobileNavigation.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', 'Open navigation menu');
    closeMobileMenu();
  }
});

const trendingSushis = [
  'Make Sushi',
  'Nigiri Sushi',
  'Oshizushi',
  'Temaki Sushi',
  'Uramaki Sushi',
  'Inari Sushi',
];

const trendingDrinks = [
  'Oruncha',
  'Ofukucha',
  'Sakura Tea',
  'Kombu-cha',
  'Aojiru',
  'Mugicha',
];

const menuItems = [
  ['sushi', 'Chezu Sushi', 21, '4.9', sushi12], ['sushi', 'Original Sushi', 19, '5.0', sushi11], ['sushi', 'Salmon Nigiri', 18, '4.8', sushi9],
  ['ramen', 'Ramen Legendo', 13, '4.7', sushi10], ['ramen', 'Miso Ramen', 15, '4.8', sushi8], ['ramen', 'Tonkotsu Ramen', 17, '4.9', sushi10],
  ['udon', 'Vegetable Udon', 14, '4.7', sushi7], ['udon', 'Tempura Udon', 16, '4.8', sushi7], ['udon', 'Kitsune Udon', 13, '4.6', sushi7],
  ['other', 'Edamame', 6, '4.7', sushi9], ['other', 'Dumplings', 10, '4.8', dumplings], ['other', 'Miso Soup', 5, '4.6', sushi9],
  ['drinks', 'Sakura Tea', 5, '4.8', sushi4], ['drinks', 'Oruncha', 5, '4.7', sushi4], ['drinks', 'Aojiru', 6, '4.6', sushi4],
].map(([category, name, price, rating, image]) => ({ category, name, price, rating, image }));

const catalogue = document.querySelector('.popular-foods__catalogue');
const filterButtons = document.querySelectorAll('.popular-foods__filter-btn');

function renderMenu(category) {
  const items = category === 'all'
    ? menuItems.filter((item) => ['Chezu Sushi', 'Original Sushi', 'Ramen Legendo'].includes(item.name))
    : menuItems.filter((item) => item.category === category);
  catalogue.innerHTML = items.map((item) => `
    <article class="popular-foods__card" data-item-name="${item.name}" data-item-price="${item.price}">
      <img class="popular-foods__card-image" src="${item.image}" alt="${item.name}" />
      <h4 class="popular-foods__card-title">${item.name}</h4>
      <div class="popular-foods__card-details flex-between"><div class="popular-foods__card-rating"><img src="${star}" alt="" /><p>${item.rating}</p></div><p class="popular-foods__card-price">$${item.price.toFixed(2)}</p></div>
      <button class="popular-foods__order-button" type="button">Add to Order</button>
    </article>`).join('');
}

filterButtons.forEach((button) => button.addEventListener('click', () => {
  filterButtons.forEach((filterButton) => filterButton.classList.remove('active'));
  button.classList.add('active');
  renderMenu(button.dataset.category);
}));

renderMenu('all');

const orderDialog = document.querySelector('.order-dialog');
const orderForm = document.querySelector('.order-dialog__panel');
const orderClose = document.querySelector('.order-dialog__close');
const itemImage = document.querySelector('.order-item__image');
const itemName = document.querySelector('.order-item__name');
const itemPrice = document.querySelector('.order-item__price');
const total = document.querySelector('.order-total');
const quantityValue = document.querySelector('.quantity-control__value');
const cardMethod = document.querySelector('input[value="card"]');
const bankMethod = document.querySelector('input[value="bank"]');
const plaidConnect = document.querySelector('.plaid-connect');
const squarePayment = document.querySelector('.square-payment');
const squareConnect = document.querySelector('.square-connect');
const paymentMessage = document.querySelector('.payment-message');

let currentOrder = { name: 'Original Sushi', price: 19, image: sushi11, quantity: 1 };
let squareCard;

orderClose.addEventListener('click', () => orderDialog.close());

function updateOrderSummary() {
  const orderTotal = currentOrder.price * currentOrder.quantity;
  itemImage.src = currentOrder.image;
  itemImage.alt = currentOrder.name;
  itemName.textContent = currentOrder.name;
  itemPrice.textContent = `$${currentOrder.price.toFixed(2)} each`;
  quantityValue.textContent = currentOrder.quantity;
  total.textContent = `$${orderTotal.toFixed(2)}`;
}

function openOrder(item = currentOrder) {
  currentOrder = { ...item, quantity: 1 };
  updateOrderSummary();
  updatePaymentMethod();
  orderDialog.showModal();
}

document.querySelector('.hero-content__order-button').addEventListener('click', () => openOrder());

catalogue.addEventListener('click', (event) => {
  const button = event.target.closest('.popular-foods__order-button');
  if (button) {
    const card = button.closest('.popular-foods__card');
    openOrder({
      name: card.dataset.itemName,
      price: Number(card.dataset.itemPrice),
      image: card.querySelector('.popular-foods__card-image').src,
    });
  }
});

document.querySelectorAll('[data-quantity-change]').forEach((button) => {
  button.addEventListener('click', () => {
    currentOrder.quantity = Math.max(1, currentOrder.quantity + Number(button.dataset.quantityChange));
    updateOrderSummary();
  });
});

function updatePaymentMethod() {
  plaidConnect.hidden = !bankMethod.checked;
  squarePayment.hidden = !cardMethod.checked;
  paymentMessage.textContent = '';
}

bankMethod.addEventListener('change', updatePaymentMethod);
cardMethod.addEventListener('change', updatePaymentMethod);

plaidConnect.addEventListener('click', () => {
  const linkToken = window.PLAID_LINK_TOKEN;
  if (!linkToken || !window.Plaid) {
    paymentMessage.textContent = 'Bank connection is not configured yet. Add PLAID_LINK_TOKEN to enable Plaid Link.';
    return;
  }

  window.Plaid.create({
    token: linkToken,
    onSuccess: (publicToken) => {
      paymentMessage.textContent = 'Bank account connected.';
      plaidConnect.dataset.publicToken = publicToken;
    },
  }).open();
});

squareConnect.addEventListener('click', async () => {
  const applicationId = window.SQUARE_APPLICATION_ID;
  const locationId = window.SQUARE_LOCATION_ID;
  if (!applicationId || !locationId || !window.Square) {
    paymentMessage.textContent = 'Square is not configured yet. Add SQUARE_APPLICATION_ID and SQUARE_LOCATION_ID to enable card payments.';
    return;
  }

  try {
    if (!squareCard) {
      const payments = window.Square.payments(applicationId, locationId);
      squareCard = await payments.card();
      await squareCard.attach('#square-card-container');
    }
    const result = await squareCard.tokenize();
    if (result.status !== 'OK') throw new Error('Card verification failed.');
    squareConnect.dataset.token = result.token;
    paymentMessage.textContent = 'Card verified with Square.';
  } catch (error) {
    paymentMessage.textContent = error.message || 'Unable to verify this card.';
  }
});

// Toast notification system for better UX feedback
function createToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('toast--visible'), 10);
  
  // Remove toast after duration
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Add toast styles if not already in CSS
if (!document.getElementById('toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 8px;
      font-family: var(--plus-jakarta-sans);
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .toast--visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .toast--info {
      background: var(--primary-color);
      color: white;
    }
    
    .toast--success {
      background: #28a745;
      color: white;
    }
    
    .toast--error {
      background: #dc3545;
      color: white;
    }
    
    .toast--warning {
      background: #ffc107;
      color: #333;
    }
    
    @media (max-width: 640px) {
      .toast {
        left: 20px;
        right: 20px;
        max-width: none;
      }
    }
  `;
  document.head.appendChild(style);
}

orderForm.addEventListener('submit', (event) => {
  if (event.submitter?.value !== 'submit') return;
  event.preventDefault();
  if (bankMethod.checked && !plaidConnect.dataset.publicToken) {
    paymentMessage.textContent = 'Connect your bank account with Plaid before placing the order.';
    return;
  }
  if (cardMethod.checked && !squareConnect.dataset.token) {
    paymentMessage.textContent = 'Secure your card with Square before placing the order.';
    return;
  }
  orderDialog.close();
  orderForm.reset();
  plaidConnect.hidden = true;
  plaidConnect.dataset.publicToken = '';
  squareConnect.dataset.token = '';
  createToast('Your order has been received.', 'success', 4000);
});
