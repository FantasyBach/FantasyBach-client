import { createAction } from 'redux-actions';
import Promise from 'bluebird';

export const LOAD_SEASONS = createAction('LOAD_SEASONS', () => {
    return Promise.resolve([

    ]);
});

export const LOAD_USER = createAction('LOAD_USER', seasonId => {
    return Promise.resolve([
        {
            id: 1,
            name: "User",
            nickname: "The Example User - dun dun dunnnnn",
            profilePic: "url.png",
            score: 10,
            leagueIds: [1],
            picks: {
                1: [
                    {
                        contestantId: 1,
                        roleId: 1,
                        score: 1,
                        multiplier: 1
                    },
                    {
                        contestantId: 2,
                        roleId: 2,
                        score: 1,
                        multiplier: 1
                    }
                ],
                2: []
            }
        }
    ]);
});

export const LOGIN = createAction('LOGIN', () => {
    return Promise.resolve([
        {
            id: 1,
            name: "User",
            nickname: "The Example User - dun dun dunnnnn",
            profilePic: "url.png",
            score: 10,
            leagueIds: [1],
            picks: {
                1: [
                    {
                        contestantId: 1,
                        roleId: 1,
                        score: 1,
                        multiplier: 1
                    },
                    {
                        contestantId: 2,
                        roleId: 2,
                        score: 1,
                        multiplier: 1
                    }
                ],
                2: []
            }
        }
    ]);
});

export const LOAD_CONTESTANTS = createAction('LOAD_CONTESTANTS', seasonId => {
    return Promise.resolve([
        {
            id: 1,
            name: "Tore",
            images: {
                large: 'url.png'
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
                large: 'url.png'
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
            index: 0,
            eligibleContestantIds: [1,2],
            rosterSize: 2,
            startVoteLocalDateTime: "",
            endVoteLocalDateTime: "",
            roundEndLocalDateTime: "",
            availableRoleIds: [1,2]
        },
        {
            id: 2,
            index: 1,
            eligibleContestantIds: [1,2],
            rosterSize: 2,
            startVoteLocalDateTime: "",
            endVoteLocalDateTime: "",
            roundEndLocalDateTime: "",
            availableRoleIds: [1,2]
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
        }
    ]);
});
