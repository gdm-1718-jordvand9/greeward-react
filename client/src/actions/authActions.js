import { AUTHENTICATED, AUTHENTICATION_ERROR, UNAUTHENTICATED, SIGNEDUP, SIGNUP_ERROR } from '../constants';

export function signInActionLocalStrategy({ email, password }, history) {
  return async (dispatch) => {
    try {
      const postData = new Blob([JSON.stringify({ email: email, password: password }, null, 2)], { type: 'application/json' });
      const options = {
        method: 'POST',
        body: postData,
        mode: 'cors',
        cache: 'default'
      };
      const response = await fetch('https://greeward.herokuapp.com/api/v1/auth/local', options);
      if(response.status !== 200) {
        throw new Error("Not 200 response");
      }
      const responseJson = await response.json();

      dispatch({
        type: AUTHENTICATED,
        payload: responseJson
      });
      localStorage.setItem('mobdev2_auth', JSON.stringify(responseJson));

    } catch (error) {
      dispatch({
        type: AUTHENTICATION_ERROR,
        payload: 'Invalid email or password'
      });
    }
  };
}
export function signUpActionLocalStrategy({ first_name, last_name, email, password }) {
  return async (dispatch) => {
    try {
      const postData = new Blob([JSON.stringify({ first_name: first_name, last_name: last_name, email: email, password: password}, null, 2)], { type: 'application/json' });
      const options = {
        method: 'POST',
        body: postData,
        mode: 'cors',
        cache: 'default'
      };
      const response = await fetch('https://greeward.herokuapp.com/api/v1/signup', options);
      if(response.status !== 200) {
        throw new Error("Not 200 response");
      }
      const responseJson = await response.json();

      dispatch({
        type: SIGNEDUP,
        payload: responseJson
      });
    } catch (error) {
      dispatch({
        type: SIGNUP_ERROR,
        payload: error
      })
    }
  }
}

export function signInActionFacebookStrategy(accessToken, history) {
  return async (dispatch) => {
    try {
      const postData = new Blob([JSON.stringify({ access_token: accessToken }, null, 2)], { type: 'application/json' });
      const options = {
        method: 'POST',
        body: postData,
        mode: 'cors',
        cache: 'default'
      };
      const response = await fetch('https://greeward.herokuapp.com/api/v1/auth/facebook', options);
      const responseJson = await response.json();

      dispatch({
        type: AUTHENTICATED,
        payload: responseJson
      });
      localStorage.setItem('mobdev2_auth', JSON.stringify(responseJson));

    } catch (error) {
      dispatch({
        type: AUTHENTICATION_ERROR,
        payload: 'Invalid access token'
      });
    }
  };
}

export function signOutAction() {
  localStorage.clear();
  return {
    type: UNAUTHENTICATED
  };
}