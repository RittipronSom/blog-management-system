const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // รับ Token จาก Header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "กรุณาเข้าสู่ระบบ"
            });
        }

        // ต้องเป็นรูปแบบ Bearer Token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "ไม่พบ Token"
            });
        }

        // ตรวจสอบ Token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // เก็บข้อมูล User ไว้ใน req
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token ไม่ถูกต้องหรือหมดอายุ"
        });
    }
};

module.exports = authMiddleware;