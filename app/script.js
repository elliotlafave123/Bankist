"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
	owner: "Elliot La Fave",
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		"2020-11-18T21:31:17.178Z",
		"2020-12-23T07:42:02.383Z",
		"2021-01-28T09:15:04.904Z",
		"2021-04-01T10:17:24.185Z",
		"2021-05-08T14:11:59.604Z",
		"2021-05-27T17:01:17.194Z",
		"2022-01-01T23:36:17.929Z",
		"2022-01-03T10:51:36.790Z",
	],
	currency: "EUR",
	locale: "pt-PT", // de-DE
};

const account2 = {
	owner: "Jessica Davis",
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		"2020-11-01T13:15:33.035Z",
		"2020-11-30T09:48:16.867Z",
		"2020-12-25T06:04:23.907Z",
		"2021-01-25T14:18:46.235Z",
		"2021-02-05T16:33:06.386Z",
		"2021-04-10T14:43:26.374Z",
		"2021-06-25T18:49:59.371Z",
		"2022-01-04T12:01:20.894Z",
	],
	currency: "USD",
	locale: "en-US",
};

const bankistUser = {
	owner: `${localStorage.getItem("bankistFullName")}`,
	movements: [392, 3400, -150, 790, 3210, -1000, 3500, -370],
	interestRate: 1.5,
	pin: Number(`${localStorage.getItem("bankistPin")}`),

	movementsDates: [
		"2020-11-01T13:15:33.035Z",
		"2020-11-30T09:48:16.867Z",
		"2020-12-25T06:04:23.907Z",
		"2021-01-25T14:18:46.235Z",
		"2021-02-05T16:33:06.386Z",
		"2021-04-10T14:43:26.374Z",
		"2021-06-25T18:49:59.371Z",
		"2022-01-04T12:01:20.894Z",
	],
	currency: "USD",
	locale: "en-US",
};

console.log(bankistUser);

const accounts = [account1, account2, bankistUser];

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const info = document.querySelector(".info");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const logo1 = document.querySelector(".logo-container");
const logo2 = document.querySelector(".logo-container-2");
const logo3 = document.querySelector(".logo-container-3");
const logo4 = document.querySelector(".logo-container-4");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const btnSortMob = document.querySelector(".btn--sort-mob");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatMovementDate = function (date, locale) {
	const calcDaysPassed = (date1, date2) =>
		Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

	const daysPassed = calcDaysPassed(new Date(), date);
	console.log(daysPassed);

	if (daysPassed === 0) return "Today";
	if (daysPassed === 1) return "Yesterday";
	if (daysPassed <= 7) return `${daysPassed} days ago`;

	// const day = `${date.getDate()}`.padStart(2, 0);
	// const month = `${date.getMonth() + 1}`.padStart(2, 0);
	// const year = date.getFullYear();
	// return `${day}/${month}/${year}`;
	return new Intl.DateTimeFormat(locale).format(date);
};

