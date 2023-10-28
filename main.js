// I am not using bundler so all the files are loaded by manifest.json

const { floatingDiv, textAreaElement, answerDiv } = createUI();

// Adding listeners from listeners.js
addTextAreaListener(textAreaElement, answerDiv, floatingDiv);
addFloatingDivDragListeners(floatingDiv);;

