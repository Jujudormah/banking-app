'use strict';

//Declarations
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogo = document.querySelector('.logo');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

btnLogo.addEventListener('click', function (event) {
  window.location.href = 'landing.html';
});

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(movementDate);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(movement, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 180;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//Experiementing API
// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//    day: 'numeric',
//    month: 'long',
//    year: 'numeric
// }

// const locale = navigator.language;
// labelDate.textContent = new Intl.DateTimeFormat('en-GB').format(now);

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // BUG in video:
  // displayMovements(currentAccount.movements, !sorted);

  // FIX:
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//////////////////////////////////////////////////////////////////////////////////////////////////
//CONVERTING AND CHECKING NumberS
/*
console.log(23 === 23.0);
// Base 10 - 0 to 9. 1/10 = 0.1. 3/10 = 3.333333
// Binary base 2 - 0.1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

//Conversion
console.log(Number('23'));
console.log(+'23');

//Parsing
console.log(Number.parseInt('30px'));

//NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
*/
/**/
//////////////////////////////////////////////////////////////////////////////////////////////////
//MATH AND ROUNDING
/* 
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max(5, 4, 3, 7, 8, 9));
console.log(Math.max(5, 4, '23', 7, 8, 9));
console.log(Math.max(5, 4, '23px', 7, 8, 9));

console.log(Math.min(5, 4, 3, 7, 8, 9));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

//Rounding
let randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
console.log(randomInt(10, 20));
randomInt(0, 3);


//Rounding Integers
console.log(Math.round(23.3));
console.log(Math.round(23.9));

//Rouding up
console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

//Rounding Down
console.log(Math.floor(23.3));
console.log(Math.floor('23.9'));

//Removes without rounding (only positive numbers)
console.log(Math.trunc(23.3));

//Rounding negative numbers
console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3));

//Rounding decimals
console.log((2.7).toFixed(0));
console.log(+(2.7).toFixed(0));
*/

//////////////////////////////////////////////////////////////////////////////////////////////////
//THE REMAINDER OPERATOR
/*
console.log(5 % 2);
console.log(5 / 2); //5 = 2 * 2 + 1

console.log(8 % 3);
console.log(8 / 3); //8 = 2 * 3 + 2

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

let isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));


labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    console.log(i);
    if (i % 2 === 0) row.style.backgroundColor = 'red';
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

*/
/**/
//////////////////////////////////////////////////////////////////////////////////////////////////
//NUMERIC SEPERATORS
/*

//287,460,000,000
let diameter = 287_460_000_000;
console.log(diameter);

let pi = 3.14_15;
console.log(pi);
*/

//////////////////////////////////////////////////////////////////////////////////////////////////
//WORKING WITH BigInt
/*

console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);

// Operations
console.log(10000n + 10000n);
console.log(36286372637263726376237263726372632n * 10000000n);
// console.log(Math.sqrt(16n));

const huge = 20289830237283728378237n;
const num = 23;
console.log(huge * BigInt(num));

// Exceptions
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == '20');

console.log(huge + ' is REALLY big!!!');

// Divisions
console.log(11n / 3n);
console.log(10 / 3);


let filter = function (arr, fn) {
  const newArray = [];

  for (let i = 0; i < arr.length; i++) {
    if (fn(arr, i) == true) {
      newArray.push(arr[i]);
    }
  }
  console.log(newArray);
};

let fn = function greaterThan10(n) {
  return n > 10;
};


let fibTest = function () {
  let a = 1;
  let b = 2;
  let fibTotal = 0;
  let fibEvenSum = 2;
  while (fibTotal < 4000000) {
    //Fib calculation
    fibTotal = a + b;
    a = b;
    b = fibTotal;

    if (fibTotal % 2 === 0) {
      fibEvenSum += fibTotal;
      console.log(`fibTotal is ${fibTotal}, so even sum is ${fibEvenSum}`);
    }
  }
  console.log(fibTotal, fibEvenSum);
};
fibTest();
*/
//Game plan

// let monthly = 2700;
// // let retire = monthly * 0.12;
// // let bills = 500;
// // let gas = 300;
// let necessities = 300 + 400 + 400 + 1000;
// console.log(necessities);
// let balanceMonthly = monthly - necessities;
// let yearly = balanceMonthly * 12;
// let debt = 8300;
// let afterDebt = balanceMonthly + 1000;

// // console.log(yearly);
// // console.log(total42months);

// // Total of 9 months of 1000 each to pay off debt
// // for (let month = 0; debt > 0; month++) {
// //   debt -= 1000;
// //   console.log(`Month ${months[month]}, and the debt is now $${debt}`);
// // }
// console.log(
//   `Monthly left is ${balanceMonthly} for 9 months, then ${afterDebt} after debt is gone.`
// );

//////////////////////////////////////////////////////////////////////////////////////////////////
//CREATING DATES
/*
//Create a Date
let now = new Date();

console.log(now);
console.log(new Date('Mon Jul 07 2025 09:15:50'));
console.log(new Date('December 24, 2015')); //Even tells the day, but theres no time (00:00:00)
// Syntax: new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
console.log(new Date(2025, 6, 7, 12, 30)); // July 7, 2025, 12:30 PM (Note: month is 0-based)

console.log(new Date(account1.movementsDates[0]));
console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));

//Working with dates
const future = new Date(2027, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getMinutes());
console.log(future.getMilliseconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(new Date(1826666580000));

future.setFullYear(2040);
console.log(future);
*/

//////////////////////////////////////////////////////////////////////////////////////////////////
//OPERATIONS WITH DATES (Skipped 1/2 lessions due to no notes)
/*
const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

const daysPassed = (date1, date2) => date2 - date1;

const days1 = daysPassed(new Date(2037, 3, 14), new Date(2037, 4, 20));
// console.log(days1);
*/
//////////////////////////////////////////////////////////////////////////////////////////////////
//International Dates (INTL)
/* */

//////////////////////////////////////////////////////////////////////////////////////////////////
//International Numbers (INTL)
/* 
const num = 38854764.23;
const options = {
  style: 'currency',
  // unit: 'celcius',
  currency: 'EUR',
  // useGrouping: ''
};
console.log(new Intl.NumberFormat('en-US', options).format(num));
console.log(new Intl.NumberFormat('de-DE').format(num));
console.log(new Intl.NumberFormat('ar-SY').format(num));
console.log(new Intl.NumberFormat(navigator.language).format(num));
*/

//////////////////////////////////////////////////////////////////////////////////////////////////
//TIMERS: setTimeout and setInterval
/* */
// let ingredients = ['olives', 'spinach'];
// let pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your ${ing1} and ${ing2} pizza`),
//   3000,
//   ...ingredients
// );
// console.log('Waiting...');

// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

function createGreeter(greeting) {
  function greet(name) {
    console.log(`${greeting}, ${name}!`);
  }
  return greet;
}

const sayHi = createGreeter('Hi');

console.log(sayHi); // This prints the entire function
// Output: [Function: greet]
