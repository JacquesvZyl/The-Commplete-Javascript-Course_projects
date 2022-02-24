'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const lazyImages = document.querySelectorAll('img[data-src]');

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

// menu fade animation

function handleHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Intersection obersever API

function navSticky(entries) {
  const [entry] = entries;
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
}

const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(navSticky, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//Reveal sections
const allSections = document.querySelectorAll('.section');
function revealSection(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
function loadLazyImg(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}

const lazyImgObserver = new IntersectionObserver(loadLazyImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

lazyImages.forEach(img => lazyImgObserver.observe(img));
