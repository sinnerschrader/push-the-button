'use strict';

const { runGame, getDefaultState } = require('../../test-helper');
const game = require('../yellow');

describe('game: yellow', () => {
    test('returns state', () => {
        expect(runGame(game).next().value).toEqual(getDefaultState());
    });

    test('returns to menu after 5000 milliseconds', () => {
        let index = Math.round(5000 / 16);

        while (index > 0) {
            index--;
            runGame(game).next();
        }

        expect(runGame(game).next().value).toEqual(getDefaultState());
    });
});
