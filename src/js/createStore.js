import {createStore, applyMiddleware, combineReducers} from 'redux';

import contestants from './reducers/contestants';
import roles from './reducers/roles';
import rounds from './reducers/rounds';
import session from './reducers/session';


const reducer = combineReducers({
    contestants,
    roles,
    rounds,
    session
});

const middleware = applyMiddleware(

    // handle promises, based off of redux-promise
   // major difference is that it doesn't catch errors
   ({ dispatch }) => next => action => action.payload && action.payload.then
       ? action.payload.then(
           res => dispatch({ ...action, payload: res }),
           err => {
               const failedAction = { ...action, payload: err, error: true };
               dispatch(failedAction);
               throw failedAction;
           }
       )
       : next(action)
)

export default () => middleware(createStore)(reducer);
