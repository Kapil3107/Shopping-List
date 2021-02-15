import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:  // user loading is just the point where we're trying to get the user from backend to the point where we actually fetch the user
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:  // user loaded is basically gonna run all the time with every request to see if we are logged in or not
            return {
                ...state,
                isAuthenticated: true,  // because we went and validated on the backend, got the user
                isLoading: false,
                user: action.payload
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload, // this is gonna have the user and token both (which we send as the res from the server side)
                isAuthenticated: true,  // because we went and validated on the backend, got the user
                isLoading: false
            };
        // now if the authentication fails, also if we log out, if the registration fails - everything should clear out
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            }
        default:
            return state;
    }
}