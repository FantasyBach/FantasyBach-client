import {createStore, applyMiddleware, combineReducers} from 'redux';

import test from './reducers/test';

const reducer = combineReducers({
    test
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
