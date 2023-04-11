import './styles/reset.css';
import './styles/styles.css';
import icon from './assets/images/favicon.png';
import initNewGame from './modules/controller';
import setFavicon from './modules/dom/display-favicon';

setFavicon(icon);
initNewGame();
