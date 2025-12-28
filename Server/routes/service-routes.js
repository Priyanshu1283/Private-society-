const express = require("express");
const authMiddleware = require("../middlewares/auth");
const serviceModel = require("../models/serviceModel");
const userModel = require("../models/userModel");
const workerModel = require("../models/workerModel");

const router = express.Router();

router.post("/create", authMiddleware, async (req, res) => {
    const { category, detail } = req.body;
    if (!category || !detail) return res.status(400).json({ message: "Invalid request" });

    try {
        const worker = await workerModel.findOne();
        const service = new serviceModel({
            residentId: req.user._id,
            houseNo: req.user.houseNo,
            category,
            detail,
            workerId: worker?._id
        });

        await service.save();
        res.json(service);
    } catch {
        res.status(500).json({ message: "Failed to create service" });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        let filter = {};
        const admin = await userModel.findById(req.user._id);

        if (admin && admin.role !== "admin") {
            filter = { residentId: req.user._id };
        }

        const services = await serviceModel.find(filter);
        res.json(services);
    } catch {
        res.status(500).json({ message: "Failed to fetch services" });
    }
});

router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const updated = await serviceModel.findByIdAndUpdate(
            req.params.id,
            { status: "closed" },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Service not found" });
        res.json(updated);
    } catch {
        res.status(500).json({ message: "Failed to update status" });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deleted = await serviceModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Service not found" });
        res.json({ message: "Service deleted" });
    } catch {
        res.status(500).json({ message: "Failed to delete service" });
    }
});

module.exports = router;
