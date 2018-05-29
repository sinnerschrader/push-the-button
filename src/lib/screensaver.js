'use strict';

let cState = [];
let initialized = false;
let introDuration = false;
const INTRO_DURATION = 1000;
const MAX_TIME = Number.MAX_SAFE_INTEGER;
let isAnimating = false;
let targetColor;
let currentColor;
let speed = [];
let buttonIndex;
let time;

function getRandomButtonIndex(){
    return Math.round(Math.random() * 15);
}

function getRandomRgbArray() {
    let color = [];
    for (var i = 0; i < 3; i++) {
        color.push(Math.round(Math.random() * 255));
    }
    return color;
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
            if (color[i] > 0) {
                color[i] -= 1;
            }
        }
    });
}

function init(state){
    time = 0;
    introDuration = INTRO_DURATION;
    cState = [];
    state.forEach(function(button,index){
        button.color = 'rgb(0,0,0)';
        cState[index] = [0,0,0];
    });
}

module.exports = function (state, process, exit) {
    time+=process;
    if(time>= MAX_TIME){
        time = 0;
    }
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
        let color =  cState[index];
        item.color = `rgb(${color[0]},${color[1]},${color[2]})`;
    });

    if(!state.every((item) => !item.pressed)){
        init(state);
        exit();
    }

    return state;
};
