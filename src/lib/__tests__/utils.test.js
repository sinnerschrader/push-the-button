const { getDefaultState } = require('../../test-helper');
const {
    COLOR,
    copy,
    applyStates,
    resetState,
    stateShouldUpdate
} = require('../utils');

describe('utils', () => {
    describe('applyStates()', () => {
        test('ignores empty event state', () => {
            expect(applyStates(getDefaultState(), [])).toEqual(getDefaultState())
        });

        test('applies event state', () => {
            const preparedState = applyStates(getDefaultState(), [true, true, false]);
            expect(preparedState).toContainEqual({ x: 0, y: 0, pressed: true, color: COLOR.DEFAULT });
            expect(preparedState).toContainEqual({ x: 1, y: 0, pressed: true, color: COLOR.DEFAULT });
            expect(preparedState).toContainEqual({ x: 2, y: 0, pressed: false, color: COLOR.DEFAULT });
        });
    });

    describe('resetState()', () => {
        test('reset state for same length', () => {
            const defaultState = getDefaultState(4, 2);
            let modifiedState = copy(defaultState);

            modifiedState[0].color = 'red';
            expect(defaultState).not.toEqual(modifiedState);
            modifiedState = resetState(modifiedState);
            expect(modifiedState).toEqual(defaultState);
        });

        test('dies not mutate pressed state', () => {
            const defaultState = applyStates(getDefaultState(), [true, true, false]);
            let modifiedState = copy(defaultState);

            expect(defaultState).toEqual(modifiedState);
            modifiedState[0].color = 'green';
            expect(defaultState).not.toEqual(modifiedState);
            modifiedState = resetState(modifiedState);
            expect(modifiedState).toEqual(defaultState);
        });
    });

    describe('stateShouldUpdate()', () => {
        test('returns true if states are different', () => {
            const defaultState = getDefaultState();
            const modifiedState = applyStates(getDefaultState(), [true]);
            expect(stateShouldUpdate(defaultState, modifiedState)).toBeTruthy();
        });

        test('returns false if states are same', () => {
            const prevState = getDefaultState();
            const nextState = applyStates(getDefaultState(), [false]);
            expect(stateShouldUpdate(prevState, nextState)).toBeFalsy();
        });
    });
});
