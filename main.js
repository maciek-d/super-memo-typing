

const { floatingDiv, textAreaElement, answerDiv } = createUI();

// Adding listeners from listeners.js
addTextAreaListener(textAreaElement, answerDiv, floatingDiv);
addFloatingDivDragListeners(floatingDiv);;

