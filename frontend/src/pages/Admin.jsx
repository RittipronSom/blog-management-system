import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

const roleOptions = ["SUPER_ADMIN", "GENERAL_USER"];
const statusOptions = ["PENDING", "ACTIVE"];

const getUsers = async () => {
  const response = await api.get("/users");
  return response.data.users || [];
};

function StatusBadge({ status }) {
  return (
    <span className={`badge badge--${status === "ACTIVE" ? "active" : "pending"}`}>
      {status}
    </span>
  );
}

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "GENERAL_USER",
    status: "PENDING",
  });

  useEffect(() => {
    let isActive = true;

    const loadUsers = async () => {
      try {
        const nextUsers = await getUsers();

        if (isActive) {
          setUsers(nextUsers);
        }
      } catch (error) {
        console.error("GET USERS ERROR:", error.response?.data || error);

        if (isActive) {
          alert(error.response?.data?.message || "ไม่สามารถโหลดข้อมูล User ได้");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isActive = false;
    };
  }, []);

  const refreshUsers = async () => {
    const nextUsers = await getUsers();
    setUsers(nextUsers);
  };

  const handleActivate = async (id) => {
    try {
      const response = await api.patch(`/users/${id}/activate`);
      alert(response.data.message || "Active User สำเร็จ");
      await refreshUsers();
    } catch (error) {
      console.error("ACTIVATE ERROR:", error.response?.data || error);
      alert(error.response?.data?.message || "ไม่สามารถ Active User ได้");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบ User นี้ใช่หรือไม่?")) return;

    try {
      const response = await api.delete(`/users/${id}`);
      alert(response.data.message || "ลบ User สำเร็จ");
      await refreshUsers();
    } catch (error) {
      console.error("DELETE ERROR:", error.response?.data || error);
      alert(error.response?.data?.message || "ไม่สามารถลบ User ได้");
    }
  };

  const handleStartEdit = (user) => {
    setEditingUserId(user.id);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleUpdateUser = async (id) => {
    if (!editForm.username.trim() || !editForm.email.trim()) {
      alert("กรุณากรอก Username และ Email");
      return;
    }

    try {
      const response = await api.put(`/users/${id}`, editForm);
      alert(response.data.message || "แก้ไข User สำเร็จ");
      setEditingUserId(null);
      await refreshUsers();
    } catch (error) {
      console.error("UPDATE USER ERROR:", error.response?.data || error);
      alert(error.response?.data?.message || "ไม่สามารถแก้ไข User ได้");
    }
  };

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.username.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;
  const pendingUsers = users.filter((user) => user.status === "PENDING").length;

  if (loading) {
    return (
      <Layout wide>
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout wide>
      <div className="page-header">
        <div>
          <h1>Admin</h1>
          <p className="page-header__subtitle">Manage users and permissions.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Active</h3>
          <p>{activeUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{pendingUsers}</p>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <p>No users found.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => {
                const isEditing = editingUserId === user.id;

                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>

                    <td>
                      {isEditing ? (
                        <input
                          name="username"
                          value={editForm.username}
                          onChange={handleEditChange}
                        />
                      ) : (
                        user.username
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          name="email"
                          type="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                        />
                      ) : (
                        user.email
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <select
                          name="role"
                          value={editForm.role}
                          onChange={handleEditChange}
                        >
                          {roleOptions.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="badge badge--admin">{user.role}</span>
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleEditChange}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <StatusBadge status={user.status} />
                      )}
                    </td>

                    <td>
                      {new Date(user.created_at).toLocaleDateString("th-TH")}
                    </td>

                    <td>
                      <div className="btn-group">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="btn btn--primary btn--sm"
                              onClick={() => handleUpdateUser(user.id)}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn--outline btn--sm"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn btn--outline btn--sm"
                              onClick={() => handleStartEdit(user)}
                            >
                              Edit
                            </button>
                            {user.status !== "ACTIVE" && (
                              <button
                                type="button"
                                className="btn btn--primary btn--sm"
                                onClick={() => handleActivate(user.id)}
                              >
                                Activate
                              </button>
                            )}
                            {user.role !== "SUPER_ADMIN" && (
                              <button
                                type="button"
                                className="btn btn--danger btn--sm"
                                onClick={() => handleDelete(user.id)}
                              >
                                Delete
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

export default Admin;
