'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//ForEach Loop
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

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

///////////////////////////////////////////////////////////////////////////////////////////////////////
//EVENT PROPAGATION IN PRACTICE
/* 
//rgba(255, 255, 255, 1)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document
  .querySelector('.nav__link')
  .addEventListener('click', function (event) {
    console.log('LINK', event.target);
    this.style.backgroundColor = randomColor();
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
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////
//Event Delegation: Implemnting Page navigation
/* */

// Page navigation
// document.querySelectorAll('.nav__link').forEach(function (ele) {
//   ele.addEventListener('click', function (event) {
//     event.preventDefault();
//     // console.log('LINK');
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

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

///////////////////////////////////////////////////////////////////////////////////////////////////////
//DOM TRAVERSING
/* 
const h1 = document.querySelector('h1');

//Going downwards: Selecting child elements
//Doing elements with query selecter as it can get elements also
//Selects all the elements that are children of the h1 highlight class
console.log(h1.querySelectorAll('.highlight'));
//Sometimes we need Direct Children, so we use ".childNodes" for that approach
//Nodes can be text comments, elements, anything.
console.log(h1.childNodes);
//HTML Collection, which gets updated.
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//Going upwards: Parents
console.log(h1.parentNode);
console.log(h1.parentElement);
//Might need to find a parent no matter how far it is on the dom tree.
//  so we use the closest() method, gets a query string like query selector/all
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';
//QUeryselector finds children, while closest() method finds parents.

//Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);
//If we need all the children, not just next and previous, we can do a trick
//  where we just get the parent from them to access all children
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (element) {
  if (element !== h1) element.style.transform = 'scale(0.5)';
});
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////
//Building a Tabbed Component
/* */

//Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//Ineffient
// tabs.forEach(tab => tab.addEventListener('click', () => console.log('TAB');
// ))

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

///////////////////////////////////////////////////////////////////////////////////////////////////////
//PASSING ARGUMENTS TO EVENT HANDLERS
/* */

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

//you can log the handleHover(0.1) to see that it returns a function which
//has access to the argument(opacity value) passed to handleHover() due to
//closures

nav.addEventListener('mouseover', handleHover(0.5));
nav.addEventListener('mouseout', handleHover(1));

///////////////////////////////////////////////////////////////////////////////////////////////////////
//IMPLEMENTING A STICKY NAVIGATION: THE SCROLL EVENT
/* 

//Sticky Navigation
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener('scroll', function(event) {
  console.log(window.scrollY)

if(window.scrollY > initialCoords.top) nav.classList.add('sticky')
  else nav.classList.remove("sticky");
})
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////
//A BETTER WAY: THE INTERSECTION OBSERVER API
/* 

//What is the observer API and why is it good.
//IT allows our code to observe changes to the way of a certain target
//element intersect another element or intersects a viewport.

//WIll be called each time that the observed element is intersecting
//the root element at the threshold that we defined.
const ObserverCallback = function (entries, observer) {
  entries.forEach(entry => {
    // console.log(entry);
  });
};

const observerOptions = {
  root: null,
  threshold: [0, 0.2],
};

//So the viewport, because that's the root, and 10% because that's the threshold
//Whenever that happens, this function will get called.
const observer = new IntersectionObserver(ObserverCallback, observerOptions);
observer.observe(section1);
*/
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

///////////////////////////////////////////////////////////////////////////////////////////////////////
//REVEALING ELEMENTS ON SCROLL.
/* */

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

///////////////////////////////////////////////////////////////////////////////////////////////////////
//Loading Lazy images.
/* */

//When building any website, performance is most important. Yet,
//  images have the biggest impant on page loading. So optmizing images
//  on any page is crucial. We use a strategy called Lazy Loading Images.

//We first set to the images as low res, then make it normal res as you scroll.
//We use "data-src" (special data attribute) and "lazy-img" in src attribute.
// lazy-img is simply a blur filter.

//Lazy loading images
//when targeting, we use brackets to narrow down our search
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

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

///////////////////////////////////////////////////////////////////////////////////////////////////////
//Building A Slider Component Part 1 AND 2
/* */

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

///////////////////////////////////////////////////////////////////////////////////////////////////////
//LifeCycle DOM EVENTS
/* */

//Taking a look at different events that occur in the DOM
//  during a webpage's life cycle.

//This event doesn't wait for images and other external resources to load.
document.addEventListener('DOMContentLoaded', function (event) {
  console.log(event, 'HTML parsed and DOM tree built!');
});

window.addEvenetListener('load', function (event) {
  console.log('Page fully loaded', event);
});

//Used when you are about to exit the page, something happens.
// Key example is when you try to exit page, and a prompt comes up
// saying if you are sure that you want to exit.

// window.addEventListener('beforeunload', function (event) {
//   event.preventDefault();
//   console.log(event);
//   event.returnValue = '';
// });

//You were once able to costumized this, but devs/people took advantage of it.
// Try not to abuse it if you use it.

///////////////////////////////////////////////////////////////////////////////////////////////////////
//Efficient Script Loading: defer and async
/* */
