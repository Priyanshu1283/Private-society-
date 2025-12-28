const express = require("express");
const authMiddleware = require("../middlewares/auth");
const complaintModel = require("../models/complaintModel");
const userModel = require("../models/userModel");

const router = express.Router();

router.post("/create", authMiddleware, async (req, res) => {
    const { category, detail } = req.body;
    if (!category || !detail) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        const complaint = new complaintModel({
            residentId: req.user._id,
            houseNo: req.user.houseNo,
            category,
            detail
        });

        await complaint.save();
        res.json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create complaint" });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const admin = await userModel.findById(req.user._id);

        const filter = admin.role === "admin"
            ? {}
            : { residentId: req.user._id };

        const complaints = await complaintModel.find(filter)
            .sort({ date: 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json(complaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch complaints" });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const updatedComplaint = await complaintModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.json(updatedComplaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update complaint" });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deleted = await complaintModel.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.json({ message: "Complaint deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete complaint" });
    }
});

module.exports = router;
