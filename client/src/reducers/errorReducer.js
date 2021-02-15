import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

const initialState = {
    // these will come from the server:
    msg: {},
    status: null,
    id: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_ERRORS:
            return {
                msg: action.payload.msg, //payload is an object that'll have a message which comes from the server
                status: action.payload.status,
                id: action.payload.id
            };
        case CLEAR_ERRORS:
            return {
                msg: {},
                status: null,
                id: null
            };
        default:
            return state;
    }
}