const displayMovements = function (acc, sort = false) {
	containerMovements.innerHTML = "";

	const movs = sort
		? acc.movements.slice().sort((a, b) => a - b)
		: acc.movements;

	movs.forEach(function (mov, i) {
		const type = mov > 0 ? "deposit" : "withdrawal";
		const sign = mov > 0 ? "" : "- ";

		const date = new Date(acc.movementsDates[i]);
		const displayDate = formatMovementDate(date, acc.locale);

		const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
			i + 1
		} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${sign}£${Math.abs(mov.toFixed(2))}</div>
    </div>
    `;

		containerMovements.insertAdjacentHTML("afterbegin", html);
	});
};

const logoAnim = function () {
	logo1.style.animation = "logoAnimAntiClockwise 2s ease-in-out .2s";
	logo2.style.animation = "logoAnimClockwise ease-in-out 2s .4s";
	logo3.style.animation = "logoAnimAntiClockwise ease-in-out 2.4s .6s";
	logo4.style.animation = "logoAnimClockwise ease-in-out 2.4s .6s";
	setTimeout(function () {
		logo1.style.animation = "";
		logo2.style.animation = "";
		logo3.style.animation = "";
		logo4.style.animation = "";
	}, 3000);
};

const createUsernames = function (accs) {
	accs.forEach(function (acc) {
		acc.username = acc.owner
			.toLowerCase()
			.split(" ")
			.map((name) => name[0])
			.join("");
	});
};
createUsernames(accounts);

const calcDisplaySummary = function (acc) {
	const income = acc.movements
		.filter((mov) => mov > 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumIn.textContent = `£${income.toFixed(2)}`;

	const out = acc.movements
		.filter((mov) => mov < 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumOut.textContent = `£${Math.abs(out.toFixed(2))}`;

	const interest = acc.movements
		.filter((mov) => mov > 0)
		.map((deposit) => (deposit * acc.interestRate) / 100)
		.filter((int, i, arr) => int >= 1)
		.reduce((acc, int) => acc + int, 0);
	labelSumInterest.textContent = `£${Math.abs(interest).toFixed(2)}`;
};

const calcDisplayBalance = function (acc) {
	acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

	labelBalance.textContent = `£${acc.balance.toFixed(2)}`;
};

const updateUI = function (acc) {
	// display movements
	displayMovements(acc);

	// display balance
	calcDisplayBalance(acc);

	// display summary
	calcDisplaySummary(acc);
};

////////////////////////////////////////////
////////////////////////////////////////////
// Event handelers

let currentAccount;

////////////////////////////////////////////
// FAKE ALWAYS LOGGED IN
const fakeLogin = function () {
	currentAccount = account1;
	updateUI(currentAccount);
	containerApp.style.opacity = 100;
	info.style.display = "none";
};
// fakeLogin();
////////////////////////////////////////////

// api experiment
const now = new Date();
const options = {
	hour: "numeric",
	minute: "numeric",
	day: "numeric",
	month: "numeric",
	year: "numeric",
	// weekday: 'short',
};
const locale = navigator.language;

btnLogin.addEventListener("click", function (e) {
	// prevent form from submitting
	e.preventDefault();

	currentAccount = accounts.find(
		(acc) => acc.username === inputLoginUsername.value.toLowerCase()
	);
	console.log(currentAccount.pin);

	if (currentAccount?.pin === Number(inputLoginPin.value)) {
		// display ui and welcome message
		labelWelcome.textContent = `Welcome back ${
			currentAccount.owner.split(" ")[0]
		}`;
		containerApp.style.opacity = 100;

		// create current date and time

		labelDate.textContent = new Intl.DateTimeFormat(
			currentAccount.locale,
			options
		).format(now);

		// const now = new Date();
		// const day = `${now.getDate()}`.padStart(2, 0);
		// const month = `${now.getMonth() + 1}`.padStart(2, 0);
		// const year = now.getFullYear();
		// const hour = `${now.getHours()}`.padStart(2, 0);
		// const min = `${now.getMinutes()}`.padStart(2, 0);
		// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

		info.style.display = "none";
		// Clear input fields
		inputLoginUsername.value = inputLoginPin.value = "";
		inputLoginPin.blur();

		// Update UI
		updateUI(currentAccount);
		// logoAnim();
	} else {
		console.log("incorrect Pword");
	}

	// clear login input fields
	inputLoginPin.value = inputLoginUsername.value = "";
});

btnTransfer.addEventListener("click", function (e) {
	e.preventDefault();
	const amount = Number(inputTransferAmount.value);
	const receiverAcc = accounts.find(
		(acc) => acc.username === inputTransferTo.value
	);

	inputTransferTo.value = inputTransferAmount.value = "";
	// check amount > 0
	if (
		amount > 0 &&
		receiverAcc &&
		currentAccount.balance >= amount &&
		receiverAcc?.username !== currentAccount.username
	) {
		// doing the transfer
		currentAccount.movements.push(-amount);
		receiverAcc.movements.push(amount);

		// Add transfer date
		currentAccount.movementsDates.push(new Date().toISOString());
		receiverAcc.movementsDates.push(new Date().toISOString());

		// Update UI
		updateUI(currentAccount);
	}
});

btnLoan.addEventListener("click", function (e) {
	e.preventDefault();

	const amount = Math.floor(inputLoanAmount.value);

	if (
		amount > 0 &&
		currentAccount.movements.some((mov) => mov >= amount * 0.35)
	) {
		// add movement
		currentAccount.movements.push(amount);
		currentAccount.movementsDates.push(new Date().toISOString());

		// Update UI
		updateUI(currentAccount);
	}
	inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
	e.preventDefault();

	if (
		currentAccount.username === inputCloseUsername.value &&
		currentAccount.pin === Number(inputClosePin.value)
	) {
		const index = accounts.findIndex(
			(acc) => acc.username === currentAccount.username
		);
		// Delete account
		accounts.splice(index, 1);
		localStorage.removeItem("bankistFullName");
		localStorage.removeItem("bankistPin");
		labelWelcome.textContent = "Log in to get started";

		// Hide UI

		containerApp.style.opacity = 0;
	}
	inputClosePin.value = inputCloseUsername.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
	e.preventDefault();
	displayMovements(currentAccount.movements, !sorted);
	sorted = !sorted;
});

btnSortMob.addEventListener("click", function (e) {
	e.preventDefault();
	displayMovements(currentAccount.movements, !sorted);
	sorted = !sorted;
});

window.addEventListener("beforeunload", function (e) {
	e.preventDefault();
	console.log(e);
	e.returnValue = "";
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*

console.log(23 === 23.0); // true

// Base 10 (0 to 9)
// Binary base 2 - 0 1
console.log(0.1 + 0.2); // 0.30000000000004
console.log(0.1 + 0.2 === 0.3); // false

// Converion
console.log(Number('23'));
console.log(+'23'); // + converts to number (type coercion)

// Parsing
console.log(Number.parseInt('30px', 10)); // 30
console.log(Number.parseInt('p30', 10)); // NaN

console.log(Number.parseFloat('2.5rem')); // 2.5
console.log(Number.parseInt('  2.5rem  ')); // 2

console.log(parseFloat('3.4')); // 3.4

console.log(Number.isNaN(+'3d')); // true
console.log(Number.isNaN('20')); // false
console.log(Number.isNaN(23 / 0)); // false

// checking if value is a number (no string)
console.log(Number.isFinite(20)); // true
console.log(Number.isFinite('30')); // false
console.log(Number.isFinite('30x')); // false
console.log(Number.isFinite(23 / 0)); // false

console.log(Number.isInteger(23));



console.log(Math.sqrt(25));
console.log(25 ** (1 / 2)); // square root
console.log(8 ** (1 / 3));

console.log(Math.max(5, 18, 23, 11, 2)); // 23
console.log(Math.max(5, 18, '23px', 11, 2)); // nan

console.log(Math.min(5, 18, 23, 11, 2)); // 2

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.random()); // random number 0 - 1
console.log(Math.trunc(Math.random() * 6)); // 0 - 5
console.log(Math.trunc(Math.random() * 6) + 1); // 0 - 6

// randomint function
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;

console.log(randomInt(10, 20));

// rounding intagers
console.log(Math.trunc(23.3)); // remove decimals (23)

// to nearest decimal place
console.log(Math.round(9.6)); // 10
console.log(Math.round(9.3)); //9

// rounded up
console.log(Math.ceil(9.6)); // 10
console.log(Math.ceil(9.3)); //9

// rounded down
console.log(Math.floor(9.6)); // 10
console.log(Math.floor(9.3)); //9

// negatives
console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3)); // 24

// rounding decimals
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));


// remainders ////////////////
console.log(5 % 2);
console.log(5 / 2); // 5 = 2 * 2 + 1  (1 is remainder)

console.log(8 % 3); // 2
console.log(8 / 3); // 8 = 2 / 3 + 2

const oddOrEven = function (x) {
  if (x % 2 === 0) {
    return 'even';
  } else {
    return 'odd';
  }
};
console.log(oddOrEven(Math.PI));

const isEven = n => n % 2 === 0;

labelBalance.addEventListener('click', () => {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});



// Numeric seperators ////////////////

// 287,460,000,000
const diameter = 287_460_000_000; // underscore is ignored
console.log(diameter);

const priceCents = 345_99;
console.log(priceCents);

const transferFee = 15_00;
const transferFee2 = 1_500;

const PI = 3.14159265;

// all below are incorrect
// const PI = 3._14159265;
// const PI = 3_.14159265;
// const PI = 3_.14159265_;

console.log(Number('234_23')); // Nan



// BIG INT

// 9007199254740991
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);

console.log(235476543432987489279384274823742734n); // big int (n)
console.log(BigInt(2354765434329));

console.log(10000n + 10000n);
console.log(
  2390437489273892479749823479823479872893478293478324897n *
    3798427012873940218793478102948730948720913n
);
// console.log(Math.sqrt(16n));

const huge = 27891347892317489217398n;
const num = 23;

// error (cannot mix bigint and num)
// console.log(huge * num);

console.log(huge * BigInt(num));

// Exceptions
console.log(20n > 15); // true
console.log(20n === 20); // false
console.log(typeof 20n); // bigint
console.log(20n == 20); // true1

console.log(huge + ' is Really Big!!!');

// Divisions
console.log(10n / 3n); // cuts off decimals
console.log(10 / 3);


// Create a date
const now = new Date();
console.log(now);

console.log(new Date('Jan 04 2022 12:05:04'));
console.log(new Date('December 24 2015'));
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));



// working with dates
const future = new Date(2037, 10, 19, 15, 23);

console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());

console.log(future.toISOString()); // to international standard string

// below 2 are equal
console.log(future.getTime());
console.log(new Date(2142256980000));

// get current timestamp
console.log(Date.now());

future.setFullYear(2040);
console.log(future);

*/
//////////////////
// operations with dates

const future = new Date(2037, 10, 19, 15, 23);
// console.log(Number(future));
console.log(+future);

const calcDaysPassed = (date1, date2) =>
	Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 15), new Date(2037, 3, 4));
console.log(days1);
