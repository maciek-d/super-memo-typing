const floatingDiv = document.createElement('div');
const answerDiv = document.createElement('div');
answerDiv.style.visibility = 'hidden';
answerDiv.style.height = '0px';
floatingDiv.appendChild(answerDiv);

const textAreaElement = document.createElement('textarea');
textAreaElement.placeholder = 'Type your answer and press Enter to submit (ctr for new line)';
textAreaElement.id = 'answerArea';
textAreaElement.style.width = '100%';
textAreaElement.style.height = '100px';

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
                    // if (similarityPercentage === 100) {
                    //     const btnKnow = document.querySelector('.know');
                    //     triggerClick(btnKnow);
                    // }
                    const highlightAnswer = highlightDifferences(answer, userAnswer);
                    textAreaElement.style.height = '0px';
                    answerDiv.style.height = '100px';
                    answerDiv.style.visibility = 'visible';
                    answerDiv.innerHTML = `${answer} <br/>${highlightAnswer} <br/>similarity ${similarityPercentage.toFixed(2)}%`;
                    await waitForEnterPress();
                    answerDiv.style.height = '0px';
                    textAreaElement.style.height = '100px';

                    // todo display the answer if it was wrong and next button 
                    // mark the characters that dont match with red

                    // else if (similarityPercentage >= 93) {
                    //     const btnAlmostKnow = document.querySelector('.almost');
                    //     triggerClick(btnAlmostKnow);
                    // } else {
                    //     const btnDontKnow = document.querySelector('.dont-know');
                    //     // possibly sleep? or do nothing
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

floatingDiv.appendChild(textAreaElement);

floatingDiv.style.position = 'fixed';
const width = 330;
const height = 125;

// Calculate the initial top and left positions
floatingDiv.style.top = `calc(85% - ${height / 2}px)`;
floatingDiv.style.left = `calc(50% - ${width / 2}px)`;
floatingDiv.style.padding = '10px';
floatingDiv.style.zIndex = '9999';
floatingDiv.style.border = '1px solid black';
floatingDiv.style.borderRadius = '5px';
floatingDiv.style.cursor = 'move';
floatingDiv.style.opacity = '0.9';

document.body.appendChild(floatingDiv);


function stripHtmlTags(input) {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
}

const triggerClick = (element) => {
    if (element && "click" in element) {
        element.click();
    }
};

let isDragging = false;
let offsetX, offsetY;

// Mouse down event handler to start dragging
floatingDiv.addEventListener('mousedown', (e) => {
    const rect = floatingDiv.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    const borderWidth = 10; // 10px boundary for dragging

    // Check if the click happened within 10px of the border
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

// Mouse move event handler to update the position while dragging
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        floatingDiv.style.left = e.clientX - offsetX + 'px';
        floatingDiv.style.top = e.clientY - offsetY + 'px';
    }
});

// Mouse up event handler to stop dragging
document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
    }
    floatingDiv.style.opacity = '0.9';
});


function waitForEnterPress() {
    return new Promise((resolve) => {
        function onKeydown(event) {
            if (event.key === 'Enter') {
                floatingDiv.removeEventListener('keydown', onKeydown);  // Remove the listener once Enter is pressed
                resolve();
            }
        }
        floatingDiv.addEventListener('keydown', onKeydown);
    });
}

function highlightDifferences(answer, userAnswer) {
    let result = '';
    let aIdx = 0;
    let uIdx = 0;

    while (uIdx < userAnswer.length) {
        if (aIdx < answer.length && answer[aIdx] === userAnswer[uIdx]) {
            // Match found
            let match = '';
            while (aIdx < answer.length && uIdx < userAnswer.length && answer[aIdx] === userAnswer[uIdx]) {
                match += userAnswer[uIdx];
                aIdx++;
                uIdx++;
            }
            result += '<span style="color:green;">' + match + '</span>';
        } else {
            // Mismatch found
            let mismatch = '';
            while (uIdx < userAnswer.length && (aIdx >= answer.length || answer[aIdx] !== userAnswer[uIdx])) {
                mismatch += userAnswer[uIdx];
                uIdx++;
            }
            result += '<span style="color:red;">' + mismatch + '</span>';
        }
    }

    return result;
}
