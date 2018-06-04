import { PROFILE_UPDATED, PROFILE_UPDATING_ERROR } from '../constants';
import store from '../store';

export function updateAccountSettings({ first_name, last_name, avatar }) {
  return async (dispatch) => {
    try {
      const postData = new Blob([JSON.stringify({first_name: first_name, last_name: last_name, avatar: avatar}, null, 2)], {type : 'application/json'});
      const options = {
          method: 'PUT',
          body: postData,
          mode: 'cors',
          cache: 'default',
          headers: { 'x-access-token': store.getState().auth.auth.token }
      };
      const response = await fetch('https://greeward.herokuapp.com/api/v1/account', options);
      if(response.status !== 200) {
        throw new Error("Not 200 response");
      }
      const responseJson = await response.json();

      dispatch({ 
        type: PROFILE_UPDATED,
        payload: responseJson
      });

      let local = JSON.parse(localStorage.getItem('mobdev2_auth'));
      let user = local.user;
      user.first_name = responseJson.first_name;
      user.last_name = responseJson.last_name;
      user.avatar = responseJson.avatar;
      local.user = user;
      localStorage.setItem('mobdev2_auth', JSON.stringify(local));
      window.location.reload()

    } catch(error) {
      dispatch({
        type: PROFILE_UPDATING_ERROR,
        payload: {
          message: 'Invalid email or password',
          exception: error
        }
      });
    }
  };
}