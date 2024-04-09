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
      activateDot(slide)
    }
  });
};
slider();

console.log(document.documentElement); 
// Selecting the head tag of any web page
console.log(document.head);
// Selecting the entire body tage of any web page
console.log(document.body);

const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

// Selecting all the element that has a className of btn
console.log(document.getElementsByClassName('btn'));
``


  const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
  // To generate ranndom colors => rgb(155,230,255)
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

  var h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
// to get all the childNodes inside the h1 i.e(text, br, comment, span.highlight)
console.log(h1.childNodes);
// to get the children inside the h1 element i.e(span.highlight, br and span.highlight)
console.log(h1.children);

console.log(h1.parentNode);
console.log(h1.parentElement);
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling); // Get the next siblings element of the h1 element

console.log(h1.previousSibling);
// Get the siblings of the h1 element
console.log(h1.nextSibling);

// Get the children of h1 parent element
console.log(h1.parentElement.children);

const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

const obsCallback = function (entries, observer) {
  // obsCallback function get triggered each time the target element moves completely in and out (0) of the view and also when it intersect viewport at 0.2(20%)
    entries.forEach(entry => {
      console.log(entry);
    });
  };
  
  // obsOptions object has a root property and the root is the element that the target is intercepting
  const obsOptions = {
    root: null,
  // threshold is the percentage of intersection which the observer callback would be called
    threshold: [0, 0.2],
  };
  
  const accounts = [100, 4334, 800, 45489, 3500, 5400]
  
// 1. To calcualte how much has been deposited in total in the all the accounts across the bank
const bankDepositSum = accounts
.flatMap(acct => acct.movements)
.filter(mov => mov > 0)
.reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositSum);

// 2. To count how many deposits have been in the bank with at least #1000
const numDeposits1000 = accounts
.flatMap(acct => acct.movements)
.filter(mov => mov >= 1000).length

console.log(numDeposits1000);
             // OR Using Array reduce
const myDeposits1000 = accounts
.flatMap(acct => acct.movements)
// The count is the number of movements that are greater than #1000 
.reduce((count, cur) => (cur >= 1000 ? ++count // ++count => counts values >= 1000 and returns it
  : count), 0);

  console.log(myDeposits1000);

// prefixed ++ operator
let a = 10;
console.log(++a);
console.log(a);


// 3. Create an object in an array for deposits and withdrawals using Array reduce method
const { deposits, withdrawals } = accounts
.flatMap(acct => acct.movements)
.reduce(
  (sums, cur) => {
    cur > 0 ? (sums.deposits += cur) 
    : (sums.withdrawals += cur);
        // OR Using the Bracket Notation  
    // sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur
     return sums;
  },
  { deposits: 0, withdrawals: 0}
  );
  console.log(deposits, withdrawals);

// 4. Create a single function to convert any string into title case(i.e all words are in capitalize form except some of them)
// Converting from 'this is a nice title' to 'This Is a Nice Title'
const convertTitleCase = function (title) {
// Change all the first index (0)of each string to uppercase and copying all the second index(1) in each string by concatenating (+) it
  const capitalize = (str) => str[0].toUpperCase()
  + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but',
  'or', 'on', 'in', 'with'];

  const titleCase = title
  .toLowerCase()
  .split(' ')
// if the current word is included in the exception array return that word(From the exception array) and join all array into a single string else change all the first index (0)of each word to uppercase and copying all the second index(1) in each word by concatenating (+) it and join all array into a single string
  .map(word => (exceptions.includes(word) ? word
  : capitalize(word)))
  .join(' ')

  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

const number = 3884764.23;
// three different styling in options objects ("unit", "percent" and "currency");
const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'NGN',
  // useGrouping: false, => not to group the numbers with a comma(,)
};

console.log('NG:      ', new Intl.NumberFormat('en-NG', options).format(number));
console.log('US:      ', new Intl.NumberFormat('en-US', options).format(number));
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(number));
console.log('Syria:   ', new Intl.NumberFormat('ar-SY', options).format(number));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(number)
);

const now = new Date();
console.log(now);
// 2.
console.log(new Date('Aug 02 2020 18:05:41'));
console.log(new Date('December 24, 2015'));

// 3. Convert year, month, date, hour, seconds
console.log(new Date(2023, 10, 19, 15, 23, 5));
console.log(new Date(2023, 10, 31));

// To get the first day stored in javascript
console.log(new Date(0));
// Converting days to milliseconds i.e after 3 days
console.log(new Date(3 * 24 * 60 * 60 * 1000));


// 4. Working with dates
const future = new Date(2023, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
const myFuture = new Date(2023, 10, 19, 15, 23); // To get the timestamp of this current date to number in milliseconds
console.log(+myFuture);

// Create a functions that takes in two dates and parse the number of dates that passed between the two days
const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24); // Converting timestamp from milliseconds to  minutes, hour, and day

const days1 = calcDaysPassed(new Date(2023, 3, 4), 
new Date(2023, 3, 14));
console.log(days1); // 10 days