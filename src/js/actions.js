import { createAction } from 'redux-actions';
import Promise from 'bluebird';
import Facebook from './facebook';

export const FACEBOOK_LOGIN = createAction('FACEBOOK_LOGIN', () => {
    return Promise.resolve([
        {
            accessToken: "CAAEXlZB7tJc4BAFQZCt0gOk4hDKAzky2lNPLCHj0AJGXtuQTGIkFRkRHhdvQgFB38RwwMb7ZBGumvKAVunrrqEUIrRW7JLTA3NQKxRuYZAlswiZAwlz6n1Geana8Du9GfCaEmUgZAJRF3u7TRac8YDjQTBeKhcxNMuuFB6GjHreOYqgZCm2Qmw0ZBienmjtR3wFUyYf9VwDc5pOZArNeljxA3",
            userID: "726777167"
        }
    ]);
});

export const LOAD_SEASONS = createAction('LOAD_SEASONS', () => {
    return Promise.resolve([
        {
            id: 1,
            icon: 'https://robohash.org/bachelor.jpg?bgset=bg2',
            roundIds: [1,2]
        }
    ]);
});

export const LOAD_USER = createAction('LOAD_USER', seasonId => {
    return Promise.resolve({
        id: 1,
        name: "User",
        nickname: "The Example User - dun dun dunnnnn",
        profilePic: 'https://robohash.org/user.jpg?bgset=bg2',
        score: 10,
        leagueIds: [1],
        picks: {
            1: {
                1: {
                    contestantId: 1,
                    score: 1,
                    multiplier: 1
                },
                2: {
                    contestantId: 2,
                    score: 1,
                    multiplier: 1
                }
            },
            2: {
                4: {
                    contestantId: 2,
                    score: null,
                    multiplier: null
                }
            }
        }
    });
});

export const LOAD_CONTESTANTS = createAction('LOAD_CONTESTANTS', seasonId => {
    return Promise.resolve([
        {
            id: 1,
            name: "Tore",
            images: {
                large: 'https://robohash.org/tore.jpg?bgset=bg2'
            },
            bioStats: [
                { name: "", value: "" },
                { name: "", value: "" },
                { name: "", value: "" }
            ],
            bioQuestions: [
                { question: "", value: "" },
                { question: "", value: "" },
                { question: "", value: "" }
            ],
            roundResults: {
                1: [],
                2: [],
                3: []
            }
        },
        {
            id: 2,
            name: "Mitch",
            images: {
                large: 'https://robohash.org/mitch.jpg?bgset=bg2'
            },
            bioStats: [
                { name: "", value: "" },
                { name: "", value: "" },
                { name: "", value: "" }
            ],
            bioQuestions: [
                { question: "", value: "" },
                { question: "", value: "" },
                { question: "", value: "" }
            ],
            roundResults: {
                1: [],
                2: []
            }
        }
    ]);
});

export const LOAD_ROUNDS = createAction('LOAD_ROUNDS', seasonId => {
    return Promise.resolve([
        {
            id: 1,
            index: 1,
            eligibleContestantIds: [1,2],
            rosterSize: 2,
            startVoteLocalDateTime: "",
            endVoteLocalDateTime: "",
            roundEndLocalDateTime: "",
            availableRoleIds: [1,2,3,4,5,6]
        },
        {
            id: 2,
            index: 2,
            eligibleContestantIds: [1,2],
            rosterSize: 2,
            startVoteLocalDateTime: "",
            endVoteLocalDateTime: "",
            roundEndLocalDateTime: "",
            availableRoleIds: [1,2,3,4,5,6]
        }
    ]);
});

export const LOAD_ROLES = createAction('LOAD_ROLES', seasonId => {
    return Promise.resolve([
        {
            id: 1,
            name: "Bleeper",
            verbName: "Swearwords",
            description: "10 points every time they swear."
        },
        {
            id: 2,
            name: "Lover",
            verbName: "'Love's",
            description: "<3 points every time they say the word 'love'."
        },
        {
            id: 3,
            name: "Stealer",
            verbName: "'Love's",
            description: "<3 points every time they say the word 'love'."
        },
        {
            id: 4,
            name: "Interviewer",
            verbName: "'Love's",
            description: "<3 points every time they say the word 'love'."
        },
        {
            id: 5,
            name: "Cryer",
            verbName: "'Love's",
            description: "<3 points every time they say the word 'love'."
        },
        {
            id: 6,
            name: "Kisser",
            verbName: "'Love's",
            description: "<3 points every time they say the word 'love'."
        }
    ]);
});

export const PICK_CONTESTANT = createAction('PICK_CONTESTANT', (roundId, roleId, contestantId) => {
    return Promise.resolve(null);
}, meta);

export const UNPICK_CONTESTANT = createAction('UNPICK_CONTESTANT', (roundId, roleId) => {
    return Promise.resolve(null);
}, meta);


function meta(...args) {
    return args;
}
