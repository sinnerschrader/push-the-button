'use strict';

let cState = [];
let initialized = false;
let introDuration = false;
const INTRO_DURATION = 1000;
let isAnimating = false;
let targetColor;
let currentColor;
let speed = [];
let buttonIndex;

function getRandomButtonIndex(){
    return Math.round(Math.random() * 15);
}

function getRandomRgbArray() {
    var color	= [];
    for (var i = 0; i < 3; i++) {
        color.push(Math.round(Math.random() * 255));
    }
    return color;
}

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

function transition(){
    isAnimating = true;
    for(let i = 0; i < 3; i++){
        if (currentColor[i] > targetColor[i]) {
            currentColor[i] -= speed[i];
            if (currentColor[i] <= targetColor[i]) {
                speed[i] = 0;
            }
        } else {
            currentColor[i] += speed[i];
            if (currentColor[i] >= targetColor[i]) {
                speed[i] = 0;
            }
        }
    }
    cState[buttonIndex] = currentColor;
    if(speed[0]+speed[1]+speed[2] === 0){
        isAnimating = false;
    }
}

function dim(){
    cState.forEach(function(color){
        for(let i = 0; i < 3; i++){
            if (color[i] > 1) {
                color[i] -= 1;
            }
        }
    });
}

function init(state){
    introDuration = INTRO_DURATION;
    cState = [];
    state.forEach(function(button,index){
        button.color = '#000000';
        cState[index] = hex2RgbArray(button.color);
    });
}

module.exports = function (state, process, exit) {
    if(!initialized){
        init(state);
        initialized = true;
    }

    if(introDuration>0){
        introDuration -= process;
        return;
    }

    if(!isAnimating){
        speed = [5,5,5];
        targetColor = getRandomRgbArray();
        buttonIndex = getRandomButtonIndex();
        currentColor = cState[buttonIndex];
    }
    transition();
    dim();

    state.forEach(function(item,index){
        item.color = rgbArray2hex(cState[index]);
    });

    if(!state.every((item) => !item.pressed)){
        init(state);
        exit();
    }

    return state;
};