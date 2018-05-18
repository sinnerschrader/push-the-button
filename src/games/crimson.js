/* eslint-disable */

'use strict';

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
};

let die;
let dead = false;
let paused = false;

let playerPosition = 13;
let playerColor = ['red','orange','olivedrab'];
let playerHealth = playerColor.length-1;
let leftPaddle = 12;
let rightPaddle = 15;
let leftPaddlePressed = false;
let rightPaddlePressed = false;

let eggX = 0;
let eggY = 0;
let eggAbsoluteY = 0;
let eggColor = 'crimson';

let speed = .025;
let acceleration = .005;

let time = 0;
let introDuration = 3000;


function updatePlayer(state){
    if(state[leftPaddle].pressed){
        !leftPaddlePressed && playerPosition--;
        leftPaddlePressed = true;
    } else if(state[rightPaddle].pressed){
        !rightPaddlePressed && playerPosition++;
        rightPaddlePressed = true;
    } else {
        leftPaddlePressed = rightPaddlePressed = false;
    }
    playerPosition = clamp(playerPosition,12,15);
}

function updateEgg(){
    eggAbsoluteY += speed;
    eggY = clamp(Math.floor(eggAbsoluteY),0,3);

    checkCollision();
};

function resetEgg(){
    eggColor = 'crimson';
    eggX = Math.floor(Math.random()*3);
    eggY = eggAbsoluteY = 0;
}

function pause(wait,callback){
    paused = true;
    setTimeout(function(){
        callback();
        paused = false;
    }, wait);
}

function hit(){
    playerHealth--;
    if(playerHealth<0){
        dead = true;
        pause(1000,die);
    } else{
        resetEgg();
    }
}

function checkCollision(){
    let eggPosition = eggX+(eggY*4);
    if(eggPosition==playerPosition){
        eggColor = 'green';
        speed += acceleration;
        pause(1000,resetEgg);
    } else if(eggY>=3){
        eggColor = 'red';
        pause(1000,hit);
    }
}

function update(state){
    state[playerPosition].color = playerColor[playerHealth];
    state[eggX+(eggY*4)].color = eggColor;

    if(dead){
        state.forEach(function(item){
            item.color = 'red';
        })
    }

    if(!paused){
        updateEgg();
        updatePlayer(state);
    }
}

module.exports = function (state, process, exit) {
    time += process;

    die = exit;

    if(introDuration>0){
        let blink = Math.floor(time/250)%2;
        state[leftPaddle].color = blink? 'olivedrab' : 'white';
        state[rightPaddle].color = blink? 'white' : 'olivedrab';
        introDuration -= process;
    } else {
        update(state);
    }

    return state;
};
