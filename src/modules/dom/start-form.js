import '../../styles/start-form.css';

export default function createForm() {
  const form = document.createElement('form');
  const nameLabel = document.createElement('label');
  const nameInput = document.createElement('input');
  const errMsg = document.createElement('p');
  const submitBtn = document.createElement('button');

  form.id = 'form';
  nameLabel.htmlFor = 'input-name';
  nameLabel.textContent = 'ENTER PLAYER NAME:';
  nameInput.id = 'input-name';
  nameInput.type = 'text';
  nameInput.placeholder = 'BATTLESHIP COMBATANT';
  nameInput.autocomplete = 'off';
  nameInput.required = true;
  errMsg.textContent = 'PLEASE ENTER A NAME';
  submitBtn.textContent = 'START GAME';
  submitBtn.type = 'button';

  form.append(nameLabel, nameInput, errMsg, submitBtn);
  return form;
}
