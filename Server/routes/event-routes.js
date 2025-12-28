const express = require("express");
const authMiddleware = require("../middlewares/auth");
const eventModel = require("../models/eventModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/create", authMiddleware, async (req, res) => {
    const { title, description, venue, date } = req.body;
    if (!title || !date) return res.status(400).json({ message: "Invalid request" });

    try {
        const admin = await userModel.findById(req.user._id);
        if (admin.role !== "admin") return res.json({ message: "You are not an admin" });

        const existing = await eventModel.findOne({ title });
        if (existing) return res.json({ message: "Event already exists" });

        const event = new eventModel({
            title,
            description,
            venue,
            date,
            createdBy: req.user._id
        });

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: "Failed to create event" });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const events = await eventModel.find()
            .sort({ date: 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch events" });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid event ID" });
    }

    try {
        const admin = await userModel.findById(req.user._id);
        if (admin.role !== "admin") return res.json({ message: "You are not an admin" });

        const updatedEvent = await eventModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ message: "Failed to update event" });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid event ID" });
    }

    try {
        const admin = await userModel.findById(req.user._id);
        if (admin.role !== "admin") return res.json({ message: "You are not an admin" });

        const deleted = await eventModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Event not found" });

        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete event" });
    }
});

module.exports = router;
