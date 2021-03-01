import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import userEventsReducer from './userEvents';
import recorderReducer from './recorder';
const rootReducer = combineReducers({
    userEvents: userEventsReducer,
    recorder: recorderReducer
});

export type RootState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;