import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

function Layout({ children, wide = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const [notifCount, setNotifCount] = useState(0);

  const fetchNotificationCount = useCallback(async () => {
    try {
      const response = await api.get("/notifications/count");
      setNotifCount(response.data.count);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!isAuthPage && user) {
      fetchNotificationCount();
    }
  }, [isAuthPage, user, location.pathname, fetchNotificationCount]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app">
      {!isAuthPage && user && (
        <header className="site-header">
          <div className="site-header__inner">
            <Link to="/home" className="site-logo">
              Blog
            </Link>

            <nav className="site-nav">
              <div className="site-nav__links">
                <Link to="/home">Home</Link>
                <Link to="/create-blog">Create</Link>
                <Link to="/notifications" className="site-nav__notif">
                  Notifications
                  {notifCount > 0 && (
                    <span className="notif-badge">{notifCount}</span>
                  )}
                </Link>
                {user.role === "SUPER_ADMIN" && (
                  <Link to="/admin">Admin</Link>
                )}
              </div>

              <div className="site-nav__account">
                <span className="site-nav__user">{user.username}</span>
                <button type="button" className="btn btn--ghost" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </header>
      )}

      <main className={`site-main${wide ? " site-main--wide" : ""}`}>
        {children}
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Blog — write simply.</p>
      </footer>
    </div>
  );
}

export default Layout;
