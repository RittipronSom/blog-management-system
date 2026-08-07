const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Blog API is running"
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/users", userRoutes);

app.use("/api/notifications", notificationRoutes);

app.get(
    "/api/test-auth",
    authMiddleware,
    (req, res) => {
        res.json({
            message: "คุณผ่าน Authentication แล้ว",
            user: req.user
        });
    }
);

app.get(
    "/api/test-admin",
    authMiddleware,
    roleMiddleware(["SUPER_ADMIN"]),
    (req, res) => {
        res.json({
            message: "ยินดีต้อนรับ Super Admin"
        });
    }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});