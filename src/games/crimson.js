'use strict';

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

let die;
let initialized = false;
let dead = false;
let paused = false;

const PLAYER_COLOR = ['red','orange','olivedrab'];
let playerHealth;
let playerPosition;
const LEFT_PADDLE = 12;
const RIGHT_PADDLE = 15;
let leftPaddlePressed = false;
let rightPaddlePressed = false;

let eggX;
let eggY;
let eggAbsoluteY;
let eggColor;

const INITAL_SPEED = .025;
let speed = INITAL_SPEED;
const ACCELERATION = .005;

const INTRO_DURATION = 3000;
let introDuration = INTRO_DURATION;


function updatePlayer(state){
    if(state[LEFT_PADDLE].pressed){
        !leftPaddlePressed && playerPosition--;
        leftPaddlePressed = true;
    } else if(state[RIGHT_PADDLE].pressed){
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
}

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
        pause(1000,function(){
            die();
            init();
        });
    }
    resetEgg();
}

function checkCollision(){
    let eggPosition = eggX+(eggY*4);
    if(eggPosition==playerPosition){
        eggColor = 'green';
        speed += ACCELERATION;
        pause(1000,resetEgg);
    } else if(eggY>=3){
        eggColor = 'red';
        pause(1000,hit);
    }
}

function update(state){
    state[playerPosition].color = PLAYER_COLOR[playerHealth];
    state[eggX+(eggY*4)].color = eggColor;

    if(dead){
        state.forEach(function(item){
            item.color = 'red';
        })
    }

    if(!paused && !dead){
        updateEgg();
        updatePlayer(state);
    }
}

function init(){
    dead = false;
    speed = INITAL_SPEED;
    playerHealth = PLAYER_COLOR.length-1;
    playerPosition = 13;
    introDuration = INTRO_DURATION;
    resetEgg();
}

module.exports = function (state, process, exit) {
    die = exit;

    if(!initialized){
        init();
        initialized = true;
    }

    if(introDuration>0){
        let blink = Math.floor(introDuration/250)%2;
        state[LEFT_PADDLE].color = blink? 'olivedrab' : 'white';
        state[RIGHT_PADDLE].color = blink? 'white' : 'olivedrab';
        introDuration -= process;
    } else {
        update(state);
    }

    return state;
};
