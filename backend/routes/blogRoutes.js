const express = require("express");

const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    searchBlogs
} = require("../controllers/blogController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createBlog); // route สร้าง

router.get("/", authMiddleware, getAllBlogs);

router.get("/search", authMiddleware, searchBlogs);

router.get("/:id", authMiddleware, getBlogById);

router.put("/:id", authMiddleware, updateBlog);

router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;