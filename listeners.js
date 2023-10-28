
function addTextAreaListener(textAreaElement, handleKeydown) {

    textAreaElement.addEventListener('keydown', async (event) => {
        // todo prevent default handler for keypress keydown when textAreaElement is in focus
        // temporary workaround 
        if (event.ctrlKey) {
            textAreaElement.value += '\n';
            return;
        }
        if (event.key === 'Enter') {
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

                        console.log(userAnswer, answer);
                        const similarityPercentage = calculateStringSimilarity(userAnswer, answer);
                        textAreaElement.value = '';

                        const highlightAnswer = highlightDifferences(answer, userAnswer);
                        textAreaElement.style.height = '20px';
                        answerDiv.style.height = '100px';
                        answerDiv.style.visibility = 'visible';
                        answerDiv.innerHTML = `${answer} <br/>${highlightAnswer} <br/>similarity ${similarityPercentage.toFixed(2)}%`;
                        const isCorrectAnswer = similarityPercentage === 100;
                        if (isCorrectAnswer) {
                            const btnKnow = document.querySelector('.know');
                            triggerClick(btnKnow);
                        }

                        isCorrectAnswer || await waitForEnterPress(textAreaElement);
                        if (isCorrectAnswer) {
                            textAreaElement.style.height = '0px';
                            await sleep(1750);
                        } else {
                            textAreaElement.placeholder = 'Press Enter For Next Question';
                        }

                        textAreaElement.placeholder = 'Type your answer and press Enter to submit (ctr for new line)';
                        answerDiv.style.height = '0px';
                        textAreaElement.style.height = '100px';

                        // if (!isCorrectAnswer && similarityPercentage >= 93) {
                        //     const btnAlmostKnow = document.querySelector('.almost');
                        //     triggerClick(btnAlmostKnow);
                        // } else if (!isCorrectAnswer) {
                        //     const btnDontKnow = document.querySelector('.dont-know');
                        //     triggerClick(btnDontKnow);
                        // }
                    } else if (elapsedTime >= maxTime) {
                        console.log("Timed out waiting for the answer");
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

function waitForEnterPress(textAreaElement) {
    return new Promise((resolve) => {
        function onKeydown(event) {
            if (event.key === 'Enter') {
                textAreaElement.removeEventListener('keydown', onKeydown);  // Remove the listener once Enter is pressed
                resolve();
            }
        }
        textAreaElement.addEventListener('keydown', onKeydown);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
