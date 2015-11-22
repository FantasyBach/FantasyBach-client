import update from 'react-addons-update';
import { handleActions } from 'redux-actions';

const initialState = {};

export default handleActions({

    LOAD_SEASONS: {
        next(state, action) {
            return action.payload.reduce((memo, season) => {
                return update(memo, {
                    [season.id]: { $set: {
                        data: season
                    } }
                })
            }, state);
        }
    }

}, initialState);
