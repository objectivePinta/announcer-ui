import URI from 'urijs';
import toastr from 'toastr';
import * as constants from '../constants/constants';
import redirectToLogin from './redirectToLogin';
import apiFetch from './apiFetch';
import {setLoggedInUser} from './loginActions';
import * as types from './actionTypes';

export function doLogout() {
  return function (dispatch) {
    const api = new URI(constants.ROOT).segment('logout');
    return apiFetch(dispatch, api, {
      credentials: 'include',
      method: 'POST',
    }).then(response => {
      if (response.status === 200) {
        const info = 'Logout successful';
        toastr.info(info);
        dispatch(setLoggedInUser(''));
        redirectToLogin();
        return response;
      }
      throw Error('Logout failed.');
    }).catch(error => {
      toastr.error(error.message);
    });
  };
}
