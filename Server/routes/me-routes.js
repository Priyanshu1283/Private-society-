const express = require("express");
const authMiddleware = require("../middlewares/auth");
const upload = require("../configs/multer");
const userModel = require("../models/userModel");
const workerModel = require("../models/workerModel");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        let user;
        if (req.user.role) {
            user = await userModel.findById(req.user._id)
                .select("name email houseNo profilePicture");
        } else {
            user = await workerModel.findById(req.user._id)
                .select("name email joinedAt profilePicture");
        }

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch {
        res.status(500).json({ message: "Failed to fetch profile" });
    }
});

router.put("/profile-picture", authMiddleware, upload.single("profilePicture"), async (req, res) => {
    try {
        let user = req.user.role
            ? await userModel.findById(req.user._id)
            : await workerModel.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        user.profilePicture = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };

        await user.save();
        res.json({ message: "Profile picture updated" });
    } catch {
        res.status(500).json({ message: "Failed to update profile picture" });
    }
});

router.get("/profile-picture/:id", async (req, res) => {
    let user = await userModel.findById(req.params.id);
    if (!user) user = await workerModel.findById(req.params.id);

    if (!user || !user.profilePicture) {
        return res.status(404).json({ message: "Profile picture not found" });
    }

    res.set("Content-Type", user.profilePicture.contentType);
    res.send(user.profilePicture.data);
});

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
        res.json({ message: "Profile updated" });
    } catch {
        res.status(500).json({ message: "Failed to update profile" });
    }
});

module.exports = router;
