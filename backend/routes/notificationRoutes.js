const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getNotifications,
    getUnreadCount,
    readNotification
} = require("../controllers/notificationController");

router.get("/", authMiddleware, getNotifications);

router.get("/count", authMiddleware, getUnreadCount);

router.patch("/:id/read", authMiddleware, readNotification);

module.exports = router;