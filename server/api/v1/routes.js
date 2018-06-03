const express = require('express');
const router = express.Router();
const authRouter = express.Router();
const verifiedRouter = express.Router();
const auth = require('./providers/auth')();
const verifyToken = require('./middleware/verifyToken');

/*
Controllers
*/
const authController = require('./controllers/authController');
const blogController = require('./controllers/blogController');
const categoryController = require('./controllers/categoryController');
const postController = require('./controllers/postController');
const activityController = require('./controllers/activityController');
const commentController = require('./controllers/commentController');
const profileController = require('./controllers/profileController');
const followController = require('./controllers/followController');
const likeController = require('./controllers/likeController');

/*
Routes
*/
//Profile
router.get('/profile/:id', profileController.get_profile);
router.get('/blogs', blogController.get_blogs);
router.get('/blogs/:id', blogController.get_blog);
router.get('/categories', categoryController.get_categories);
router.get('/categories/:id', categoryController.get_category);
//router.get('/posts', auth.authenticateJwt(), postController.get_posts);// Securing the end-point to-do
router.get('/activities', activityController.get_activities);
router.get('/activity/:activityId', activityController.get_activity);
router.post('/activity', verifyToken, activityController.activity_create_post);
router.get('/posts', postController.get_posts);
router.get('/posts/:postId', postController.get_post);
router.get('/posts/vm/create', postController.post_create_get);
router.post('/posts', postController.post_create_post);
router.get('/posts/:postId/update', postController.post_update_get);
router.put('/posts/:postId', postController.post_update_put);
router.delete('/posts/:postId', postController.post_delete_delete);
router.patch('/posts/:postId/softdelete', postController.post_softdelete_patch);
router.patch('/posts/:postId/softundelete', postController.post_softundelete_patch);

// Follow
router.post('/follow', verifyToken, followController.follow_create_post);
router.get('/followers/:id', followController.get_followers);
router.get('/following/:id', followController.get_following);
router.get('/follow/check/:id', verifyToken, followController.is_following);
router.post('/unfollow/:id', verifyToken, followController.unfollow_post);
router.post('/like/:activityId', verifyToken, likeController.like_create_post);
router.post('/unlike/:activityId', verifyToken, likeController.like_remove_post);



router.post('/comments/:activityId', verifyToken, commentController.comment_create_post);

router.post('/signup', authController.user_create_post);
authRouter.post('/local', authController.user_auth_local_post);
authRouter.post('/facebook', authController.user_auth_facebook_post);
router.use('/auth', authRouter);

// Backoffice
router.get('/backoffice/activities', activityController.backoffice_get_activities);
router.get('/backoffice/comments', commentController.backoffice_get_comments);
router.get('/backoffice/profiles', profileController.backoffice_get_profiles);
router.get('/backoffice/activity/:activityId', activityController.backoffice_get_activity);
router.get('/backoffice/profile/:profileId', profileController.backoffice_get_profile);
router.get('/backoffice/comment/:commentId', commentController.backoffice_get_comment);
router.get('/backoffice/profile/comments/:profileId', commentController.backoffice_get_profile_comments);

// Soft deletes
router.patch('/activities/:activityId/softdelete', activityController.activity_softdelete_patch);
router.patch('/activities/:activityId/softundelete', activityController.activity_softundelete_patch);
router.delete('/activities/:activityId', activityController.activity_delete_delete);
router.patch('/comments/:commentId/softdelete', commentController.comment_softdelete_patch);
router.patch('/comments/:commentId/softundelete', commentController.comment_softundelete_patch);
router.delete('/comments/:commentId', commentController.comment_delete_delete);
router.delete('/profiles/:profileId', profileController.profile_delete_delete);

// Account
router.get('/account', verifyToken, profileController.get_account);
router.get('/account/comments', verifyToken, commentController.get_account_comments);

module.exports = router;