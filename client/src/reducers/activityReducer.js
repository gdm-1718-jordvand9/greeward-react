import { ACTIVITY_CREATED, ACTIVITY_CREATION_ERROR, ACTIVITY_FETCHED, ACTIVITY_FETCHING_ERROR, ACTIVITY_COMMENT_REMOVING_ERROR, ACTIVITY_COMMENT_REMOVED, ACTIVITY_COMMENT_CREATING_ERROR, ACTIVITY_COMMENT_CREATED, ACTIVITY_LIKE_CREATED, ACTIVITY_LIKE_CREATION_ERROR, ACTIVITY_LIKED, ACTIVITY_LIKE_REMOVED, ACTIVITY_LIKE_REMOVING_ERROR } from '../constants';

const initialState = {
  newActivityCreated: false,
  activityFetched: false,
  newActivity: undefined,
  activity: null,
  error: undefined,
  activityLikeCreated: false,
  activity_liked: false
}

function activityReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIVITY_CREATED:
      return Object.assign({}, state, {
        newActivityCreated: true,
        newActivity: action.payload
      });
    case ACTIVITY_CREATION_ERROR:
      return Object.assign({}, state, {
        newActivityCreated: false,
        error: action.payload
      });
    case ACTIVITY_FETCHED:
      return Object.assign({}, state, {
        activityFetched: true,
        activity: action.payload
      });
    case ACTIVITY_FETCHING_ERROR:
      return Object.assign({}, state, {
        activityFetched: false,
        error: action.payload
      });
    case ACTIVITY_COMMENT_REMOVED:
      console.log(state.activity);
      return Object.assign({}, state, {
        activityCommentRemoved: true,
        activity: { ...state.activity, comments: state.activity.comments.filter(comment => comment._id !== action.payload._id) },
      });
    case ACTIVITY_COMMENT_REMOVING_ERROR:
      return Object.assign({}, state, {
        activityCommentRemoved: false,
        error: action.payload,
      });
    case ACTIVITY_COMMENT_CREATED:
      return Object.assign({}, state, {
        activityCommentCreated: true,
        activity: { ...state.activity, comments: state.activity.comments.concat(action.payload) },
      });
    case ACTIVITY_COMMENT_CREATING_ERROR:
      return Object.assign({}, state, {
        activityCommentCreated: false,
        error: action.payload
      });
    case ACTIVITY_LIKE_CREATED:
      return Object.assign({}, state, {
        activityLikeCreated: true,
        activity: { ...state.activity, likes: state.activity.likes.concat(action.payload) },
        activity_liked: true
      });
    case ACTIVITY_LIKE_CREATION_ERROR:
      return Object.assign({}, state, {
        activityLikeCreated: false,
        error: action.payload
      });
    case ACTIVITY_LIKE_REMOVED:
      return Object.assign({}, state, {
        activityLikeRemoved: true,
        activity: { ...state.activity, likes: state.activity.likes.filter(like => like !== action.payload) },
        activity_liked: false
      });
    case ACTIVITY_LIKE_REMOVING_ERROR:
      return Object.assign({}, state, {
        activityLikeRemoved: false,
        error: action.payload
      });
    case ACTIVITY_LIKED:
      return Object.assign({}, state, {
        activity_liked: action.payload
      });
    default:
      return state;
  }
}

export default activityReducer;