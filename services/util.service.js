const cursorColors = ['#A8E6CE', '#DCEDC2', '#FFD3B5', '#FFAAA6', '#FF8C94', '#FAD02C', '#FFA384', '#74BDCB', '#EEB5EB', '#FBAA60', '#FBC490']

// Returns an array of values that are drawn randomly from given values array (meaning the same value won't appear twice in EACH call & SUBSEQUENT calls).
// - if you want the original values array to keep its' value and not be spliced with every function call, use getRandomValues.
/// NOTE : with enough calls your initial values array might run out of elements if not refilled at some point.
function getRandomValuesAndSplice(values, count = 2) {
    const randomValues = [];

    for (let i = 0; i < count; i++) {
        const numIdx = Math.floor(Math.random() * values.length);
        randomValues.push(values[numIdx])
        values.splice(numIdx, 1);
    }

    return randomValues;
}

function getRandomColor() {
    return getRandomValuesAndSplice(cursorColors, 1)[0];
}

module.exports = {
    getRandomColor
}