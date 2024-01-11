// closest => This is use to navigate the Dom tree from the target elements until an element that matches the selector passed is found
// Implementing smooth scrolling = To get the current scroll position => Y position is the distance between the current position of the browser viewport and page
// entries is an array of threshold
// threshold is the intersectingRatio : 0 Scrolling up(move in), scrolling down(move out)
// In case of &&(AND) operator, if the first value is a truthy value then it continue to evaluate to the next operands and the return the last value


'use strict';

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

// Modal window

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

// if the event that happens on the key is = to escape and the modal classList does not contain hidden then close the modal
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  // To get all the scrolling properties
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  // To get the coordinates of the element we want to scroll to
  console.log('Current scroll (X/Y)', 
  window.pageXOffset, window.pageYOffset);

   // To get the height and width of a browser  viewport => The height shows the decrement or increment of a page (minimizing or maximazing the screen)
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Modern way of scrollling and the best way
  section1.scrollIntoView({ behavior: 'smooth' });
});


// Page navigation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
   // Get the attribute of the href from the DOM which are the nav__link sections
    const id = e.target.getAttribute('href');
   // Whenever each of the nav__link is clicked scroll into each of the section related to the link clicked
    document.querySelector(id).scrollIntoView({ 
      behavior: 'smooth' });
  }
});

// Tabbed component => Adding event handler to each of the tab btn

tabsContainer.addEventListener('click', function (e) {
// Closest is used to find the closest parent element that matches whatever className parsed in
  const clicked = e.target.closest('.operations__tab');

  // Guard clause => is an if statement that will return early if some condition is matched
  if (!clicked) return;

   // if operation btn is not clicked return null else remove the operation_tab--active from all the btn
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // Remove the operations__content--active from all the btn clicked
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // And add operations__tab--active to only the btn clicked
  clicked.classList.add('operations__tab--active');

   // whenever we click one of the operation btn get the attribute dataset tab and display its content (i.e the data tab in the btn clicked)
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
   //  And add classList of operations__content--active to display the active content of the btn clicked
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e, opacity) {
  // If whatever we mouseover contains a nav__link class then that'e our e.target
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

     // when any of nav link is clicked find a closest parentElement if it matches with .nav  from the img tag selected
    const logo = link.closest('.nav').querySelector('img');
  // Loop through each of the nav link when a link is clicked and if the curr element is not the link clicked style the other link opacity to 'this' (currentTarget = nav)
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// BIND METHOD => This method allows us to create a new function from an existing function, change the new function's this context, and provide any arguments you want the new function to return
 
// when we mouseover the nav, set the opacity to 0.5 using bind method (i.e pointing to 'this' opacity argument itself)
nav.addEventListener('mouseover', handleHover.bind(0.5));
// when we mouseout the nav set the opacity to 1 (default)
nav.addEventListener('mouseout', handleHover.bind(1));
            // OR
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// })
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 1);
// })

// Sticky navigation: Using the Intersection Observer API => it helps our code to be able to observe change in a way that a certain target element intersect another element or the way it intersect the viewport

const header = document.querySelector('.header');
// Get the navHeight
const navHeight = nav.getBoundingClientRect().height;

// The stickyNav function will get called each time the target element is intercecting the root(viewport) at the current threshold define
const stickyNav = function (entries) {
// getting the first entries(threshold) using destructuring array
  const [entry] = entries;

  // if the entry is 0 and not intersecting => when the header is not intersecting the viewport then add the sticky class to nav
  if (!entry.isIntersecting) nav.classList.add('sticky');
  // if the entry is 0 and it is intersecting => when the header is not intersecting the viewport then add the sticky class to nav 
  else nav.classList.remove('sticky');
};

// Create a variable object and set to IntersectionObserver
const headerObserver = new IntersectionObserver
// obsOptions object is the second parameter parsed in and it has a root property and the root is the element that the target is intercepting
(stickyNav, {
  root: null,
  // threshold is the percentage of intersection which the stickyNav would be called
  threshold: 0,
  // rootMargin => This refers to the distance between the start of the section element and the viewport is just the same as the navigation height
  rootMargin: `-${navHeight}px`,
});
 // We want to observe header(target element)
headerObserver.observe(header);

// Reveal sections: Using the Intersection Observer API

const allSections = document.querySelectorAll('.section');
// revealSection function will get called each time the target element is intersecting the root(viewport) at 0.15(15%)
const revealSection = function (entries, observer) {
  const [entry] = entries;

  // if the entry is 0.15 and it is not intersecting remove section-hidden 
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  // To unobserve the each of the entry(threshold) section
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

// Lazy loading images: Using the Intersection Observer API

// Selecting all the images that has the property of data-src
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
   // Replace src(original img) with data-src(lazy-img)
  entry.target.src = entry.target.dataset.src;

   // When the entry of the current img finish loading , then remove the class of lazy-img
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  // To unobserve the each of the entry(threshold) image
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
// To make the naviagtion load before the threshold(intersectingRatio) is reached (start loading images exactly 200px before any of the images is loaded)
  rootMargin: '200px',
});
// Loop through each of the imgTargets and observe each images
imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  // Create a new variable for the current slide(starting at 0%)
  let curSlide = 0;
  // To make the number of slides stop when we reach the last one
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
// To attach the HTML code into the dot element container (UI) => beforeend occurs when we are inserting a new child element at the end of a parent element
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // Create an active dot whenever the slide is changed
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

 // Selecting from the .dots__dot and check for the one that has the property of current data-slide
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // One's our app start our curSlide will be 0
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
  // when the btnRight is clicked and if the curSlide = maxSlides -1 i.e(2), then set the curslide back to 0
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++; // increase the curSlide by 1
    }

    goToSlide(curSlide);
     // activateDot on curSlide
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--; // decrease the curSlide by 1
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
   // goToSlide first slide when we load the page 
    goToSlide(0);

    createDots();
  // activateDot on first slide when we reload the page
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
     // const slide = e.target.dataset.slide
   // OR  Using destructuring object => getting our slide from the current dataset
      const { slide } = e.target.dataset;

      // goToSlide from the slide number we got from the dataset
      goToSlide(slide);
      // activateDot when we click on one of the dot in the container
      activateDot(slide);
    }
  });
};
slider();