import color from "color";

export function createRandomHex() {
    return `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
}

// based on http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
let hue = Math.random();
const goldenRatio = 0.618033988749895;

export function createRandomColor() {
    hue += goldenRatio;
    hue %= 1;

    const saturation = 0.5;
    const value = 0.95;

    return color({
        h: hue * 360,
        s: saturation * 100,
        v: value * 100,
    });
}
