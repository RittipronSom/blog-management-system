import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";

function Home() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await api.get("/blogs");
      setBlogs(response.data.blogs);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id) => {
    if (!window.confirm("ลบบทความนี้?")) return;

    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Stories</h1>
          <p className="page-header__subtitle">Read and write simply.</p>
        </div>

        <div className="page-header__actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => navigate("/create-blog")}
          >
            Create
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="empty-state">
          <p>No articles yet.</p>
        </div>
      ) : (
        <div className="blog-list">
          {filteredBlogs.map((blog) => (
            <article key={blog.id} className="blog-card">
              <h2 className="blog-card__title">
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </h2>

              <p className="blog-card__meta">
                {blog.username} ·{" "}
                {new Date(blog.created_at).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Bangkok",
                })}
              </p>

              {currentUser &&
                (blog.user_id === currentUser.id ||
                  currentUser.role === "SUPER_ADMIN") && (
                  <div className="blog-card__actions">
                    <Link
                      to={`/blogs/${blog.id}`}
                      className="btn btn--outline btn--sm"
                    >
                      Read
                    </Link>
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={() => navigate(`/edit-blog/${blog.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger btn--sm"
                      onClick={() => handleDelete(blog.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
            </article>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Home;
