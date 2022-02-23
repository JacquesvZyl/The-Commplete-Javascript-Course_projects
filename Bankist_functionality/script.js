'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-02-11T23:36:17.929Z',
    '2022-02-13T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2022-02-13T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
let account, timerInterval;
const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

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
/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

function formatCur(value, locale, currency) {
  const formattedValue = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value.toFixed(2));

  return formattedValue;
}

function formatMovementDate(date) {
  function calcDaysPassed(date1, date2) {
    return Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  }
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  /*   const day = String(date.getDate()).padStart(2, 0);
  const month = String(date.getMonth() + 1).padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; */
  const locale = navigator.language;
  return new Intl.DateTimeFormat(locale).format(date);
}

function sortMovements(movs, dates, sort) {
  const combined = movs.map((mov, i) => {
    return [mov, dates[i]];
  });
  const finalMovs = sort ? combined.sort((a, b) => a[0] - b[0]) : combined;
  return finalMovs;
}

function displayMovements(account, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sortMovements(account.movements, account.movementsDates, sort);

  movs.forEach((m, i) => {
    const moveType = m[0] < 0 ? 'withdrawal' : 'deposit';

    const date = new Date(m[1]);
    const displayDate = formatMovementDate(date);

    const formattedMov = formatCur(m[0], account.locale, account.currency);

    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${moveType}">${
      i + 1
    } ${moveType}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
    /* 
     <div class="movements__row">
          <div class="movements__type movements__type--deposit">2 deposit</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">4 000€</div>
        </div>
    */
  });
}

function createUsername(accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
}

function calcDisplaySummary(account) {
  const incoming = account.movements
    .filter(mov => mov > 0)
    .reduce((counter, element) => counter + element, 0);

  const outgoing = account.movements
    .filter(mov => mov < 0)
    .reduce((counter, element) => counter + element, 0);

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((counter, element) => counter + element, 0);
  labelSumIn.innerText = formatCur(incoming, account.locale, account.currency);
  labelSumOut.innerText = formatCur(
    Math.abs(outgoing),
    account.locale,
    account.currency
  );
  labelSumInterest.innerText = formatCur(
    interest,
    account.locale,
    account.currency
  );
}

function displayBalance(account) {
  account.balance = account.movements.reduce(
    (counter, element) => counter + element,
    0
  );
  const formattedBalance = formatCur(
    account.balance,
    account.locale,
    account.currency
  );

  labelBalance.innerText = `${formattedBalance}`;
}

createUsername(accounts);

let sort = false;

function updateUI(account) {
  displayMovements(account);
  displayBalance(account);
  calcDisplaySummary(account);
}

function loginUser(username, password) {
  account = accounts.find(acc => acc.username === username);
  if (account?.pin === Number(password)) {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = logoutTimer();
    labelWelcome.innerText = `Welcome back, ${account.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;
    updateUI(account);
  }
}

function transferTo(fromAcc, toAcc, amount) {
  const toAccount = accounts.find(acc => acc.username === toAcc);
  const amountNum = Number(amount);
  if (
    toAccount &&
    toAccount?.username !== fromAcc.username &&
    amountNum > 0 &&
    fromAcc.balance > amountNum
  ) {
    fromAcc.movements.push(-amountNum);
    fromAcc.movementsDates.push(new Date().toISOString());
    toAccount.movements.push(amountNum);
    toAccount.movementsDates.push(new Date().toISOString());
    updateUI(account);
    clearInterval(timerInterval);
    timerInterval = logoutTimer();
  }
}

function deleteAccount(currentAccount, inputUsername, inputPassword) {
  if (
    currentAccount.username === inputUsername &&
    currentAccount.pin === Number(inputPassword)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === inputUsername && acc.pin === Number(inputPassword)
    );
    accounts.splice(index, 1);
    console.log(index);
    containerApp.style.opacity = 0;
  }
}

function loanFunction(currentAccount, loamAmnt) {
  if (
    loamAmnt > 0 &&
    currentAccount &&
    currentAccount.movements.some(mov => mov >= Number(loamAmnt) * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(Number(Math.floor(loamAmnt)));
      currentAccount.movementsDates.push(new Date().toISOString());
      clearInterval(timerInterval);
      timerInterval = logoutTimer();
      updateUI(currentAccount);
    }, 3000);
  }
}

// Setting current date with API
const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long',
};
const locale = navigator.language;
labelDate.innerText = new Intl.DateTimeFormat(locale, options).format(now);
/////

function logoutTimer() {
  function tick() {
    const min = String(Math.floor(timer / 60)).padStart(2, 0);
    const sec = String(timer % 60).padStart(2, 0);
    // in each callback, print remaining time to ui
    labelTimer.innerText = `${min}:${sec}`;

    // when 0, stop timer and log out user
    if (timer <= 0) {
      clearInterval(interval);
      labelWelcome.innerText = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    timer--;
  }
  // Set time to 5mins
  let timer = 120;
  //call timer every second
  tick();
  const interval = setInterval(tick, 1000);
  return interval;
}

btnLogin.addEventListener('click', event => {
  event.preventDefault();
  loginUser(inputLoginUsername.value, inputLoginPin.value);
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
});

btnTransfer.addEventListener('click', event => {
  event.preventDefault();
  transferTo(account, inputTransferTo.value, inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

btnClose.addEventListener('click', event => {
  event.preventDefault();
  deleteAccount(account, inputCloseUsername.value, inputClosePin.value);
  inputCloseUsername.value = inputClosePin.value = '';
  //console.log(accounts.findIndex(account));
});

btnLoan.addEventListener('click', event => {
  event.preventDefault();
  loanFunction(account, inputLoanAmount.value);

  inputLoanAmount.value = '';
  //1 desposit wwith at least 10% of the loan amount
});

btnSort.addEventListener('click', () => {
  sort = !sort;
  displayMovements(account, sort);
});

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert 
dog ages to human ages and calculate the average age of the dogs in their study.
Your tasks:
Create a function 'calcAverageHumanAge', which accepts an arrays of dog's 
ages ('ages'), and does the following things in order:
1. Calculate the dog age in human years using the following formula: if the dog is 
<= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, 
humanAge = 16 + dogAge * 4
2. Exclude all dogs that are less than 18 human years old (which is the same as 
keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know 
from other challenges how we calculate averages �)
4. Run the function for both test datasets
Test data:
§ Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]

*/
