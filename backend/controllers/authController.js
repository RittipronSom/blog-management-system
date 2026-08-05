const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // ตรวจสอบว่ากรอกข้อมูลครบไหม
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "กรุณากรอกข้อมูลให้ครบ"
            });
        }

        // Username 4-20 ตัว
        if (username.length < 4 || username.length > 20) {
            return res.status(400).json({
                message: "Username ต้องมีความยาว 4-20 ตัวอักษร"
            });
        }

        // Password อย่างน้อย 8 ตัว
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password ต้องมีความยาวอย่างน้อย 8 ตัวอักษร"
            });
        }

        // ตรวจสอบ Email ซ้ำ
        const [existingUser] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "Email นี้ถูกใช้งานแล้ว"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // เพิ่ม User
        const [result] = await db.query(
            `INSERT INTO users
            (username, email, password)
            VALUES (?, ?, ?)`,
            [username, email, hashedPassword]
        );

        return res.status(201).json({
            message: "สมัครสมาชิกสำเร็จ กรุณารอ Admin Active User"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "เกิดข้อผิดพลาดใน Server"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ตรวจสอบว่ากรอกข้อมูลครบไหม
        if (!email || !password) {
            return res.status(400).json({
                message: "กรุณากรอก Email และ Password"
            });
        }

        // ค้นหา User จาก Email
        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Email หรือ Password ไม่ถูกต้อง"
            });
        }

        const user = users[0];

        // ตรวจสอบว่า User Active แล้วหรือยัง
        if (user.status === "PENDING") {
            return res.status(403).json({
                message: "บัญชีของคุณยังไม่ได้รับการ Active จาก Admin"
            });
        }

        // ตรวจสอบ Password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Email หรือ Password ไม่ถูกต้อง"
            });
        }

        // สร้าง JWT
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "เข้าสู่ระบบสำเร็จ",
            token
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "เกิดข้อผิดพลาดใน Server"
        });
    }
};

module.exports = {
    register,
    login
};