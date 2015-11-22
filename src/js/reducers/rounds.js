import update from 'react-addons-update';
import { handleActions } from 'redux-actions';

const initialState = {};

export default handleActions({

    LOAD_ROUNDS: {
        next(state, action) {
            return action.payload.reduce((memo, round) => {
                return update(memo, {
                    [round.id]: { $set: {
                        data: round
                    } }
                })
            }, state);
        }
    }

}, initialState);
