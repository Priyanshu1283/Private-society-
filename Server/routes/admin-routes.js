const express = require("express");
const auth = require("../middlewares/auth");
const adminOnly = require("../middlewares/adminOnly");

const userModel = require("../models/userModel");
const workerModel = require("../models/workerModel");
const securityModel = require("../models/securityModel");

const router = express.Router();

router.get("/pending", auth, adminOnly, async (req, res) => {
  const users = await userModel.find({ status: "pending" });
  const workers = await workerModel.find({ status: "pending" });
  const securities = await securityModel.find({ status: "pending" });

  res.json([...users, ...workers, ...securities]);
});

router.patch("/approve/:role/:id", auth, adminOnly, async (req, res) => {
  const { role, id } = req.params;
  const Model =
    role === "user" ? userModel :
    role === "worker" ? workerModel :
    securityModel;

  await Model.findByIdAndUpdate(id, { status: "approved" });
  res.json({ message: "Approved" });
});

module.exports = router;
