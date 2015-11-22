import update from 'react-addons-update';
import { handleActions } from 'redux-actions';

const initialState = {};

export default handleActions({

    LOAD_CONTESTANTS: {
        next(state, action) {
            return action.payload.reduce((memo, contestant) => {
                return update(memo, {
                    [contestant.id]: { $set: {
                        data: contestant
                    } }
                })
            }, state);
        }
    }

}, initialState);
