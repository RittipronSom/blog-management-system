const db = require("../config/db");

const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT
                id,
                username,
                email,
                role,
                status,
                created_at
            FROM users
            ORDER BY created_at DESC
        `);

        res.status(200).json({
            users
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาดใน Server"
        });
    }
};
const activateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await db.query(
            "SELECT id, status FROM users WHERE id = ?",
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "ไม่พบ User"
            });
        }

        if (users[0].status === "ACTIVE") {
            return res.status(400).json({
                message: "User นี้ Active อยู่แล้ว"
            });
        }

        await db.query(
            "UPDATE users SET status = 'ACTIVE' WHERE id = ?",
            [id]
        );

        res.status(200).json({
            message: "Active User สำเร็จ"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาดใน Server"
        });
    }
};

module.exports = {
    getAllUsers,
    activateUser
};