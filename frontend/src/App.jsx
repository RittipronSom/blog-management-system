import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BlogDetail from "./pages/BlogDetail";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import Admin from "./pages/Admin";
import Notification from "./pages/Notifications";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/blogs/:id"
        element={
          <ProtectedRoute>
            <BlogDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-blog"
        element={
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-blog/:id"
        element={
          <ProtectedRoute>
            <EditBlog />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
