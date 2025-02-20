// ad.controller.js
const mongoose = require('mongoose');
const Ad = require('../models/ad.model');

/**
 * Create a new ad.
 */
exports.createAd = async (req, res) => {
  try {
    const { domain, title, description } = req.body;
    console.log(req.body);
    // Associate the ad with the logged-in user using req.user.id
    const ad = new Ad({ 
      domain, 
      title, 
      description,
      userId: req.user.id
    });
    await ad.save();
    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      data: ad
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Get all ads.
 */
exports.getAds = async (req, res) => {
  try {
    const ads = await Ad.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    res.json({ success: true, data: ads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Get ads created by the logged-in user (for the "My Team Ads" section).
 */
exports.getMyAds = async (req, res) => {
  try {
    const ads = await Ad.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('joinRequests.user', 'name email'); // Populate joinRequests details.
    res.json({ success: true, data: ads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Get join requests that the current user (applicant) has sent.
 * (For the "My Join Requests" section in the applicant's dashboard.)
 */
exports.getMyJoinRequests = async (req, res) => {
  try {
    // Convert req.user.id to a Mongoose ObjectId for safety.
    const currentUserId = new mongoose.Types.ObjectId(req.user.id);
    console.log("Current User ID (as ObjectId):", currentUserId);

    // Find ads where joinRequests.user includes the current user.
    const ads = await Ad.find({ "joinRequests.user": { $in: [currentUserId] } })
      .populate('userId', 'name email')  // Include ad owner details.
      .populate('joinRequests.user', 'name email');
    
    // For each ad, filter joinRequests to include only those for the current user.
    const myJoinRequests = ads.map(ad => {
      // IMPORTANT: After population, jr.user is an object so we use jr.user._id
      const myRequests = ad.joinRequests.filter(jr => jr.user._id.toString() === req.user.id);
      return {
        adId: ad._id,
        title: ad.title,
        owner: ad.userId, // Ad owner's details.
        joinRequests: myRequests
      };
    });
    res.json({ success: true, data: myJoinRequests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Send a join request to a specific ad.
 */
exports.sendJoinRequest = async (req, res) => {
  try {
    const adId = req.params.adId;
    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }
    // Prevent the ad owner from sending a join request to their own ad.
    if (ad.userId.toString() === req.user.id) {
      return res.status(400).json({ success: false, error: 'You cannot send a join request to your own ad' });
    }
    // Check if the user has already sent a join request.
    if (ad.joinRequests.some(jr => jr.user.toString() === req.user.id)) {
      return res.status(400).json({ success: false, error: 'Join request already sent' });
    }
    // Push new join request object with status 'pending'.
    ad.joinRequests.push({ user: req.user.id, status: 'pending' });
    await ad.save();
    res.json({ success: true, message: 'Join request sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Accept a join request for an ad.
 */
exports.acceptJoinRequest = async (req, res) => {
  try {
    const { adId, requesterId } = req.params;
    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }
    // Ensure the logged-in user is the ad owner.
    if (ad.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    // Find the join request by matching the requester ID.
    const joinRequest = ad.joinRequests.find(jr => jr.user.toString() === requesterId);
    if (!joinRequest) {
      return res.status(404).json({ success: false, error: 'Join request not found' });
    }
    joinRequest.status = 'accepted';
    await ad.save();
    res.json({ success: true, message: 'Join request accepted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Decline a join request for an ad.
 */
exports.declineJoinRequest = async (req, res) => {
  try {
    const { adId, requesterId } = req.params;
    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }
    if (ad.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    const joinRequest = ad.joinRequests.find(jr => jr.user.toString() === requesterId);
    if (!joinRequest) {
      return res.status(404).json({ success: false, error: 'Join request not found' });
    }
    joinRequest.status = 'declined';
    await ad.save();
    res.json({ success: true, message: 'Join request declined' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Get join requests for ads created by the current user.
 * (For the "Join Requests Received" section in the ad owner’s dashboard.)
 */
exports.getJoinRequestsForMyAds = async (req, res) => {
  try {
    const ads = await Ad.find({ userId: req.user.id })
      .populate('joinRequests.user', 'name email');
    const joinRequestsData = ads.map(ad => ({
      adId: ad._id,
      title: ad.title,
      joinRequests: ad.joinRequests || []
    }));
    res.json({ success: true, data: joinRequestsData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};