
function addTextAreaListener(textAreaElement, answerDiv) {

    textAreaElement.addEventListener('keydown', async (event) => {
        // todo prevent default handler for keypress keydown when textAreaElement is in focus
        // temporary workaround 
        if (event.ctrlKey) {
            textAreaElement.value += '\n';
            return;
        }
        if (event.key === 'Enter') {
            // Potentially visible from timeout hide again in case of another timeout  
            answerDiv.style.visibility = 'hidden';

            let checkButton = document.querySelector('button.nav-btn.action-btn');
            if (checkButton) {
                checkButton.click();
                let maxTime = 2000; // Maximum time to wait for 2 seconds
                let elapsedTime = 0;
                let checkInterval = 50; // Interval to check every 50ms

                let interval = setInterval(async function () {
                    elapsedTime += checkInterval;

                    let answerElement = document.querySelector('div.answer .text p');
                    if (answerElement) {
                        clearInterval(interval);
                        const userAnswer = textAreaElement.value.trim();
                        const answer = stripHtmlTags(answerElement.textContent.trim());

                        const similarityPercentage = calculateStringSimilarity(userAnswer, answer);
                        textAreaElement.value = '';

                        const highlightAnswer = highlightDifferences(answer, userAnswer);
                        textAreaElement.style.height = '30px';
                        answerDiv.style.height = '100px';
                        answerDiv.style.visibility = 'visible';
                        updateAnswerDiv(answerDiv, answer, highlightAnswer, similarityPercentage);
                        const isCorrectAnswer = similarityPercentage === 100;
                        if (isCorrectAnswer) {
                            textAreaElement.style.visibility = 'hidden';
                            const btnKnow = document.querySelector('.know');
                            triggerClick(btnKnow);
                            await sleep(1750);
                        } else {
                            textAreaElement.placeholder = 'Press Shift For Next Question';
                        }

                        if (!isCorrectAnswer && similarityPercentage >= 93) {
                            const btnAlmostKnow = document.querySelector('.almost');
                            triggerClick(btnAlmostKnow);
                        } else if (!isCorrectAnswer) {
                            const btnDontKnow = document.querySelector('.dont-know');
                            triggerClick(btnDontKnow);
                        }

                        isCorrectAnswer || await waitForShiftPress(textAreaElement);
                        textAreaElement.placeholder = 'Type your answer and press Enter to submit (ctr for new line)';
                        answerDiv.style.visibility = 'hidden';
                        answerDiv.style.height = '0px';
                        textAreaElement.style.visibility = 'visible';
                        textAreaElement.style.height = '100px';
                        textAreaElement.focus();

                    } else if (elapsedTime >= maxTime) {
                        answerDiv.style.height = '30px';
                        answerDiv.style.visibility = 'visible';
                        answerDiv.innerHTML = `Timed out waitig for an answer`;
                        clearInterval(interval);
                    }
                }, checkInterval);
            }
            event.stopPropagation();
            event.preventDefault();
        }
    });
}

function addFloatingDivDragListeners(floatingDiv) {
    let isDragging = false;
    let offsetX, offsetY;

    floatingDiv.addEventListener('mousedown', (e) => {
        const rect = floatingDiv.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        const borderWidth = 10;

        if (
            offsetX < borderWidth ||
            offsetX > rect.width - borderWidth ||
            offsetY < borderWidth * 2 ||
            offsetY > rect.height - borderWidth
        ) {
            floatingDiv.style.left = rect.left + 'px';
            floatingDiv.style.top = rect.top + 'px';

            isDragging = true;
        }
        floatingDiv.style.opacity = '1.0';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            floatingDiv.style.left = e.clientX - offsetX + 'px';
            floatingDiv.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
        }
        floatingDiv.style.opacity = '0.9';
    });
}

const triggerClick = (element) => {
    if (element && "click" in element) {
        element.click();
    }
};

function waitForShiftPress(textAreaElement) {
    return new Promise((resolve) => {
        function onKeydown(event) {
            if (event.shiftKey) {
                textAreaElement.removeEventListener('keydown', onKeydown);  // Remove the listener once Shift is pressed
                resolve();
            }
        }
        textAreaElement.addEventListener('keydown', onKeydown);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateAnswerDiv(answerDiv, answer, highlightAnswer, similarityPercentage) {
    // Remove all child nodes
    while (answerDiv.firstChild) {
        answerDiv.removeChild(answerDiv.firstChild);
    }

    // Create divs and set their content
    let answerDivElem = document.createElement("div");
    answerDivElem.textContent = answer;
    answerDiv.appendChild(answerDivElem);

    answerDiv.appendChild(highlightAnswer);

    let similarityDivElem = document.createElement("div");
    similarityDivElem.textContent = `similarity ${similarityPercentage.toFixed(2)}%`;
    answerDiv.appendChild(similarityDivElem);
}