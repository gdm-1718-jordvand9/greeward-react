const express = require('express');
const router = express.Router();
const authRouter = express.Router();
const auth = require('./providers/auth')();
const verifyToken = require('./middleware/verifyToken');

/*
Controllers
*/
const authController = require('./controllers/authController');
const activityController = require('./controllers/activityController');
const commentController = require('./controllers/commentController');
const profileController = require('./controllers/profileController');
const followController = require('./controllers/followController');
const likeController = require('./controllers/likeController');

/*
Routes
*/

// Activity
router.get('/activities', activityController.get_activities);
router.get('/activity/:activityId', activityController.get_activity);
router.post('/activity', verifyToken, activityController.activity_create_post);
router.post('/like/:activityId', verifyToken, likeController.like_create_post);
router.post('/unlike/:activityId', verifyToken, likeController.like_remove_post);
router.get('/backoffice/activities', activityController.backoffice_get_activities);
router.get('/backoffice/activity/:activityId', activityController.backoffice_get_activity);
router.patch('/activities/:activityId/softdelete', activityController.activity_softdelete_patch);
router.patch('/activities/:activityId/softundelete', activityController.activity_softundelete_patch);
router.delete('/activities/:activityId', activityController.activity_delete_delete);

//Comments
router.post('/comments/:activityId', verifyToken, commentController.comment_create_post);
router.get('/backoffice/comments', commentController.backoffice_get_comments);
router.get('/backoffice/comment/:commentId', commentController.backoffice_get_comment);
router.patch('/comments/:commentId/softdelete', commentController.comment_softdelete_patch);
router.patch('/comments/:commentId/softundelete', commentController.comment_softundelete_patch);
router.delete('/comments/:commentId', commentController.comment_delete_delete);

// Auth
router.post('/signup', authController.user_create_post);
authRouter.post('/local', authController.user_auth_local_post);
authRouter.post('/facebook', authController.user_auth_facebook_post);
router.use('/auth', authRouter);

//Profile
router.get('/profile/:id', profileController.get_profile);
router.get('/backoffice/profiles', profileController.backoffice_get_profiles);
router.get('/backoffice/profile/:profileId', profileController.backoffice_get_profile);
router.get('/backoffice/profile/comments/:profileId', commentController.backoffice_get_profile_comments);
router.delete('/profiles/:profileId', profileController.profile_delete_delete);

// Follow
router.post('/follow', verifyToken, followController.follow_create_post);
router.get('/followers/:id', followController.get_followers);
router.get('/following/:id', followController.get_following);
router.post('/unfollow/:id', verifyToken, followController.unfollow_post);

// Account
router.get('/account', verifyToken, profileController.get_account);
router.put('/account', verifyToken, profileController.profile_update_put);
router.get('/account/comments', verifyToken, commentController.get_account_comments);

module.exports = router;