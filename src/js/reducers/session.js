import update from 'react-addons-update';
import { handleActions } from 'redux-actions';
import findLast from 'lodash/collection/findLast';

const initialState = {
    user: null,
    season: 1,
    round: null,
    leagues: [
        { id: null, name: "Global League" }
    ],
    league: null,
    session: null
};

export default handleActions({

    FACEBOOK_LOGIN: {
        next(state, action) {
            console.log("facebook_login", action.payload);
            return update(state, {
                session: { $set: action.payload }
            });
        }
    },

    LOAD_USER: {
        next(state, action) {
            if (!action.payload.picks) action.payload.picks = {};
            return update(state, {
                user: { $set: action.payload }
            });
        }
    },

    LOAD_ROUNDS: {
        next(state, action) {
            const rounds = action.payload;
            const now = new Date();

            let defaultRound = rounds[0].id;
            rounds.forEach((round, i) => {
                if (!i) return;
                if (new Date(rounds[i - 1].endVoteLocalDateTime) < now) {
                    defaultRound = round.id;
                }
            });

            return update(state, {
                round: { $set: defaultRound },
                user: { picks: { $set: rounds.reduce((memo, round) => {
                    memo[round.id] = state.user.picks[round.id] || {};
                    return memo;
                }, {}) } }
            });
        }
    },

    LOAD_LEAGUES: {
        next(state, action) {
            console.log(action.payload);
            return update(state, {
                leagues: { $push: action.payload }
            });
        }
    },

    PICK_CONTESTANT: {
        next(state, action) {
            const [roundId, roleId, id] = action.meta;
            return update(state, {
                user: { picks: { [roundId]: { [roleId]: { $set: {
                    contestantId: id
                } } } } }
            });
        }
    },

    UNPICK_CONTESTANT: {
        next(state, action) {
            const [roundId, roleId] = action.meta;
            return update(state, {
                user: { picks: { [roundId]: { [roleId]: { $set: undefined } } } }
            });
        }
    },

    CHANGE_ROUND: {
        next(state, action) {
            const [id] = action.meta;
            return update(state, {
                round: { $set: id }
            })
        }
    },

    CHANGE_LEAGUE: {
        next(state, action) {
            const [id] = action.meta;
            return update(state, {
                league: { $set: id }
            })
        }
    }
}, initialState);
