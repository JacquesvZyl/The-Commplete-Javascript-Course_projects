'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

const message = document.createElement('div');
message.classList.add('cookie-message');
//message.innerText = "We use cookies for imporved functionality and analytics."
message.innerHTML =
  'We use cookies for imporved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

document.querySelector('.header').append(message);

document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();
});

// Styles
message.style.backgroundColor = '#37383d';
message.style.height = `${parseFloat(getComputedStyle(message).height) + 40}px`;

btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Nav
/* document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    
  });
}); */

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  console.log(e.target);
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//// TABBED COMPONENTS - MY SOLUTIION /////

function removeClass(elementClassname, classNameToRemove) {
  document
    .querySelectorAll(`.${elementClassname}`)
    .forEach(el => el.classList.remove(classNameToRemove));
}

/* function returnElement(index, elementClassname) {
  return [...document.querySelectorAll(`.${elementClassname}`)][index - 1];
} */
/* document.addEventListener('click', e => {
  if (e.target.closest('.operations__tab')) {
    const btn = e.target.closest('.operations__tab');
    const blurb = returnElement(
      btn.getAttribute('data-tab'),
      'operations__content'
    );
    removeClass('operations__tab', 'operations__tab--active');
    removeClass('operations__content', 'operations__content--active');
    btn.classList.add('operations__tab--active');
    blurb.classList.add('operations__content--active');
  }
});
 */

//// TABBED COMPONENT - JONAS SOLUTOIN ////
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', e => {
  if (e.target.closest('.operations__tab')) {
    const btn = e.target.closest('.operations__tab');
    removeClass('operations__tab', 'operations__tab--active');
    btn.classList.add('operations__tab--active');
    removeClass('operations__content', 'operations__content--active');
    document
      .querySelector(`.operations__content--${btn.dataset.tab}`)
      .classList.add('operations__content--active');
  }
});
