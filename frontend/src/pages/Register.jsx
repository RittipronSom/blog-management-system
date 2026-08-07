import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">Blog</div>

      <div className="auth-card">
        <h1>Create account</h1>

        <form className="auth-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          <button type="submit" className="btn btn--primary">
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
