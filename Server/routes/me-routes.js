const express = require("express");
const authMiddleware = require("../middlewares/auth");
const upload = require("../configs/multer");
const userModel = require("../models/userModel");
const workerModel = require("../models/workerModel");
const bcrypt = require("bcrypt");

const router = express.Router();

/* ======================
   GET PROFILE
====================== */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user.role
      ? await userModel.findById(req.user._id).select("name email houseNo profilePicture")
      : await workerModel.findById(req.user._id).select("name email joinedAt profilePicture");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

/* ======================
   UPLOAD PROFILE PIC
====================== */
router.put(
  "/profile-picture",
  authMiddleware,
  upload.single("profilePicture"), // MUST MATCH frontend
  async (req, res) => {
    try {
      const user = req.user.role
        ? await userModel.findById(req.user._id)
        : await workerModel.findById(req.user._id);

      if (!user) return res.status(404).json({ message: "User not found" });
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      user.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };

      await user.save();

      res.json({ success: true });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ message: "Failed to update profile picture" });
    }
  }
);

/* ======================
   GET PROFILE PIC
====================== */
router.get("/profile-picture/:id", async (req, res) => {
  try {
    let user = await userModel.findById(req.params.id);
    if (!user) user = await workerModel.findById(req.params.id);

    if (!user || !user.profilePicture) {
      return res.status(404).json({ message: "Profile picture not found" });
    }

    res.set("Content-Type", user.profilePicture.contentType);
    res.send(user.profilePicture.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile picture" });
  }
});

/* ======================
   UPDATE PROFILE DETAILS
====================== */
router.put("/", authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.houseNo) user.houseNo = req.body.houseNo;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
