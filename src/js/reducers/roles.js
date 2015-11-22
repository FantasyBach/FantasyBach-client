import update from 'react-addons-update';
import { handleActions } from 'redux-actions';

const initialState = {};

export default handleActions({

    LOAD_ROLES: {
        next(state, action) {
            return action.payload.reduce((memo, roles) => {
                return update(memo, {
                    [roles.id]: { $set: {
                        data: roles
                    } }
                })
            }, state);
        }
    }

}, initialState);
