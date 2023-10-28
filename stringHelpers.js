
//  function calculateStringSimilarity(input, answer) {

//     // Convert both strings to lowercase for case-insensitive comparison
//     const lowerInput = input.toLowerCase().replace(/\s+/g, ' ');
//     const lowerAnswer = answer.toLowerCase().replace(/\s+/g, ' ');

//     const maxLength = Math.max(lowerInput.length, lowerAnswer.length);
//     if (maxLength === 0) return 100;
//     let common = 0;

//     for (let [i, j] = [0, 0]; j < maxLength; j++) {
//         if (lowerInput[i] === lowerAnswer[j]) {
//             common++;
//             i++;
//         }
//     }

//     const similarity = (common / maxLength) * 100;
//     return similarity;
// }

function calculateStringSimilarity(input, answer) {
    const lowerInput = input.toLowerCase().replace(/\s+/g, ' ');
    const lowerAnswer = answer.toLowerCase().replace(/\s+/g, ' ');

    const lenInput = lowerInput.length;
    const lenAnswer = lowerAnswer.length;

    const dp = Array(lenInput + 1).fill(null).map(() => Array(lenAnswer + 1).fill(0));

    // Calculate the length of the Longest Common Subsequence (LCS)
    for (let i = 1; i <= lenInput; i++) {
        for (let j = 1; j <= lenAnswer; j++) {
            if (lowerInput[i - 1] === lowerAnswer[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const lcsLength = dp[lenInput][lenAnswer];
    const maxLength = Math.max(lenInput, lenAnswer);
    const similarity = (lcsLength / maxLength) * 100;

    return similarity;
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

function stripHtmlTags(input) {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
}