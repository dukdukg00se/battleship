import '../../styles/player-prompt.css';

function msgPlayer(text, i = 0) {
  if (i > text.length) return;
  const headMsg = document.querySelector('.prompt');
  headMsg.textContent = text.substring(0, (i += 1));

  setTimeout(() => {
    msgPlayer(text, i);
  }, 30);
}

function createPlayerPrompt() {
  const promptWrapper = document.createElement('div');
  const heading = document.createElement('h2');

  promptWrapper.classList.add('prompt-wrapper');
  heading.classList.add('prompt');

  promptWrapper.append(heading);
  return promptWrapper;
}

export { msgPlayer, createPlayerPrompt };
