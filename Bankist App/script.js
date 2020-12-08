'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
// display moveemnts
const displayMovements = function (movements, sort = false) {
  // empty the hardcoded movement rows
  containerMovements.innerHTML = ' ';
  // fake always logged in

  // if sort exists then sort movements else  return movements
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  // console.log(movs);
  // iterate for each moveemnt entry
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    console.log(type);
    console.log(i + 1, mov);
    // iterating html code to js [inserting movemnets row]each iteration
    const html = `  
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">
    ${i + 1} ${type} </div>
    <div class="movements__value">${mov.toFixed(2)}€</div>
  </div>

`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
  console.log(containerMovements.innerHTML);
};
// call display function

// display total balance of the entries of an account
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
}; //call function display balance

// calculating summary for deposit withdrawal and interests
const calcDisplaySummary = function (acc) {
  // calculate total deposits
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income.toFixed(2)}€`;
  // calculate total outcomes or withdrawal
  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, credit) => acc + credit, 0);
  labelSumOut.textContent = `${outcome.toFixed(2)}€`;
  // calculate intersts for  each deposit bank interest=1.2 and calculate interests if interest>1
  const interests = acc.movements
    .filter(mov => mov > 0)
    .map(interest => (interest * acc.interestRate) / 100)
    .filter((interest, i, arr) => {
      return interest >= 1;
      // console.log(arr);
    })
    .reduce((acc, interest) => acc + interest, 0);

  labelSumInterest.textContent = `${interests.toFixed(2)}€`;
};
// computing usernamess
// const user = ";
const userName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
  // console.log(acc2.userName);
};
userName(accounts);
// console.log(accounts);

// update ui
const updateUI = function (acc) {
  // display movements
  displayMovements(currentAccount.movements);
  //display balance
  calcDisplayBalance(currentAccount);
  // display summary
  calcDisplaySummary(currentAccount);
};

// event handlers for input login click
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('login');
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    // display ui messgae
    labelWelcome.textContent = `Welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
  // updating ui
  updateUI(currentAccount);
});

//  transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    console.log('transfer valid');
    // doing transfer
    currentAccount.movements.push(-amount);
    console.log(currentAccount.movements);
    receiverAcc.movements.push(amount);
  }
  // updating ui
  updateUI(currentAccount);
  // clearing the fields
  inputTransferAmount.value = inputTransferTo.value = '';
});

// request loan amount
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = +inputLoanAmount.value;

  // using some method
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov > loanAmount * 0.1)
  ) {
    currentAccount.movements.push(loanAmount);
    updateUI(currentAccount);
  }
  // reset the fields
  inputLoanAmount.value = '';
});
// every method-check whether all moveemnts have positive or negative
console.log(account4.movements.every(mov => mov > 0));
console.log(account4.movements);

// close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // findindex method
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);
    // splice method to delete data from accounts
    accounts.splice(index, 1);
    console.log(accounts);
    // hide the containe once deleted
    containerApp.style.opacity = 0;
    // ui message
    labelWelcome.textContent = `Hey ${
      currentAccount.owner.split(' ')[0]
    } account is sucessfully closed!Thanks visit again!!`;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted); //sort=true
  sorted = !sorted; //sorted true become false//flipping the variable to back position
});

// filter
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
// using find method
const deposit = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposit);
const withdrawl = movements.filter(function (mov) {
  return mov < 0;
});
console.log(withdrawl);
// using arrow function
const withdrawla = movements.filter(mov => mov < 0);
console.log(withdrawla);

// computing max value of movements
const max = movements.reduce((acc, cur) => {
  if (acc > cur) {
    return acc;
  } else {
    return cur;
  }
}, movements[0]);
console.log(max);

// using arrow function/ternary for max value
const max1 = movements.reduce(
  (acc, cur) => `${acc > cur ? acc : cur}`,
  movements[0]
);
console.log(max1);
