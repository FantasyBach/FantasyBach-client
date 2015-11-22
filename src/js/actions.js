import { createAction } from 'redux-actions';
import Promise from 'bluebird';

export const LOAD_SEASONS = createAction('LOAD_SEASONS', () => {
    return Promise.resolve([

    ]);
});

export const LOAD_USER = createAction('LOAD_USER', seasonId => {
    return Promise.resolve([

    ]);
});

export const LOGIN = createAction('LOGIN', () => {
    return Promise.resolve([

    ]);
});

export const LOAD_CONTESTANTS = createAction('LOAD_CONTESTANTS', seasonId => {
    return Promise.resolve([

    ]);
});

export const LOAD_ROUNDS = createAction('LOAD_ROUNDS', seasonId => {
    return Promise.resolve([

    ]);
});

export const LOAD_ROLES = createAction('LOAD_ROLES', seasonId => {
    return Promise.resolve([

    ]);
});
