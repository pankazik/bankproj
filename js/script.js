'use strict'

const account1 = {
  owner:'Martin Schultz',
  movements:{
    '2021-04-20T17:28:04.891Z':200,
    '2020-04-20T17:28:04.891Z':400,
    '2020-03-20T17:28:04.891Z':-250,
    '2020-01-20T17:28:04.891Z':600,
    '2019-11-20T17:28:04.891Z':-950,
  },
  interestRate:1.2,
  pin:1111,
};

const account2 = {
  owner:'Stefan Janicki',
  movements:{
    '2021-04-10T17:28:04.891Z':4000,
    '2020-04-09T17:28:04.891Z':-400,
    '2020-03-20T17:28:04.891Z':-800,
    '2020-01-20T17:28:04.891Z':2000,
    '2019-11-20T17:28:04.891Z':-3000,
  },
  interestRate:1.8,
  pin:2222,
};

const account3 = {
  owner:'Albert Pinckett',
  movements:{
    '2022-04-20T17:28:04.891Z':4000,
    '2021-04-20T17:28:04.891Z':7000,
    '2022-03-20T17:28:04.891Z':6000,
    '2021-02-20T17:28:04.891Z':-15000,
    '2020-12-20T17:28:04.891Z':-950,
  },
  interestRate:1.3,
  pin:3333,
};


const accounts = [account1,account2,account3];
let currentAccount;
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
const movesSort = document.querySelector('.moves--sort');

const displayMovements = function (account, sort=false,withdraws=false,deposits=false) {
  const movementsDates = Object.keys(account.movements).map(function(a){
    const returnDate = new Date(a);
    const day = returnDate.getDate().toString().padStart(2,0);
    const month = (returnDate.getMonth()+1).toString().padStart(2,0);
    const year = returnDate.getFullYear();
    return `${day}/${month}/${year}`
  }

  );
  console.log(movementsDates);
  const accountMoves = Object.values(account.movements);

  containerMovements.innerHTML='';
  let movs = withdraws?[...accountMoves].filter(a=>a<0)
  :deposits?[...accountMoves].filter(a=>a>0)
  :[...accountMoves]
  movs =sort?movs.sort((a,b)=>a-b):movs
  movs.forEach(function(movement,index){
    const type = movement>0?'deposit':'withdraw';
    const html = `
    <div class="movements__row">
      <div class="movements__type
      movements__type--${type}">${index+1}</div>
      <div class="movements__value">${Number(movement).toFixed(2)}€<div class="movements__date">${movementsDates[index]}</div></div>
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
  showBalance.textContent = `${Number(accountMoves.reduce((a,b)=>a+b)).toFixed(2)} €`;
}

function showIncome(account){
  const accountMoves = Object.values(account.movements);
  const income = Number(accountMoves.filter(a=>a>0).reduce((a,b)=>a+b)).toFixed(2);
  const outcome = Number(Math.abs(accountMoves.filter(a=>a<0).reduce((a,b)=>a+b))).toFixed(2);
  const interest = Number(income*0.012);
  incomeSummary.textContent = `Income: ${income}`
  outcomeSummary.textContent = `Outcome: ${outcome}`
  interesSummary.textContent = `Interest: ${parseInt(interest)}`
}

function correctDate(){
  const datenow = new Date();
  const day = datenow.getDate().toString().padStart(2,0);
  const month = (datenow.getMonth()+1).toString().padStart(2,0);
  const year = datenow.getFullYear();
  showDate.innerHTML=`As of ${day}/${month}/${year}`;
}

correctDate();

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
  }
})

showAllMoves.addEventListener('click',function(){
  displayMovements(currentAccount,false,false,false);
  sorted=false;})
showAllWithdraws.addEventListener('click',function(){
  displayMovements(currentAccount,false,true,false)})
showAllDeposits.addEventListener('click',function(){
  displayMovements(currentAccount,false,false,true)})
movesSort.addEventListener('click',function(){
  displayMovements(currentAccount,!sorted,false,false);
  sorted=!sorted;})

const updateStatus = function(){
  displayMovements(currentAccount,false,false,false);
  showIncome(currentAccount);
  calcPrintBalacne(currentAccount);
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
    currentAccount.movements[movementDate] = +amount;
    updateStatus();
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

const datadzis = new Date();

console.log(datadzis.toISOString());
