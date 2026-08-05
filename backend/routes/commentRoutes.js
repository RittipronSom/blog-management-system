const express = require("express");

const {
    createComment,
    getCommentsByBlog
} = require("../controllers/commentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createComment);  // route สร้าง comment

router.get("/blog/:blogId", authMiddleware, getCommentsByBlog); // route ดึง comment ของ blog

module.exports = router;    