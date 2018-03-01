import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function loggedUserReducer(state = initialState.loggedUser, action) {
    console.log(action);
  switch (action.type) {
    case types.SET_LOGGED_IN_USER:
      return action.payload;
    default:
      return state;
  }
}
