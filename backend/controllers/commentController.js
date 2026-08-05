const db = require("../config/db");

const createComment = async (req, res) => {
    try {
        const { blog_id, content } = req.body; // const blog_id = req.body.blog_id เขียนเหมือนกัน
        // blog_id = 
        if (!blog_id || !content) {
            return res.status(400).json({
                message: "กรุณาระบุ Blog ID และ Content"
            });
        }

        // เช็กก่อนว่า Blog มีอยู่จริงไหม
        const [blogs] = await db.query(
            "SELECT id FROM blogs WHERE id = ?",
            [blog_id]
        );

        if (blogs.length === 0) {
            return res.status(404).json({
                message: "ไม่พบบทความ"
            });
        }

        // สร้าง Comment
        const [result] = await db.query(
            `INSERT INTO comments
            (blog_id, user_id, content)
            VALUES (?, ?, ?)`,
            [blog_id, req.user.id, content]
        );

        res.status(201).json({
            message: "สร้าง Comment สำเร็จ",
            commentId: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาดใน Server"
        });
    }
};
const getCommentsByBlog = async (req, res) => {
    try {
        const { blogId } = req.params;

        const [comments] = await db.query(`
            SELECT
                comments.id,
                comments.blog_id,
                comments.content,
                comments.created_at,
                users.username
            FROM comments
            INNER JOIN users
                ON comments.user_id = users.id
            WHERE comments.blog_id = ?
            ORDER BY comments.created_at ASC
        `, [blogId]);

        res.status(200).json({
            comments
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาดใน Server"
        });
    }
};

module.exports = {
    createComment,
    getCommentsByBlog
};