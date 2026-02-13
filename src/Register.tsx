import { useState } from "react";
import { User, Employee } from "./data"; 
import { getUsers, saveUsers, getEmployees, saveEmployees } from "./storageUtils"; 
import "./Login.css";

interface RegisterProps {
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
}

export default function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Admin" | "Manager" | "Team Lead" | "Employee">("Employee");
  const [domain, setDomain] = useState<"Frontend" | "Backend" | "UI/UX" | "QA" | "DevOps">("Frontend");
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const users = getUsers();
    const employees = getEmployees();

    // 1. Check if email already exists
    if (users.find(u => u.email === email)) {
      setError("Email already registered");
      return;
    }

    // 2. Create New User for Auth
    const newUser: User = {
      id: Date.now(), // Unique ID generation
      name,
      email,
      password,
      role
    };

    // 3. Create New Employee for Dashboard Team Table
    const newEmployee: Employee = {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
      domain: role === "Admin" ? "Admin" : domain, // Admin gets Admin domain, others get selected domain
      assignedHours: 0
    };

    // 4. Save both to localStorage
    saveUsers([...users, newUser]);
    saveEmployees([...employees, newEmployee]);

    // 5. Complete Registration
    onRegister(newUser);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="logo-text">OptiTask</h2>
        <p className="subtitle">Create your account</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Yogita Sharma"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@optitask.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={e => setRole(e.target.value as any)}>
              <option value="Employee">Employee</option>
              <option value="Team Lead">Team Lead</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* New Domain Field so user can pick their specialty */}
          {role !== "Admin" && (
            <div className="form-group">
              <label>Domain</label>
              <select value={domain} onChange={e => setDomain(e.target.value as any)}>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="UI/UX">UI/UX</option>
                <option value="QA">QA</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary">
            Register
          </button>
        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={onSwitchToLogin}>Login</span>
        </p>
      </div>
    </div>
  );
}