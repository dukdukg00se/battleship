// import carrier from './assets/images/carrier.svg';
// import destroyer from './assets/images/destroyer.svg';
// import patrol from './assets/images/patrol.svg';
// import submarine from './assets/images/submarine.svg';
// import battleship from './assets/images/battleship.svg';

// let div1 = document.createElement('div');
// let div2 = document.createElement('div');
// let div3 = document.createElement('div');
// let div4 = document.createElement('div');
// let div5 = document.createElement('div');

// let carrIc = document.createElement('img');
// let destIc = document.createElement('img');
// let patIc = document.createElement('img');
// let subIc = document.createElement('img');
// let batIc = document.createElement('img');

// carrIc.src = carrier;
// destIc.src = destroyer;
// patIc.src = patrol;
// subIc.src = submarine;
// batIc.src = battleship;

// div1.append(carrIc);
// div2.append(destIc);
// div3.append(patIc);
// div4.append(subIc);
// div5.append(batIc);

// document.body.append(div1, div2, div3, div4, div5);

import './styles/reset.css';
import './styles/styles.css';
import startForm from './modules/display/start-form';
import initNewGame from './modules/controller';

const main = document.querySelector('main');
main.append(startForm());
initNewGame();

// const nameInput = document.getElementById('input-name');
// const submitBtn = document.querySelector('form > button');

// submitBtn.addEventListener('click', () => {
//   const errMsg = document.querySelector('form > p');
//   if (nameInput.validity.valueMissing) {
//     errMsg.style.visibility = 'visible';
//   } else {
//     errMsg.style.visibility = 'hidden';

//     const name = nameInput.value;

//     document.querySelector('form').style.animation =
//       '.9s ease-in 0s 1 normal forwards running fadeout';

//     setTimeout(() => {
//       document.querySelector('form').remove();
//       main.append(createPositPage());
//       initNewGame(name);
//     }, 950);

//   }
// });
