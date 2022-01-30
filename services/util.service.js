const cursorColors = ['#e4424e', '#ff8882', '#f497ef', '#a34fdc', '#457fe4', '#58c0d3', '#42cb96', '#99cb4d', '#FAD02C', '#ffb480', '#c38b56'];

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
    if (!cursorColors.length) cursorColors = ['#e4424e', '#ff8882', '#f497ef', '#a34fdc', '#457fe4', '#58c0d3', '#42cb96', '#99cb4d', '#FAD02C', '#ffb480', '#c38b56',];
    return getRandomValuesAndSplice(cursorColors, 1)[0];
}

module.exports = {
    getRandomColor
}