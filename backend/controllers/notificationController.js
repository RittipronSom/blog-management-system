const db = require("../config/db");

// ดึง Notification ของ User
const getNotifications = async (req, res) => {
    try {
        const [notifications] = await db.query(
            `SELECT
                id,
                blog_id,
                comment_id,
                message,
                is_read,
                created_at
            FROM notifications
            WHERE user_id = ?
            ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.status(200).json({
            notifications
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาดใน Server"
        });
    }
};

// จำนวน Notification ที่ยังไม่ได้อ่าน
const getUnreadCount = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT COUNT(*) AS count
             FROM notifications
             WHERE user_id = ?
             AND is_read = FALSE`,
            [req.user.id]
        );

        res.status(200).json({
            count: rows[0].count
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาดใน Server"
        });
    }
};

// อ่าน Notification
const readNotification = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE id = ?
             AND user_id = ?`,
            [id, req.user.id]
        );

        res.status(200).json({
            message: "อ่าน Notification แล้ว"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาดใน Server"
        });
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    readNotification
};