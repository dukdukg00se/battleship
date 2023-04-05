import '../../styles/winner-section.css';

export default function declareWinner(name) {
  const container = document.createElement('div');
  const header = document.createElement('h2');
  const winner = document.createElement('h3');
  const resetBtn = document.createElement('button');

  container.classList.add('winner-section')
  header.textContent = 'THE WINNER IS:';
  winner.textContent = name;
  resetBtn.textContent = 'PLAY AGAIN';
  resetBtn.id = 'reset-btn';

  container.append(header, winner, resetBtn);
  return container;
}