'use strict'

const account1 = {
  owner:'Martin Schultz',
  movements:{
    '2019-11-20T17:28:04.891Z':-950,
    '2020-01-20T17:28:04.891Z':600,
    '2020-03-20T17:28:04.891Z':-250,
    '2020-04-20T17:28:04.891Z':400,
    '2021-04-20T17:28:04.891Z':200,
  },
  interestRate:1.2,
  pin:1111,
  locale:'en-US',
  currency:'USD',
};

const account2 = {
  owner:'Stefan Janicki',
  movements:{
    '2019-11-20T17:28:04.891Z':-3000,
    '2020-01-20T17:28:04.891Z':2000,
    '2020-03-20T17:28:04.891Z':-800,
    '2020-04-09T17:28:04.891Z':-400,
    '2021-04-10T17:28:04.891Z':4000,
  },
  interestRate:1.8,
  pin:2222,
  locale:'pt-PT',
  currency:'EUR',
};

const account3 = {
  owner:'Albert Pinckett',
  movements:{
    '2022-04-12T17:28:04.891Z':-950,
    '2022-04-13T17:28:04.891Z':-15000,
    '2022-04-15T17:28:04.891Z':7000,
    '2022-04-19T17:28:04.891Z':6000,
    '2022-04-20T17:28:04.891Z':4000,
  },
  interestRate:1.3,
  pin:3333,
  locale:'pl-PL',
  currency:'USD',
};

const accounts = [account1,account2,account3];
let currentAccount,timer;
const containerMovements = document.querySelector('.movements');
const showDate = document.querySelector('.showDate');
const showBalance = document.querySelector('.showBalance');
const incomeSummary = document.querySelector('.incomeSummary');
const outcomeSummary = document.querySelector('.outcomeSummary');
const interesSummary = document.querySelector('.interesSummary');
const loginButton = document.querySelector('.login__btn');
const loginUser = document.querySelector('.login__input--user');
const loginPin = document.querySelector('.login__input--pin');
const labelWelcome = document.querySelector('.welcome');
const containerApp = document.querySelector('.app');
const transferId = document.querySelector('.transfer--id');
const transferAmount = document.querySelector('.transfer--amount');
const transferSubmit = document.querySelector('.transfer--submit');
const loanAmount = document.querySelector('.loan--amount');
const loanSubmit = document.querySelector('.loan--submit');
const deleteId = document.querySelector('.delete--id');
const deletePass = document.querySelector('.delete--pass');
const deleteSubmit = document.querySelector('.delete--submit');
const timeoutTimer = document.querySelector('.timeout');

const displayMovements = function (account, sort=false,withdraws=false,deposits=false) {
  const movementsDates = Object.keys(account.movements).map(function(a){
    const returnDate = new Date(a);
    const day = returnDate.getDate().toString().padStart(2,0);
    const month = (returnDate.getMonth()+1).toString().padStart(2,0);
    const year = returnDate.getFullYear();
    const dateDiff = Math.floor((new Date() - returnDate) / (1000*60*60*24))

    if (dateDiff === 0) {
      return 'Today'
    }else if (dateDiff === 1) {
      return 'Yesterday'
    }else if (dateDiff <=7) {
      return `${dateDiff} days ago`;
    }else {
      return Intl.DateTimeFormat(currentAccount.locale).format(returnDate);
    }
  }
  );
  const accountMoves = Object.values(account.movements);

  containerMovements.innerHTML='';
  let movs = withdraws?[...accountMoves].filter(a=>a<0)
  :deposits?[...accountMoves].filter(a=>a>0)
  :[...accountMoves]
  movs = sort?movs.sort((a,b)=>a-b):movs
  movs.forEach(function(movement,index){
    const type = movement>0?'deposit':'withdraw';
    const options = {
      style:'currency',
      currency:account.currency,
    }
    const formattedMovement = Intl.NumberFormat(account.locale,options).format(movement);
    const html = `
    <div class="movements__row">
      <div class="movements__type
      movements__type--${type}">${index+1}</div>
      <div class="movements__value">${formattedMovement}<div class="movements__date">${movementsDates[index]}</div></div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin',html);
  })
  const movesList = [...document.querySelectorAll(`.movements__row`)];
  movesList.forEach((item, i) => {
    if(i%2 === 1){
    item.style.backgroundColor='grey'
    }
  });
};

function createUserName(accs) {
  accs.forEach(function (acc) {
  acc.username=acc.owner
  .toLowerCase()
  .split(' ')
  .map(a=>a[0])
  .join('');
  })
}

createUserName(accounts);

function calcPrintBalacne(account){
  const accountMoves = Object.values(account.movements);
  showBalance.textContent = '';
  showBalance.textContent = `${calcUsingIntl(Number(accountMoves
    .reduce((a,b)=>a+b)),account.locale,account.currency)}`;
}

const calcUsingIntl = function(value,locale,currency){
  const options = {
    style:'currency',
    currency:currency,
  }
  return new Intl.NumberFormat(locale,options).format(value);
}

function showIncome(account){
  const accountMoves = Object.values(account.movements);
  const options = {
    style:'currency',
    currency:account.currency,
  }
  const income = calcUsingIntl(Number(accountMoves.filter(a=>a>0)
  .reduce((a,b)=>a+b)),account.locale,account.currency);
  const outcome = calcUsingIntl(Number(Math.abs(accountMoves.filter(a=>a<0)
  .reduce((a,b)=>a+b))),account.locale,account.currency);
  const interest = calcUsingIntl(Math.floor(Number(accountMoves.filter(a=>a>0)
  .reduce((a,b)=>a+b)*account.interestRate/100))
  ,account.locale,account.currency);

  incomeSummary.textContent = `Income: ${income}`
  outcomeSummary.textContent = `Outcome: ${outcome}`
  interesSummary.textContent = `Interest: ${interest}`
}

function correctDate(){
  const datenow = new Date();
  // showDate.innerHTML=`As of ${day}/${month}/${year}`;
  const options = {
    hour:'numeric',
    minute:'numeric',
    day:'numeric',
    month:'numeric',
    year:'numeric',
  }
  // const locale = navigator.language;
  showDate.innerHTML = new Intl.DateTimeFormat(currentAccount.locale,options).format(datenow);
}

const showAllMoves = document.querySelector('.allMoves');
const showAllWithdraws = document.querySelector('.withdraws');
const showAllDeposits = document.querySelector('.deposits')

let sorted = false;

loginButton.addEventListener('click',function(e){
  e.preventDefault();
  currentAccount = accounts.find(acc=>acc.username===loginUser.value);
  if (currentAccount?.pin == Number(loginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner
      .split(' ')[0]}!`;
      updateStatus();
      containerApp.style.opacity=100;
      correctDate();
      if (timer) {
        clearInterval(timer);
      }
      timer = startLogoutTimer();
  }
})

