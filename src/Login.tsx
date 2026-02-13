import { useState } from "react";
import { getUsers } from "./storageUtils";
import "./Login.css";

interface LoginProps {
  onLogin: (user: any) => void;
  onSwitchToRegister: () => void;
}

export default function Login({ onLogin, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 👉 Get users from localStorage
    const users = getUsers();
    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      onLogin(user);
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>OptiTask</h2>
        <p className="subtitle">Login to your account</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@flux.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={onSwitchToRegister}>Register</span>
        </p>
      </div>
    </div>
  );
}