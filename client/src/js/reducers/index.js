import { combineReducers } from 'redux';
import productReducer from './productReducer';
import errorReducer from './errorReducer';
import userReducer from './userReducer';

export default combineReducers({
    product: productReducer,
    error: errorReducer,
    user: userReducer
});