showAllMoves.addEventListener('click',function(){
  displayMovements(currentAccount,false,false,false);
  sorted=false;})
showAllWithdraws.addEventListener('click',function(){
  displayMovements(currentAccount,false,true,false)})
showAllDeposits.addEventListener('click',function(){
  displayMovements(currentAccount,false,false,true)})

const updateStatus = function(){
  displayMovements(currentAccount,false,false,false);
  showIncome(currentAccount);
  calcPrintBalacne(currentAccount);
  clearInterval(timer);
  timer = startLogoutTimer();
}

transferSubmit.addEventListener('click',function(e){
  e.preventDefault();
  const datenow = new Date();
  const movementDate = datenow.toISOString();
  const accountMoves = Object.values(currentAccount.movements);
  const receiverAccount = accounts.find(acc=>acc.username===transferId.value);
  const amount = Number(transferAmount.value).toFixed(2);
  if (currentAccount) {
    if (receiverAccount
    &&receiverAccount!=currentAccount) {
      if (amount>0
        &&amount<=accountMoves.reduce((a,b)=>a+b)) {
        currentAccount.movements[movementDate] = -amount;
        receiverAccount.movements[movementDate] = +amount;
        updateStatus();
      }else {
        alert('Incorrect amount')
      }

    }else {
      alert('Wrong Beneficient')
    }
  }else {
    alert('Please sign in first')
  }
})

deleteSubmit.addEventListener('click',function(e){
  e.preventDefault();
  if (deleteId.value === currentAccount?.username
  && Number(deletePass.value) === currentAccount.pin
) {
  const delIndex = accounts.findIndex(acc=>acc.username===deleteId.value);
  accounts.splice(delIndex,1);
  containerApp.style.opacity = 0;
  }
})

loanSubmit.addEventListener('click',function(e){
  const datenow = new Date();
  const movementDate = datenow.toISOString();
  const accountMoves = Object.values(currentAccount.movements);
  e.preventDefault();
  const amount = Math.floor(Number(loanAmount.value));
  if(amount>0 && accountMoves.some(mov=>mov>=amount/10)){
    setTimeout (function(){
    currentAccount.movements[movementDate] = +amount;
    updateStatus();
},2500)
  }
})

// showBalance.addEventListener('click',function(){
//   const movementsUI = Array.from(document.querySelectorAll('.movements__value'),
// el=>Number(el.textContent.replace('€','')))
//   console.log(movementsUI);
// })
//
// const bankDepositSum = accounts
// .flatMap(acc=>acc.movements)
// .filter(mov=>mov>0)
// .reduce((a,b)=>a+b)
// console.log(bankDepositSum);
//
// const numDeposit1000 = accounts
// .flatMap(acc=>acc.movements)
// .reduce((count,curr)=> (curr>=1000?++count:count),0);
// console.log(numDeposit1000);
//
// const {deposits,withdrawals} = accounts
// .flatMap(acc=>acc.movements).reduce((sums,cur)=>{
//   // cur > 0 ? sums.deposits+=cur:sums.withdrawals+=cur;
//   sums[cur>0?'deposits':'withdrawals']+=cur;
//   return sums;
// },{deposits:0,withdrawals:0})

const startLogoutTimer = function(){
  const tick = function(){
    const min = String(Math.trunc(time/60)).padStart(2,0);
    const sec = String(time%60).padStart(2,0);
    timeoutTimer.textContent=`You will be logged off in: ${min}:${sec}`;

    if (time<=0) {
      clearInterval(timer)
      currentAccount = null;
      containerApp.style.opacity=0;
      timeoutTimer.textContent='';
      labelWelcome.textContent=`Log in to start banking !`;
    }
      time--;
  }
  let time = 60;
  tick();
  const timer = setInterval(tick,1000)
  return timer;
}
