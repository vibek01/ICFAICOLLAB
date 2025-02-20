// ad.routes.js
const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const multer = require('multer');
const upload = multer();
const { 
  createAd, 
  getAds, 
  getMyAds, 
  sendJoinRequest, 
  getJoinRequestsForMyAds,
  getMyJoinRequests,
  acceptJoinRequest,
  declineJoinRequest
} = require('../controllers/ad.controller');
const router = express.Router();

router.post('/', protect, upload.none(), createAd);
router.get('/', getAds);
router.get('/my-ads', protect, getMyAds);
// Route to send a join request to a specific ad
router.post('/:adId/join', protect, sendJoinRequest);
// Route to fetch join requests for ads created by the logged-in user (for ad owners)
router.get('/my-join-requests', protect, getJoinRequestsForMyAds);
// Route to fetch join requests that the current user has sent (for applicants)
router.get('/my-join-requests-applicant', protect, getMyJoinRequests);
// Routes to accept or decline a join request (for ad owners)
router.post('/:adId/join/:requesterId/accept', protect, acceptJoinRequest);
router.post('/:adId/join/:requesterId/decline', protect, declineJoinRequest);

module.exports = router;