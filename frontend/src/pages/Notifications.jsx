import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const handleOpen = async (notification) => {
    try {
      if (!notification.is_read) {
        await api.patch(`/notifications/${notification.id}/read`);
      }

      navigate(
        `/blogs/${notification.blog_id}#comment-${notification.comment_id}`,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data.notifications);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="page-header__subtitle">
            Updates on your articles.
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <p>All caught up. No notifications.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item${!notification.is_read ? " notification-item--unread" : ""}`}
            >
              <p>{notification.message}</p>
              <small>
                {new Date(notification.created_at).toLocaleString("th-TH")}
              </small>

              <div className="notification-item__actions">
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => handleOpen(notification)}
                >
                  View
                </button>

                {!notification.is_read && (
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    onClick={() => handleRead(notification.id)}
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Notifications;
