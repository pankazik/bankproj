'use strict'

const account1 = {
  owner:'Martin Schultz',
  movements:[200,400,-250,600,-950,1000,5000,-2500],
  interestRate:1.2,
  pin:1111,
};

const account2 = {
  owner:'Stefan Janicki',
  movements:[4000,-400,-800,-950,2000,-3000],
  interestRate:1.8,
  pin:2222,
};

const account3 = {
  owner:'Albert Pinckett',
  movements:[4000,7000,6000,-15000,-950],
  interestRate:1.3,
  pin:3333,
};

const account4 = {
  owner:'Martin Schultz',
  movements:[20,50,-30,-10,-20,-30,100,-70],
  interestRate:0.4,
  pin:4444,
};

const accounts = [account1,account2,account3,account4];

const containerMovements = document.querySelector('.movements');
const showDate = document.querySelector('.showDate');
const showBalance = document.querySelector('.showBalance');


const displayMovements = function (mov) {
  containerMovements.innerHTML='';
  this.forEach(function(movement,index){
    const type = movement>0?'deposit':'withdraw';
    const html = `
    <div class="movements__row">
      <div class="movements__type
      movements__type--${type}">${index+1}</div>
      <div class="movements__value">${movement}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin',html);
  })};

const dpMoves = displayMovements;
dpMoves.apply(account1.movements);

function createUserName(accs) {
  accs.forEach(function (acc) {
  acc.username=acc.owner
  .toLowerCase()
  .split(' ')
  .map(a=>a[0])
  .join('');
  })
}

function calcPrintBalacne(moves){
  showBalance.textContent = '';
  showBalance.textContent = `${moves.reduce((a,b)=>a+b)} EUR`;
}

function showWithdraws(withdraws){
  dpMoves.apply(this.filter(a=>a<0))
}

function showDeposits(deposits){
dpMoves.apply(this.filter(a=>a>0))
}

function correctDate(){
  let datenow = new Date();
  showDate.innerHTML=`As of ${datenow.getFullYear()}/${datenow.getUTCMonth()}/
  ${datenow.getUTCDate()}`;
}

correctDate();
calcPrintBalacne(account1.movements);
const showAllMoves = document.querySelector('.allMoves');
const showAllWithdraws = document.querySelector('.withdraws');
const showAllDeposits = document.querySelector('.deposits')

showAllMoves.addEventListener('click',displayMovements.bind(account1.movements))
showAllWithdraws.addEventListener('click',showWithdraws.bind(account1.movements))
showAllDeposits.addEventListener('click',showDeposits.bind(account1.movements))
