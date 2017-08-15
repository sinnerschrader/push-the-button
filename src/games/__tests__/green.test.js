'use strict';

const { runGame, getDefaultState } = require('../../test-helper');
const game = require('../green');

describe('game: yellow', () => {
    test('returns state', () => {
        expect(runGame(game).next().value).toEqual(getDefaultState());
    });
});
