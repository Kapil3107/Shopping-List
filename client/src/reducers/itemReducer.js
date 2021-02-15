import {  GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from '../actions/types';

const initialState = {
    items: [],
    loading: false  // false by default. The reason for this is bz when we fetch data, it could take couple of miliseconds to get the data and when we request we want it true and then when we get the data back we want it false again
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_ITEMS: 
            return {
                ...state,
                items: action.payload,
                loading: false
            };
        case DELETE_ITEM:
            return {
                ...state,
                items: state.items.filter(item => item._id !== action.payload)  // REMEMBER MONGO DB USES _ID NOT ID AND IT PROVIDES AUTOMATICALLY FOR US
            };
        case ADD_ITEM:
            return {
                ...state,
                items: [action.payload, ...state.items]
            }
        case ITEMS_LOADING: // all this is gonna do is change the loading from false to true
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}