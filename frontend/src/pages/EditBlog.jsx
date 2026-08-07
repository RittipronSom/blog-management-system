import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";

const getBlog = async (id) => {
  const response = await api.get(`/blogs/${id}`);
  return response.data.blog;
};

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadBlog = async () => {
      try {
        const blog = await getBlog(id);

        if (isActive) {
          setTitle(blog.title);
          setContent(blog.content);
        }
      } catch (error) {
        console.error("GET BLOG ERROR:", error.response?.data || error);

        if (isActive) {
          alert("ไม่สามารถโหลดบทความได้");
          navigate("/home");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadBlog();

    return () => {
      isActive = false;
    };
  }, [id, navigate]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("กรุณากรอก Title และ Content");
      return;
    }

    try {
      await api.put(`/blogs/${id}`, {
        title,
        content,
      });

      navigate("/home");
    } catch (error) {
      console.error("UPDATE ERROR:", error.response?.data || error);
      alert(error.response?.data?.message || "ไม่สามารถแก้ไขบทความได้");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="form-page">
        <h1>Edit</h1>

        <form className="form-stack" onSubmit={handleUpdate}>
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary">
              Save
            </button>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => navigate("/home")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default EditBlog;
