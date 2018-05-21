/**
 * Color utils
 *
 * Helper functions for color manipulation of pixels.
 *
 * @module lib/color_utils
 */
'use strict';

/**
 * Generates an array of three random integers between 0 and 255 to represent red, green and blue color.
 */
function getRandomRgbArray() {
    var color	= [];
    for (var i = 0; i < 3; i++) {
        color.push(Math.round(Math.random() * 255));
    }
    return color;
}
/**
 * Converts an array with three integers (0-255) into a hex color string
 *
 * @param {Array} rgbArray
 * @returns {String} hex color string
 */
function rgbArray2hex(rgbArray) {
    let hexArray = [];
    for (let i = 0; i < rgbArray.length; i++) {
        var hex = rgbArray[i].toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        hexArray.push(hex);
    }
    return "#" + hexArray.join("");
}

/**
 * Converts an hex color string into an array of integers (0-255) for red, green and blue.
 *
 * @param {String} hex
 * @returns {Array} rgb color
 */
function hex2RgbArray(hex){
    if(hex.charAt(0)!='#'){
        return [0,0,0];
    }
    let rgbArray = [];
    hex = hex.slice(1);
    for(let i = 0; i<3; i++){
        if(hex.length === 3){
            let c = hex.slice(i*1,i*1+1);
            c = c+c;
            rgbArray.push(parseInt(c,16));
        } else {
            rgbArray.push(parseInt(hex.slice(i*2,i*2+2),16));
        }
    }
    return rgbArray;
}

module.exports = {
    hex2RgbArray,
    rgbArray2hex,
    getRandomRgbArray
}