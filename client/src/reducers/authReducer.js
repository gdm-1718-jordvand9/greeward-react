import { AUTHENTICATED, AUTHENTICATION_ERROR, UNAUTHENTICATED } from '../constants';

const initialState = {
  authenticated: false,
  error: undefined
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
    default:
      return state;
  }
}

export default authReducer;