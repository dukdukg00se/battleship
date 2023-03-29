import './styles/reset.css';
import './styles/styles.css';
import startForm from './modules/dom/start-form';
import initNewGame from './modules/controller';

const main = document.querySelector('main');
main.append(startForm());
initNewGame();

