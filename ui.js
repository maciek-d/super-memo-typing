function createUI() {
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

    floatingDiv.appendChild(textAreaElement);

    floatingDiv.style.position = 'fixed';
    const width = 330;
    const height = 125;

    floatingDiv.style.top = `calc(85% - ${height / 2}px)`;
    floatingDiv.style.left = `calc(50% - ${width / 2}px)`;
    floatingDiv.style.padding = '10px';
    floatingDiv.style.zIndex = '9999';
    floatingDiv.style.border = '1px solid black';
    floatingDiv.style.borderRadius = '5px';
    floatingDiv.style.cursor = 'move';
    floatingDiv.style.opacity = '0.9';

    document.body.appendChild(floatingDiv);

    return { floatingDiv, textAreaElement, answerDiv };
}