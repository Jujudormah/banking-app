'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

//Sign-Up/Login Overlay popup
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

//Sign-Up/Login Overlay Close popup
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//ForEach Loop
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

//Event to close Overlay
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Old fashion way
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coord = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});

document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    console.log('LINK');
    this.style.backgroundColor = randomColor();
  });

document.querySelector('.nav').addEventListener('click', function (event) {
  console.log('LINK');
});

//EVENT DELEGATION
// 1. Add event listener to the common parent element
// 2. determine what element originated the event.
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//Other Example using Event Delegation
tabsContainer.addEventListener('click', function (event) {
  const clicked = event.target.closest('.operations__tab');
  console.log(clicked);
  // Guard clause: Some condition that will return early if some condition is matched.
  if (!clicked) return;

  //Remove Active Classes
  tabs.forEach(tabs => tabs.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  //Activate Tab
  clicked.classList.add('operations__tab--active');

  // Activate content Area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade Animation
const nav = document.querySelector('.nav');
const handleHover = function (opacity) {
  return function (event) {
    if (event.target.classList.contains('nav__link')) {
      const link = event.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');

      siblings.forEach(element => {
        if (element !== link) element.style.opacity = opacity;
      });
      logo.style.opacity = opacity;
    }
  };
};

nav.addEventListener('mouseover', handleHover(0.5));
nav.addEventListener('mouseout', handleHover(1));

//WHen do we want our sticky, basically when the header is no longer in view.
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//REVEAL SECTIONS]
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // entries.forEach(entry => {
  // });
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threashold: 0.2,
  rootMargin: `-${navHeight}px`,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//Lazy loading images
//when targeting, we use brackets to narrow down our search
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  // entry.target.src = entry.target.dataset.src;

  // When image is loaded, remove blur or add loaded class
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img'); // or whatever class you're using
  });

  // Stop observing the image, we do this for optimizing performance.
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//PART 1 and 2 Are together in one section, if not, you will get errors in code.
//Try to implement slider function AND dot slider function as the same time.
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  const goToSlide = function (slideIndex) {
    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${100 * (index - slideIndex)}%)`)
    );
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    const activeDot = document.querySelector(
      `.dots__dot[data-slide="${slide}"]`
    );
    if (activeDot) activeDot.classList.add('dots__dot--active'); // optional safety check
  };

  const nextSlide = function () {
    curSlide = curSlide === maxSlide - 1 ? 0 : curSlide + 1;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    curSlide = curSlide === 0 ? maxSlide - 1 : curSlide - 1;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const createDots = function () {
    slides.forEach(function (_, index) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide="${index}"></button>`
      );
    });
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activateDot(0);
  };
  init();

  // Event listeners
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') prevSlide();
    if (event.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('dots__dot')) {
      curSlide = Number(event.target.dataset.slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
};
slider();

//This event doesn't wait for images and other external resources to load.
document.addEventListener('DOMContentLoaded', function (event) {
  console.log(event, 'HTML parsed and DOM tree built!');
});

window.addEventListener('load', function (event) {
  console.log('Page fully loaded', event);
});
