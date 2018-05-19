'use strict';

let initialised = false;
let die;
const INTRO_DURATION = 1000;
let introDuration;
const END_DURATION = 5000;

let sequence = []; // store the sequence to be repeated
let mimicStep = 0; // step of the repetition
let activePlayer; // true: upper half / false: lower half
let firstPlayer; // true: upper half / false: lower half
let buttonPressed = false;
let wasButtonPressed; // previous cycles buttonPressed
let endTurn = false; // end players turn?
let dead = false; // player pushed the wrong button

const COLORS = [
    '#FF0000',
    '#0000FF',
    '#FF9900',
    '#FF00FF',
    '#00FFFF',
    '#00FF00',
    '#AA00FF',
    '#FFFF00'
];

function buttonReducer(tally, item){
    tally.pressed = tally.pressed || item.pressed;
    return tally;
}

function isValidButton(buttonIndex, player){
    if(player){
        return buttonIndex<8;
    } else {
        return buttonIndex>=8;
    }
}
function getButtonColor(index, pressed){
    let color = index<8? COLORS[index] : COLORS[15-index];
    if(pressed){ // this button pressed
        return color;
    }
    if(buttonPressed){ // other button pressed
        return 'black';
    }
    if(activePlayer!=undefined && !isValidButton(index, activePlayer)){ // not your turn
        return 'black';
    }
    return color; // your turn
}

function fault(){
    dead = true;
    setTimeout(function(){
        die();
        init();
    }, END_DURATION);
}

function init(){
    introDuration = INTRO_DURATION;
    activePlayer = firstPlayer = undefined;
    wasButtonPressed = undefined;
    sequence = [];
    mimicStep = 0;
    dead = false;
}

function update(state){
    state.forEach(function(button, index){
        if(dead){
            button.color = (activePlayer && index<8)? 'red' : 'black';
            return;
        }
        button.color = getButtonColor(index, button.pressed);

        if(button.pressed && !buttonPressed){ // O_o debouncing button press

            if(firstPlayer === undefined){ // first move
                activePlayer = firstPlayer = index<8;
                sequence.push(index);
                endTurn = true;
            } else if(firstPlayer != activePlayer && index>=8){ // second players turn
                // compare to sequence
                if(index != 15-sequence[mimicStep]){
                    fault();
                }
                mimicStep++;
                // made it to the end of the sequence?
                if(mimicStep === sequence.length){
                    endTurn = true;
                }

            } else if(firstPlayer === activePlayer){ // first players turn
                if(mimicStep < sequence.length){
                    // regular steps need to be compared to sequence
                    if(index != sequence[mimicStep]){
                        fault();
                    }
                    mimicStep++;
                } else { // first player gets to add one more to the sequence
                    sequence.push(index);
                    endTurn = true;
                }

            }
        }
    });

    buttonPressed = state.reduce(buttonReducer).pressed;
    if(!buttonPressed && wasButtonPressed){ // button was released
        if(endTurn){ // next player
            mimicStep = 0;
            activePlayer = !activePlayer;
            endTurn = false;
        }
    }
    wasButtonPressed = buttonPressed;

}

module.exports = function (state, process, exit) {
    die = exit;
    if(!initialised){
        init();
        initialised = true;
    }

    if(introDuration>0){
        introDuration -= process;
        let limit = Math.floor(introDuration/(INTRO_DURATION/9));
        for(let i = 8; i>limit; i--){
            state[i].color = getButtonColor(i, false);
            state[15-i].color = getButtonColor(i, false);
        }
        state
    } else {
        update(state);
    }

    return state;
};
