import axios from 'axios';
import { returnErrors } from './errorActions';

import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from "./types";

// Check token and load user  - basically we want the user data from token (which will be send from backend auth.js - the get request)
export const loadUser = () => (dispatch, getState) => { // since we are making an asynchronous request, we're gonna need to call dispatch within here
    // User loading
    dispatch({ type: USER_LOADING });

    axios.get('/api/auth/user', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data  // user and token both
        }))
        .catch(err => {  // the catch used here is not a keyword, it is .catch wrapper function of a promise and can be used to catch any exception that happen within the .then block.
            dispatch(returnErrors(err.response.data, err.response.status)); // returnErrors takes in a msg, status, id
            dispatch({
                type: AUTH_ERROR // Auth error will clear everything out but also any error we get we want to run it through our error reducer (which is the above dispatch)
            });
        });
}

// Register User
export const register = ({ name, email, password }) => dispatch => {
    // Headers
    const config = {
        headers: {
            "Content-type": "application/json" // since we're sending the json so we have to add it to headers
        }
    }

    // Request body (request the data that we are gonna send - name, email, password)
    const body = JSON.stringify({ name, email, password });

    axios.post('/api/users', body, config) // config includes the headers information (the content type)
        .then(res => dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')); // we are adding here id - REGISTER_FAIL
            dispatch({
                type: REGISTER_FAIL
            });
        })
}

// Login User
export const login = ({ email, password }) => dispatch => {
    // Headers
    const config = {
        headers: {
            "Content-type": "application/json" // since we're sending the json so we have to add it to headers
        }
    }

    // Request body (request the data that we are gonna send - name, email, password)
    const body = JSON.stringify({ email, password });

    axios.post('/api/auth', body, config) // config includes the headers information (the content type)
        .then(res => dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')); // we are adding here id - LOGIN_FAIL
            dispatch({
                type: LOGIN_FAIL
            });
        })
}

// Logout User
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    }
}

// Setup config/headers and token - (It's a helper fn to get our token)
export const tokenConfig = getState => {  //getState is a parameter
    // Get token from localstorage
    const token = getState().auth.token;

    // Now add it to headers (we're doing this using axios - we set an object and then we add a headers object inside of that)
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    // If token, add to headers  (where we are getting the token in auth.js middleware)
    if (token) {
        config.headers['x-auth-token'] = token;
    }

    return config;
}
