import { createAction } from 'redux-actions';
import Promise from 'bluebird';
import createFacebook from './facebook';
import sdk from 'fantasybach-sdk';

let client = sdk.newClient();
let fb = null;
const seasonId = '100905a6-90d7-11e5-8994-feff819cdc9f';

export const INIT_FACEBOOK = createAction('INIT_FACEBOOK', () => {
    return createFacebook().then(f => fb = f);
});

export const FACEBOOK_LOGIN = createAction('FACEBOOK_LOGIN', () => {
    return fb.login()
        .then(function(response) {
            return client.login({token : response.accessToken});
        }).get('data')
        .then(function(response) {
            client = sdk.newClient({
                accessKey: response.accessKey,
                secretKey: response.secretKey,
                sessionToken: response.sessionToken
            })
        });
});

export const LOAD_SEASONS = createAction('LOAD_SEASONS', () => {
    return Promise.resolve([
        {
            id: 1,
            icon: 'https://robohash.org/bachelor.jpg?bgset=bg2',
            roundIds: [
                "55baf478-90ec-11e5-8994-feff819cdc9f",
                "bfcf0ace-90ed-11e5-8994-feff819cdc9f",
                "d26400ea-90ed-11e5-8994-feff819cdc9f"
            ]
        }
    ]);
});

export const LOAD_USER = createAction('LOAD_USER', seasonId => {
    return Promise.resolve(client.getCurrentUser({ seasonId })).get('data');
});

export const LOAD_CONTESTANTS = createAction('LOAD_CONTESTANTS', () => {
    return Promise.resolve(client.getContestants({ seasonId })).get('data');
});

export const LOAD_ROUNDS = createAction('LOAD_ROUNDS', () => {
    return Promise.resolve(client.getRounds({ seasonId })).get('data');
});

export const LOAD_ROLES = createAction('LOAD_ROLES', () => {
    return Promise.resolve(client.getRoles({ seasonId })).get('data');
});

export const PICK_CONTESTANT = createAction('PICK_CONTESTANT', (roundId, roleId, contestantId) => {
    return Promise.resolve(client.postPick({ seasonId, roundId }, { roleId, contestantId })).get('data');
}, meta);

export const UNPICK_CONTESTANT = createAction('UNPICK_CONTESTANT', (roundId, roleId, contestantId) => {
    return Promise.resolve(client.deletePick({ seasonId, roundId }, { roleId, contestantId })).get('data');
}, meta);

export const LOAD_LEAGUES = createAction('LOAD_LEAGUES', () => {
    return fb.getLeagues();
});

export const CREATE_LEAGUE = createAction('CREATE_LEAGUE', () => {
    return fb.createGroup();
});

export const CHANGE_ROUND = createAction('CHANGE_ROUND', id => {

}, meta);

export const CHANGE_LEAGUE = createAction('CHANGE_LEAGUE', id => {

}, meta);

export const LOAD_MEMBERS = createAction('LOAD_MEMBERS', id => {
    return fb.getMembers(id)
        .then(members => client.getUsersById({
            seasonId: seasonId,
            ids: members.map(user => user.id)
        }));
});

function meta(...args) {
    return args;
}
