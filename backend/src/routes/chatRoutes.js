const express = require("express");

const router = express.Router();

const { handleChat } = require("../controllers/chatController");

router.post("/", (req, res, next) => {
  console.log("POST /api/chat");
  next();
}, handleChat);

module.exports = router;