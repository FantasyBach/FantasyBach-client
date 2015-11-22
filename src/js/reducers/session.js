import update from 'react-addons-update';
import { handleActions } from 'redux-actions';

const initialState = {
    user: null,
    seasons: []
};

export default handleActions({

    LOGIN: {
        next(state, action) {
            return state;
        }
    }

}, initialState);
