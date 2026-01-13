const express = require("express");
const auth = require("../middlewares/auth");
const adminOnly = require("../middlewares/adminOnly");

const userModel = require("../models/userModel");
const workerModel = require("../models/workerModel");
const securityModel = require("../models/securityModel");

const router = express.Router();

// Get all pending registrations (grouped)
router.get("/pending", auth, adminOnly, async (req, res) => {
  try {
    // Collect pending entries from userModel (could contain user/worker/security)
    const pendingUsers = await userModel.find({ status: "pending", role: "user" });
    const pendingWorkersFromUsers = await userModel.find({ status: "pending", role: "worker" });
    const pendingSecuritiesFromUsers = await userModel.find({ status: "pending", role: "security" });

    // Also include any legacy/other collections (workerModel/securityModel)
    const pendingWorkers = await workerModel.find({ status: "pending" });
    const pendingSecurities = await securityModel.find({ status: "pending" });

    // Merge sources (user collection may already contain worker/security requests)
    const workers = [...pendingWorkersFromUsers, ...pendingWorkers];
    const securities = [...pendingSecuritiesFromUsers, ...pendingSecurities];

    res.json({ users: pendingUsers, workers, securities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve by role (user/worker/security)
router.patch("/approve/:role/:id", auth, adminOnly, async (req, res) => {
  try {
    const { role, id } = req.params;
    // Try to update in the user collection first (handles worker/security stored as users)
    let updated = null;
    if (role === 'user') {
      updated = await userModel.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
    } else if (role === 'worker' || role === 'security') {
      updated = await userModel.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
      if (!updated) {
        const Model = role === 'worker' ? workerModel : securityModel;
        updated = await Model.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
      }
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Approved', item: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reject by role
router.patch("/reject/:role/:id", auth, adminOnly, async (req, res) => {
  try {
    const { role, id } = req.params;
    // Similar logic as approve: prefer userModel, fallback to specific collection
    let updated = null;
    if (role === 'user') {
      updated = await userModel.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    } else if (role === 'worker' || role === 'security') {
      updated = await userModel.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
      if (!updated) {
        const Model = role === 'worker' ? workerModel : securityModel;
        updated = await Model.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
      }
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Rejected', item: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin-specific user endpoints (convenience)
router.get("/admin/pending-users", auth, adminOnly, async (req, res) => {
  try {
    const pendingUsers = await userModel.find({ status: "pending" });
    res.json(pendingUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/admin/approve-user/:id", auth, adminOnly, async (req, res) => {
  try {
    const updated = await userModel.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "User approved", user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/admin/reject-user/:id", auth, adminOnly, async (req, res) => {
  try {
    const updated = await userModel.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "User rejected", user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;