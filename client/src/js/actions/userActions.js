import axios from 'axios';
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    CALL_LOADED
} from './types';
import { returnErrors } from './errorActions';

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
    // User loading
    dispatch({type: USER_LOADING});

    axios.get('/api/users/me', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            })
        });
};
    
// Register User
export const register = ({ name, email, password }) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };

    // Request body
    const body = JSON.stringify({ name, email, password });

    axios.post('/api/users', body, config)
        .then(res => {
            dispatch({type: CALL_LOADED});

            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
            dispatch({
                type: REGISTER_FAIL
            })
        });
};

// Login user
export const login = ({ email, password }) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };

    // Request body
    const body = JSON.stringify({ email, password });

    axios.post('/api/users/login', body, config)
        .then(res => {
            dispatch({type: CALL_LOADED});

            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
            dispatch({
                type: LOGIN_FAIL
            })
        });
};

// Logout user
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    }; 
};

// Setup config/headers and token
export const tokenConfig = (getState) => {
    // Get token from localStorage
    const token = getState().user.token;

    // Headers
    const config = {
        headers: {
            "content-type": "application/json"
        }
    };

    // If token, add to headers
    if(token) {
        config.headers['Authorization'] = token;
    }

    return config;
};