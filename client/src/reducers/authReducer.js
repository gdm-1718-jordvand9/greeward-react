import { AUTHENTICATED, AUTHENTICATION_ERROR, UNAUTHENTICATED, SIGNEDUP, SIGNUP_ERROR } from '../constants';

const initialState = {
  authenticated: false,
  error: undefined,
  signedup: false,
}

function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATED:
      return Object.assign({}, state, {
        authenticated: true,
        auth: action.payload
      });
    case UNAUTHENTICATED:
      return Object.assign({}, state, {
        authenticated: false,
        auth: null
      });
    case AUTHENTICATION_ERROR:
      return Object.assign({}, state, {
        authenticated: false,
        error: action.payload
      });
    case SIGNEDUP:
      return Object.assign({}, state, {
        signedup: true,
      });
    case SIGNUP_ERROR:
      return Object.assign({}, state, {
        signedup: false,
        error: 'Not able to sign up new user.'
      });
    default:
      return state;
  }
}

export default authReducer;