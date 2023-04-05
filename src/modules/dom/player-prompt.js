import '../../styles/player-prompt.css';

export default function createPlayerPrompt() {
  const promptWrapper = document.createElement('div');
  const heading = document.createElement('h2');

  promptWrapper.classList.add('prompt-wrapper');
  heading.classList.add('prompt');

  promptWrapper.append(heading);
  return promptWrapper;
}
