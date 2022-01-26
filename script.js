'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const allButtons = document.getElementsByTagName('button');
const message = document.createElement('div');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Modal Window

const openModal = function () {
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
// Smooth scrolling

btnScrollTo.addEventListener('click', e => {
  e.preventDefault();

  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll(X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // scrolling
  section1.scrollIntoView({ behavior: 'smooth' });

  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: 'smooth',
  // });
});

// 1. add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching stratagey
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Cookies section
const showCookiesMessage = function () {
  let cookiesAccepted = localStorage.getItem('bankistCookiesAccepted');

  if (cookiesAccepted) {
    console.log('cookies accepted');
  } else {
    message.classList.add('cookie-message');
    message.textContent =
      'We use cookies for improved functionality and analytics.';
    message.innerHTML =
      'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
    header.append(message);
    message.style.backgroundColor = '#37383d';
    message.style.width = '120%';
  }
};
showCookiesMessage();

document.querySelector('.btn--close-cookie')?.addEventListener('click', () => {
  message.remove();
  localStorage.setItem('bankistCookiesAccepted', true);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  e.preventDefault();

  // Guard clause
  if (!clicked) return;

  // active tabs
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Activate content area
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Sticky Navigation

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting == true) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Reveal Sections

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src attribute with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.1,
  rootMargin: '100px',
});

imgTargets.forEach(img => imgObserver.observe(img));

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Content slider
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `
    <button class="dots__dot dots__dot--active" data-slide="${i}"></button>
    `
    );
  });
};
createDots();

const activateDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  const value = function (slide) {
    return document.querySelector(`.dots__dot[data-slide="${slide}"]`);
  };
  let i = value(slide);
  console.log(i);
  i.classList.add('dots__dot--active');
};
activateDots(0);

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
goToSlide(0);

// next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDots(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else curSlide--;
  goToSlide(curSlide);
  activateDots(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    curSlide = +e.target.dataset.slide;
    goToSlide(curSlide);
    activateDots(e.target.dataset.slide);
  }
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Lectures

/*


// document.getElementById('section-1');

// header.prepend(message);

// header.append(message.cloneNode(true));
// header.before(message);
// header.after(message);

// Delete elements

// Styles

// message.style.position = 'absolute';
// message.style.bottom = '0';


// selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);
// console.log(allSections);

*/

/*
console.log(message.style.color);
console.log(message.style.backgroundColor);
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 24 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes

const logo = document.querySelector('.nav__logo');

console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

// data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c');

// dont use (overwrites and only 1 class)
// logo.className = 'jonas';




const h1 = document.querySelector('h1');

// hover

const alertH1 = function (e) {
  alert('addEventListener: Great');

  h1.removeEventListener('mouseenter', alertH1);
};

// better because you can add multiple event listeners to same event
// can be removed
h1.addEventListener('mouseenter', alertH1);

// h1.onmouseenter = e => {
//   alert('addEventListener: Great');
// };


// Event propogation
// random color
// rgb(255,255,255)

const ramdomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
console.log(ramdomInt(0, 255));

const randomColor = () =>
  `rgb(${ramdomInt(0, 255)},${ramdomInt(0, 255)},${ramdomInt(0, 255)})`;

console.log(randomColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  e.preventDefault();
  this.style.backgroundColor = randomColor(0, 255);
  console.log('link', e.target, e.currentTarget);

  // stop event propogation
  e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor(0, 255);
    console.log('links', e.target, e.currentTarget);
  },
  false
);

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor(0, 255);
    console.log('nav', e.target, e.currentTarget);
  },
  true
);
// true makes it the first one to happen
// false ignores bubbling events



// DOM traversing

const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'orangered';
h1.lastElementChild.style.color = 'white';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

// intersection observer and stick navigation

// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });

// Sticky Navigation: Intersection observer API
// const observerCallback = function (entries, observer) {
//   entries.forEach(function (entry) {
//     console.log(entry);
//     if (entry.isIntersecting == true) {
//       nav.classList.add('sticky');
//     } else nav.classList.remove('sticky');
//   });
// };

// const observerOptions = {
//   root: null, // root
//   threshold: [0, 0.2], // 10% threshold
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1);
