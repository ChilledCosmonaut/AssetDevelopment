function random()  {
    return Math.random();
};

// Float
function randomRange(min, max) {
    return random() * (max - min) + min;
};

// Int
function randomRangeInt(min, max){
    let int = Math.round(randomRange(min, max));
    return int;
};

// Color
let Colors = {
    beige: "#f5f5dc",
    black: "#000000",
    brown: "#a52a2a",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkred: "#8b0000",
    gold: "#ffd700",
    khaki: "#f0e68c",
    lightgrey: "#d3d3d3",
    maroon: "#800000",
    olive: "#808000",
    silver: "#c0c0c0",
    white: "#ffffff"
};

function randomColor() {
    var result;
    var count = 0;
    for (var prop in Colors)
        if (random() < 1/++count)
           result = prop;
    return result;
};

export {randomRange, randomRangeInt, randomColor}