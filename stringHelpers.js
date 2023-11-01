
function stripHtmlTags(input) {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
}

function calculateStringSimilarity(input, answer) {
    const lowerInput = sanitizeString(input);
    const lowerAnswer = sanitizeString(answer);

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

function sanitizeString(input) {
    return input.toLowerCase().replace(/\s+/g, '').replaceAll('\'', '"');
}

// This function isnt perfect but it should work in most cases.
function getMatchingSequences(str1, str2) {
    let findLongestSubsequence = function (s1, s2) {
        let maxLen = 0;
        let endIndex1 = 0;
        let endIndex2 = 0;

        const dp = Array(s1.length + 1).fill(0).map(() => Array(s2.length + 1).fill(0));

        for (let i = 1; i <= s1.length; i++) {
            for (let j = 1; j <= s2.length; j++) {
                if (s1[i - 1] === s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    if (dp[i][j] > maxLen) {
                        maxLen = dp[i][j];
                        endIndex1 = i;
                        endIndex2 = j;
                    }
                } else {
                    dp[i][j] = 0;
                }
            }
        }

        return maxLen === 0 ? null : {
            match: s1.substring(endIndex1 - maxLen, endIndex1),
            index1: endIndex1 - maxLen,
            index2: endIndex2 - maxLen,
            length: maxLen
        };
    };

    let recursiveFind = function (s1, s2, offset1, offset2) {
        const match = findLongestSubsequence(s1, s2);
        if (!match) return [];

        match.index1 += offset1;
        match.index2 += offset2;

        const beforeStr1 = s1.substring(0, match.index1 - offset1);
        const beforeStr2 = s2.substring(0, match.index2 - offset2);

        const afterStr1 = s1.substring(match.index1 + match.length - offset1);
        const afterStr2 = s2.substring(match.index2 + match.length - offset2);

        return [
            ...recursiveFind(beforeStr1, beforeStr2, offset1, offset2),
            match,
            ...recursiveFind(afterStr1, afterStr2, match.index1 + match.length, match.index2 + match.length)
        ];
    };
    str1 = sanitizeString(str1);
    str2 = sanitizeString(str2);

    return recursiveFind(str1, str2, 0, 0).sort((a, b) => a.index2 - b.index2);
}

function highlightDifferences(answer, userAnswer) {
    const matches = getMatchingSequences(answer, userAnswer);

    const resultDiv = document.createElement('div');
    let uIdx = 0;

    for (const match of matches) {
        // Handle the mismatched segment before the match
        if (match.index2 > uIdx) {
            let span = document.createElement('span');
            span.style.color = 'red';
            span.textContent = userAnswer.slice(uIdx, match.index2);
            resultDiv.appendChild(span);
        }

        // Handle the matched segment
        let matchSpan = document.createElement('span');
        matchSpan.style.color = 'green';
        matchSpan.textContent = match.match;
        resultDiv.appendChild(matchSpan);

        // Move the pointers
        uIdx = match.index2 + match.length;
    }

    // Handle any remaining mismatched segment in the userAnswer
    if (uIdx < userAnswer.length) {
        let span = document.createElement('span');
        span.style.color = 'red';
        span.textContent = userAnswer.slice(uIdx);
        resultDiv.appendChild(span);
    }

    return resultDiv;
}
