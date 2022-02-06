let cursorColors = ['#e4424e', '#ff8882', '#f497ef', '#a34fdc', '#457fe4', '#58c0d3', '#42cb96', '#99cb4d', '#FAD02C', '#ffb480', '#c38b56'];


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
    if (!cursorColors.length) cursorColors = ['#e4424e', '#ff8882', '#f497ef', '#a34fdc', '#457fe4', '#58c0d3', '#42cb96', '#99cb4d', '#FAD02C', '#ffb480', '#c38b56'];
    return getRandomValuesAndSplice(cursorColors, 1)[0];
}


module.exports = {
    getRandomColor
}