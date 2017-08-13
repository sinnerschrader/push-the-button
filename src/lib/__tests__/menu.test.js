'use strict';

jest.mock('fs');

const path = require('path');
const { getDefaultState } = require('../../test-helper');

const TICK_RATE = 15;

describe('menu', () => {
    const GAME_ONE = 'green';
    const GAME_TWO = 'yellow';
    const gamePath = path.resolve(__dirname, '..', '..', 'games');
    const MOCK_FILE_INFO = {
        [path.resolve(gamePath, `${GAME_ONE}.js`)]: '...',
        [path.resolve(gamePath, `${GAME_TWO}.js`)]: '...',
    };

    beforeEach(() => require('fs').__setMockFiles(MOCK_FILE_INFO));

    test('shows available games', () => {
        const menu = require('../menu');
        const menuState = menu(getDefaultState());

        expect(menuState).toContainEqual({ x: 0, y: 0, pressed: false, color: GAME_ONE });
        expect(menuState).toContainEqual({ x: 1, y: 1, pressed: false, color: GAME_TWO });
    });

    test('can select a game', () => {
        const menu = require('../menu');
        const menuState = menu(getDefaultState(), TICK_RATE);

        // Enter the game
        menuState[5].pressed = true;
        let gameState = menu(menuState, TICK_RATE);

        // Reset the press for game select
        menuState[5].pressed = false;
        gameState = menu(gameState, TICK_RATE);

        expect(gameState).toEqual(getDefaultState());
    });

    test('can exit/reset games', () => {
        const menu = require('../menu');
        const menuState = menu(getDefaultState(), TICK_RATE);

        // Enter the game
        menuState[5].pressed = true;
        let gameState = menu(menuState, TICK_RATE);

        // Reset the press for game select
        menuState[5].pressed = false;
        gameState = menu(gameState, TICK_RATE);

        // Game is selected
        expect(gameState).toEqual(getDefaultState());

        // Press reset buttons
        menuState[0].pressed = true;
        menuState[menuState.length - 1].pressed = true;

        // Wait for reset sequence
        gameState = menu(gameState, 3000);

        // Stop reset sequence press
        menuState[0].pressed = false;
        menuState[menuState.length - 1].pressed = false;
        gameState = menu(gameState, TICK_RATE);

        expect(gameState).toContainEqual({ x: 0, y: 0, pressed: false, color: GAME_ONE });
        expect(gameState).toContainEqual({ x: 1, y: 1, pressed: false, color: GAME_TWO });
    });
});
