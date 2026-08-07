import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";

const getBlog = async (id) => {
  const response = await api.get(`/blogs/${id}`);
  return response.data.blog || response.data;
};

const getComments = async (id) => {
  const response = await api.get(`/comments/blog/${id}`);
  return response.data.comments || [];
};

function BlogDetail() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadBlogDetail = async () => {
      try {
        const [nextBlog, nextComments] = await Promise.all([
          getBlog(id),
          getComments(id),
        ]);

        if (isActive) {
          setBlog(nextBlog);
          setComments(nextComments);
        }
      } catch (error) {
        console.log(error.response?.data || error);
      }
    };

    loadBlogDetail();

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [comments]);

  const refreshComments = async () => {
    const nextComments = await getComments(id);
    setComments(nextComments);
  };

  const handleAddComment = async (event) => {
    event.preventDefault();

    if (!commentText.trim()) return;

    try {
      await api.post("/comments", {
        blog_id: id,
        content: commentText,
      });

      setCommentText("");
      await refreshComments();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || "ไม่สามารถเพิ่ม Comment ได้");
    }
  };

  if (!blog) {
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link to="/home" className="btn btn--ghost btn--sm" style={{ marginBottom: "1.5rem" }}>
        ← Back
      </Link>

      <header className="article-header">
        <h1>{blog.title}</h1>
        <p className="article-meta">
          {blog.username} ·{" "}
          {new Date(blog.created_at).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      <div className="article-body">{blog.content}</div>

      <section className="comments-section">
        <h2>Comments ({comments.length})</h2>

        {comments.length === 0 ? (
          <p className="page-header__subtitle">No comments yet. Be the first.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} id={`comment-${comment.id}`} className="comment">
              <p className="comment__author">{comment.username}</p>
              <p className="comment__content">{comment.content}</p>
              <time className="comment__time">
                {new Date(comment.created_at).toLocaleString("th-TH")}
              </time>
            </div>
          ))
        )}

        <form className="comment-form" onSubmit={handleAddComment}>
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />
          <button type="submit" className="btn btn--primary btn--sm" style={{ alignSelf: "flex-start" }}>
            Post
          </button>
        </form>
      </section>
    </Layout>
  );
}

export default BlogDetail;
