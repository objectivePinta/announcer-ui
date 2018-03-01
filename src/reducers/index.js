import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
// import * as actionTypes from '../actions/actionTypes';
import loggedUser from './loggedUserReducer';




const appReducer = combineReducers({
  loggedUser,
  routing: routerReducer,
});

const rootReducer = (state, action) => {
  // if (action.type === actionTypes.USER_LOGOUT) {
  //   const { routing } = state;
  //   // eslint-disable-next-line
  //   state = { routing };
  // }

  return appReducer(state, action);
};

export default rootReducer;
