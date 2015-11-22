import update from 'react-addons-update';
import { handleActions } from 'redux-actions';

const initialState = {
    user: null
};

export default handleActions({

    LOAD_USER: {
        next(state, action) {
            return update(state, {
                user: { $set: action.payload }
            });
        }
    }

}, initialState);
