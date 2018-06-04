import { PROFILE_UPDATED, PROFILE_UPDATING_ERROR } from '../constants';

const initialState = {
  profileUpdated: false,
  updatedProfile: undefined,
  error: undefined
}

function profileReducer(state = initialState, action) {
  switch (action.type) {
    case PROFILE_UPDATED:
      return Object.assign({}, state, {
        profileUpdated: true,
        updatedProfile: action.payload
      });
    case PROFILE_UPDATING_ERROR:
      return Object.assign({}, state, {
        profileUpdated: false,
        error: action.payload
      });
    default:
      return state;
  }
}

export default profileReducer;