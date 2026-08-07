const db = require("../config/db");

const allowedRoles = ["SUPER_ADMIN", "GENERAL_USER"];
const allowedStatuses = ["PENDING", "ACTIVE"];

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
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role, status } = req.body;

        if (!username || !email || !role || !status) {
            return res.status(400).json({
                message: "กรุณากรอก Username, Email, Role และ Status"
            });
        }

        if (username.length < 4 || username.length > 20) {
            return res.status(400).json({
                message: "Username ต้องมีความยาว 4-20 ตัวอักษร"
            });
        }

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Role ไม่ถูกต้อง"
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Status ไม่ถูกต้อง"
            });
        }

        const [users] = await db.query(
            "SELECT id, role FROM users WHERE id = ?",
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "ไม่พบ User"
            });
        }

        const [duplicateUsers] = await db.query(
            `SELECT id FROM users
             WHERE (username = ? OR email = ?)
               AND id <> ?`,
            [username, email, id]
        );

        if (duplicateUsers.length > 0) {
            return res.status(409).json({
                message: "Username หรือ Email นี้ถูกใช้งานแล้ว"
            });
        }

        if (users[0].role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
            const [superAdmins] = await db.query(
                "SELECT COUNT(*) AS total FROM users WHERE role = 'SUPER_ADMIN'"
            );

            if (superAdmins[0].total <= 1) {
                return res.status(400).json({
                    message: "ต้องมี Super Admin อย่างน้อย 1 คน"
                });
            }
        }

        await db.query(
            `UPDATE users
             SET username = ?, email = ?, role = ?, status = ?
             WHERE id = ?`,
            [username, email, role, status, id]
        );

        res.status(200).json({
            message: "แก้ไข User สำเร็จ"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาดใน Server"
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // ตรวจสอบว่ามี User หรือไม่
        const [users] = await db.query(
            "SELECT id, role FROM users WHERE id = ?",
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "ไม่พบ User"
            });
        }

        // ป้องกันการลบ Super Admin
        if (users[0].role === "SUPER_ADMIN") {
            return res.status(403).json({
                message: "ไม่สามารถลบ Super Admin ได้"
            });
        }

        await db.query(
            "DELETE FROM users WHERE id = ?",
            [id]
        );

        res.status(200).json({
            message: "ลบ User สำเร็จ"
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
    activateUser,
    updateUser,
    deleteUser
};
