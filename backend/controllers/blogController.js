const db = require("../config/db");
// Create เพิ่มบทความใหม่
const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "กรุณากรอก Title และ Content",
      });
    }

    const [result] = await db.query(
      `INSERT INTO blogs
            (title, content, user_id)
            VALUES (?, ?, ?)`,
      [title, content, req.user.id],
    );

    res.status(201).json({
      message: "สร้างบทความสำเร็จ",
      blogId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "เกิดข้อผิดพลาดใน Server",
    });
  }
};

//Read แสดงรายการบทความทั้งหมด
const getAllBlogs = async (req, res) => {
  try {
    const [blogs] = await db.query(`
            SELECT
                blogs.id,
                blogs.title,
                blogs.content,
                blogs.user_id,
                blogs.created_at,
                users.username AS username
            FROM blogs
            INNER JOIN users
                ON blogs.user_id = users.id
            ORDER BY blogs.created_at DESC
        `);

    res.status(200).json({
      blogs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "เกิดข้อผิดพลาดใน Server",
    });
  }
};

//Read by ID แสดงข้อมูลบทความที่เลือก
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const [blogs] = await db.query(
      `
            SELECT
                blogs.id,
                blogs.title,
                blogs.content,
                blogs.user_id,
                blogs.created_at,
                blogs.updated_at,
                users.username AS username
            FROM blogs
            INNER JOIN users
            ON blogs.user_id = users.id
            WHERE blogs.id = ?
        `,
      [id],
    );

    if (blogs.length === 0) {
      return res.status(404).json({
        message: "ไม่พบบทความ",
      });
    }

    res.status(200).json({
      blog: blogs[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "เกิดข้อผิดพลาดใน Server",
    });
  }
};

// แก้ไขบทความ
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "กรุณากรอก Title และ Content",
      });
    }
    
    // หา Blog ก่อน
    const [blogs] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);

    if (blogs.length === 0) {
      return res.status(404).json({
        message: "ไม่พบบทความ",
      });
    }

    const blog = blogs[0];

    // ตรวจว่าเป็นเจ้าของ Blog หรือเป็น SUPER_ADMIN
    if (blog.user_id !== req.user.id && req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        message: "คุณไม่มีสิทธิ์แก้ไขบทความนี้",
      });
    }

    // Update
    await db.query(
      `UPDATE blogs
             SET title = ?, content = ?
             WHERE id = ?`,
      [title, content, id],
    );

    res.status(200).json({
      message: "แก้ไขบทความสำเร็จ",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "เกิดข้อผิดพลาดใน Server",
    });
  }
};

// ลบบทความ
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // หา Blog
    const [blogs] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);

    if (blogs.length === 0) {
      return res.status(404).json({
        message: "ไม่พบบทความ",
      });
    }

    const blog = blogs[0];

    // ถ้าไม่ใช่เจ้าของ และไม่ใช่ Super Admin
    if (blog.user_id !== req.user.id && req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        message: "คุณไม่มีสิทธิ์ลบบทความนี้",
      });
    }

    // ลบ Blog
    await db.query("DELETE FROM blogs WHERE id = ?", [id]);

    res.status(200).json({
      message: "ลบบทความสำเร็จ",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "เกิดข้อผิดพลาดใน Server",
    });
  }
};

// ค้นหาบทความ
const searchBlogs = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        message: "กรุณาระบุ Keyword",
      });
    }

    const searchKeyword = `%${keyword}%`;

    const [blogs] = await db.query(
      `
            SELECT
                blogs.id,
                blogs.title,
                blogs.content,
                blogs.created_at,
                users.username AS username
            FROM blogs
            INNER JOIN users
                ON blogs.user_id = users.id
            WHERE blogs.title LIKE ?
               OR blogs.content LIKE ?
            ORDER BY blogs.created_at DESC
        `,
      [searchKeyword, searchKeyword],
    );

    res.status(200).json({
      blogs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "เกิดข้อผิดพลาดใน Server",
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  searchBlogs,
};
