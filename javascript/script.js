'use strict';

//Declarations
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const successBanner = document.querySelector('.success_banner');
const loginFailure = document.querySelector('.login_failure');

window.addEventListener('load', function () {
  history.scrollRestoration = 'manual';
  this.window.scrollTo(0, 0);
});

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

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coord = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});

//EVENT DELEGATION
document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (e.target.classList.contains('sign-up-btn')) {
    return;
  }
  e.preventDefault();

  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Login Verification button.
document.querySelector('.modal__form').addEventListener('submit', function (e) {
  e.preventDefault();

  const modalUsername = document.querySelector('#modal__username');
  const modalPassword = document.querySelector('#modal__password');
  const regexUserTest = /\d/; //regex for digits
  const regexPasswordTest = /[a-zA-Z]/; // regex for letters
  const findAccount = accounts.find(
    account => account.owner === modalUsername.value
  );

  if (
    !regexUserTest.test(modalUsername.value) &&
    !regexPasswordTest.test(modalPassword.value)
  ) {
    if (findAccount && findAccount.pin === Number(modalPassword.value)) {
      console.log('Login Successful');
      closeModal();
      successBanner.style.transform = 'translateY(0)';
      setTimeout(() => {
        successBanner.style.transform = 'translateY(-100%)';
      }, 2000);
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 3000);
      loginFailure.style.display = 'none';
    } else {
      console.log('Login failed! Wrong Username/Password!');
      loginFailure.textContent = 'Login failed! Wrong Username/Password!';
      loginFailure.style.display = 'block';
    }
  } else {
    console.log('Invalid format in Username/Password!');
    loginFailure.textContent = 'Invalid format in Username/Password!';
    loginFailure.style.display = 'block';
  }

  modalUsername.value = '';
  modalPassword.value = '';
});

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//Other Example using Event Delegation
tabsContainer.addEventListener('click', function (event) {
  const clicked = event.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(tabs => tabs.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  clicked.classList.add('operations__tab--active');

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

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//Reveal Sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

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
});

//Slider Component
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
    if (activeDot) activeDot.classList.add('dots__dot--active');
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
