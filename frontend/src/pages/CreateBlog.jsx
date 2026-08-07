import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("กรุณากรอก Title และ Content");
      return;
    }

    try {
      const response = await api.post("/blogs", {
        title,
        content,
      });

      const blogId =
        response.data.blogId || response.data.id || response.data.data?.id;

      if (blogId) {
        navigate(`/blogs/${blogId}`);
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("CREATE ERROR:", error.response?.data || error);
      alert("Failed to create blog");
    }
  };

  return (
    <Layout>
      <div className="form-page">
        <h1>Write</h1>

        <form className="form-stack" onSubmit={handleCreate}>
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Give your story a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              placeholder="Start writing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary">
              Publish
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

export default CreateBlog;
