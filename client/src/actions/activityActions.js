import { ACTIVITY_CREATION_ERROR, ACTIVITY_CREATED, ACTIVITY_FETCHED, ACTIVITY_FETCHING_ERROR, ACTIVITY_COMMENT_REMOVING_ERROR, ACTIVITY_COMMENT_REMOVED, ACTIVITY_COMMENT_CREATED, ACTIVITY_COMMENT_CREATING_ERROR, ACTIVITY_LIKE_CREATED, ACTIVITY_LIKE_CREATION_ERROR, ACTIVITY_LIKED, ACTIVITY_LIKE_REMOVED, ACTIVITY_LIKE_REMOVING_ERROR } from '../constants';
import store from '../store';
export function createActivity() {
  return async (dispatch) => {
    try {
      const options = {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        headers: { 'x-access-token': store.getState().auth.auth.token }
      };
      const response = await fetch('/api/v1/activity', options);
      const responseJson = await response.json();

      dispatch({
        type: ACTIVITY_CREATED,
        payload: responseJson
      });
      let local = JSON.parse(localStorage.getItem('mobdev2_auth'));
      let stats = local.user.stats;
      stats.co = stats.co + (responseJson.distance / 9);
      stats.km = stats.km + responseJson.distance;
      stats.pts = stats.pts + responseJson.points;
      local.user.stats = stats;
      localStorage.setItem('mobdev2_auth', JSON.stringify(local));

    } catch (error) {
      dispatch({
        type: ACTIVITY_CREATION_ERROR,
        payload: {
          message: 'Failed to create post.',
          exception: error
        }
      });
    }
  };
}
export function fetchActivity(activityId) {
  return async (dispatch) => {
    try {
      let isLiked = false;
      const response = await fetch(`/api/v1/activity/${activityId}`);
      const responseJson = await response.json();
      const authenticated = store.getState().auth.authenticated;
      console.log(authenticated);
      if(authenticated) {
        isLiked = responseJson.likes.find((obj) => { return obj === store.getState().auth.auth.user.id});
      }
      
      dispatch({
        type: ACTIVITY_FETCHED,
        payload: responseJson
      });
      dispatch({
        type: ACTIVITY_LIKED,
        payload: isLiked
      })
    } catch (error) {
      dispatch({
        type: ACTIVITY_FETCHING_ERROR,
        payload: {
          message: 'Error fetching activity.',
          exception: error,
        }
      });
    }
  }
}
export function softDeleteActivityComment(commentId) {
  return async (dispatch) => {
    try {
      const options = {
        method: 'PATCH',
        mode: 'cors',
        cache: 'default'
      }
      const response = await fetch(`/api/v1/comments/${commentId}/softdelete`, options);
      const responseJson = await response.json();
      dispatch({
        type: ACTIVITY_COMMENT_REMOVED,
        payload: responseJson,
      });
    } catch (error) {
      dispatch({
        type: ACTIVITY_COMMENT_REMOVING_ERROR,
        payload: {
          message: 'Error removing comment.',
          exception: error,
        }
      });
    }
  }
}

export function createActivityComment({ body, activity }) {
  return async (dispatch) => {
    try {
      console.log(activity);
      console.log(body);
      const commentData = new Blob([JSON.stringify({ body: body }, null, 2)], { type: 'application/json' });
      const options = {
        method: 'POST',
        body: commentData,
        mode: 'cors',
        cache: 'default',
        headers: { 'x-access-token': store.getState().auth.auth.token }
      };
      const response = await fetch(`/api/v1/comments/${activity}`, options);
      const responseJson = await response.json();
      console.log(responseJson);
      dispatch({
        type: ACTIVITY_COMMENT_CREATED,
        payload: responseJson
      });

    } catch (error) {
      dispatch({
        type: ACTIVITY_COMMENT_CREATING_ERROR,
        payload: {
          message: 'Error creating comment.',
          exception: error
        }
      });
    }
  };
}
export function createActivityLike( activity ) {
  return async (dispatch) => {
    try {
      const options = {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        headers: { 'x-access-token': store.getState().auth.auth.token }
      };
      const response = await fetch(`/api/v1/like/${activity}`, options);
      const responseJson = await response.json();
      dispatch({
        type: ACTIVITY_LIKE_CREATED,
        payload: responseJson
      });
    } catch (error) {
      dispatch({
        type: ACTIVITY_LIKE_CREATION_ERROR,
        payload: {
          message: 'Error creating like.',
          exception: error
        }
      });
    }
  };
}

export function removeActivityLike( activity ) {
  return async (dispatch) => {
    try {
      const options = {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        headers: { 'x-access-token': store.getState().auth.auth.token }
      };
      const response = await fetch(`/api/v1/unlike/${activity}`, options);
      const responseJson = await response.json();
      dispatch({
        type: ACTIVITY_LIKE_REMOVED,
        payload: responseJson
      });
    } catch (error) {
      dispatch({
        type: ACTIVITY_LIKE_REMOVING_ERROR,
        payload: {
          message: 'Error creating like.',
          exception: error
        }
      });
    }
  };
}