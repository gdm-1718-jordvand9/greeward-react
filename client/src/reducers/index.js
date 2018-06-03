import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import postReducer from './postReducer';
import activityReducer from './activityReducer';
import profileReducer from './profileReducer';

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  post: postReducer,
  activity: activityReducer,
  profile: profileReducer,
});