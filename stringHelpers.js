
function stripHtmlTags(input) {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
}

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

function getLCS(str1, str2) {
    const matrix = Array(str1.length + 1).fill(null).map(() => Array(str2.length + 1).fill(0));

    for (let i = 0; i <= str1.length; i++) {
        for (let j = 0; j <= str2.length; j++) {
            if (i === 0 || j === 0) {
                matrix[i][j] = 0;
            } else if (str1[i - 1] === str2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1] + 1;
            } else {
                matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
            }
        }
    }

    let i = str1.length, j = str2.length;
    const lcs = [];
    while (i > 0 && j > 0) {
        if (str1[i - 1] === str2[j - 1]) {
            lcs.unshift(str1[i - 1]);
            i--;
            j--;
        } else if (matrix[i - 1][j] > matrix[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    return lcs.join('');
}


function highlightDifferences(answer, userAnswer) {
    const lcs = getLCS(answer, userAnswer);
    let lcsIndex = 0;
    const result = [];

    for (let char of userAnswer) {
        if (lcsIndex < lcs.length && char === lcs[lcsIndex]) {
            result.push(`<span style="color:green;">${char}</span>`);
            lcsIndex++;
        } else {
            result.push(`<span style="color:red;">${char}</span>`);
        }
    }

    return result.join('');
}


const wordsAndTestCases = {

    "Indonesia": [
        "Indoonneesia",
        "Indopnesia",
        "IndonXesia",
        "IXndonesia",
        "Idnonesia",
        "Inodnesia",
        "donesia",
        "Indones",
        "IdnonesXia",
        "IndoXnesiY",
        "IXdoonesia",
        "IndonesiaIndonesia",
        "IndoneIndonesia",
        "InXYZesia",
        "iNDoNesia",
        "INDONESia",
        "IndONeSiA",
        "InDoPNesia"
    ],
    "Universe": [
        "Un1verse",
        "Univese",
        "Uinverse",
        "Univeres",
        "Univrse",
        "UUniverse",
        "UniveUniverse",
        "UnivXYZerse",
        "UnivErse",
        "UNIVERSe",
        "UnIVErSE",
        "UniVepRse"
    ],
    "Galaxy": [
        "Galaxxy",
        "Gaaxy",
        "Glaxy",
        "Galax",
        "Galayx",
        "GGalaxy",
        "GalaGalaxy",
        "GalXYZaxy",
        "GaLaXy",
        "GALAXy",
        "GAlAXY",
        "GAlaXyY"
    ],
    "Phenomenon": [
        "Phenomenonn",
        "Pheomenon",
        "Phenomnon",
        "Phenomeno",
        "Phenonemon",
        "PPhenomenon",
        "PhenoPhenomenon",
        "PhenomXYZenon",
        "PHeNOMeNon",
        "PHENOMENOn",
        "PHenOMeNON",
        "PhenOMeNoNn"
    ],
    "Spectacular": [
        "Specttacular",
        "Spectaular",
        "Spctacular",
        "Spectculr",
        "Spectaculr",
        "SSpectacular",
        "SpectaSpectacular",
        "SpectacXYZular",
        "SPecTACUlar",
        "SPECTACULAr",
        "SpECTAcULAR",
        "SpecTAcuLArR"
    ]
};

for (const [word, testCases] of Object.entries(wordsAndTestCases)) {
    for (const testCase of testCases) {
        console.log(`word: ${word} case: ${testCase} -> `);
        console.log(highlightDifferences(word, testCase));
        console.log('----------');
    }
    console.log('====================');
}
