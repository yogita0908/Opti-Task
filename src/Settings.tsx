import React, { useState, useEffect } from "react";
import { User } from "./data";
import { getEmployees, saveEmployees, getUsers, saveUsers } from "./storageUtils";

interface SettingsProps {
  user: User;
  onLogout: () => void; 
}

export default function Settings({ user, onLogout }: SettingsProps) {
  const employees = getEmployees(); 
  const users = getUsers(); 
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  

  const [notifications, setNotifications] = useState({
    taskAlerts: true,
    deadlineReminders: true,
    weeklyReports: false,
    overloadAlerts: true
  });

  // 👉 NEW: Theme state
  const [theme, setTheme] = useState<"light" | "dark" | "auto">(
    (localStorage.getItem("optitask-theme") as "light" | "dark" | "auto") || "light"
  );

  const canEditSettings = user.role === "Admin" || user.role === "Manager";

  // 👉 NEW: Apply theme on mount and change
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (selectedTheme: "light" | "dark" | "auto") => {
    if (selectedTheme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.body.classList.toggle("dark-theme", prefersDark);
    } else {
      document.body.classList.toggle("dark-theme", selectedTheme === "dark");
    }
    localStorage.setItem("optitask-theme", selectedTheme);
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    if (profile.newPassword !== profile.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Profile updated:", profile);
    alert("Profile updated successfully!");
    setEditing(false);
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handleDeleteAllData = () => {
    if (window.confirm("⚠️ This will delete ALL data permanently. Continue?")) {
      localStorage.clear();
      alert("All data deleted! Refreshing...");
      window.location.reload();
    }
  };

  const handleResetTasks = () => {
    if (window.confirm("⚠️ This will reset all tasks to default. Continue?")) {
      localStorage.removeItem("flux_tasks");
      alert("Tasks reset! Refreshing...");
      window.location.reload();
    }
  };

  return (
    <div className="main">
      <div className="topbar">
        <h2>⚙️ Settings</h2>
        <span className="section-subtitle">Manage your account and preferences</span>
      </div>

      <div className="settings-grid">
        {/* Profile Section */}
        <div className="settings-card">
          <h3>👤 Profile Information</h3>
          {editing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Name</label>
                <input 
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={profile.currentPassword}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  name="newPassword"
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={profile.newPassword}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={profile.confirmPassword}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div className="form-buttons">
                <button className="save-btn" onClick={handleSaveProfile}>
                  💾 Save Changes
                </button>
                <button 
                  className="cancel-btn" 
                  onClick={() => {
                    setEditing(false);
                    setProfile({
                      name: user.name,
                      email: user.email,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: ""
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-display">
              <div className="profile-info">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> 
                  <span className={`role-badge ${user.role.toLowerCase().replace(' ', '-')}`}>
                    {user.role}
                  </span>
                </p>
                <p><strong>Member since:</strong> Jan 2026</p>
              </div>
              <button className="edit-btn" onClick={() => setEditing(true)}>
                ✏️ Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <h3>🔔 Notifications</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="taskAlerts"
                checked={notifications.taskAlerts}
                onChange={handleNotificationChange}
              />
              <span>Task Assignment Alerts</span>
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="deadlineReminders"
                checked={notifications.deadlineReminders}
                onChange={handleNotificationChange}
              />
              <span>Deadline Reminders (24h before)</span>
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="weeklyReports"
                checked={notifications.weeklyReports}
                onChange={handleNotificationChange}
              />
              <span>Weekly Progress Reports</span>
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="overloadAlerts"
                checked={notifications.overloadAlerts}
                onChange={handleNotificationChange}
              />
              <span>Workload Overload Alerts</span>
            </label>
          </div>
          <button className="save-btn" style={{ marginTop: "20px", width: "100%" }}>
            Save Notification Preferences
          </button>
        </div>

        {/* App Preferences (Admin/Manager only) */}
        {canEditSettings && (
          <div className="settings-card">
            <h3>⚙️ App Preferences</h3>
            <div className="form-group">
              <label>Default Dashboard View</label>
              <select className="form-select">
                <option>Dashboard</option>
                <option>Team Workload</option>
                <option>Tasks</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Zone</label>
              <select className="form-select">
                <option>Asia/Kolkata (IST)</option>
                <option>UTC</option>
                <option>US/Pacific</option>
              </select>
            </div>
            
            {/* 👉 UPDATED: Theme Switcher */}
            <div className="form-group">
              <label>Theme</label>
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button 
                  className={`theme-btn ${theme === "light" ? "active" : ""}`}
                  onClick={() => handleThemeChange("light")}
                >
                  ☀️ Light
                </button>
                <button 
                  className={`theme-btn ${theme === "dark" ? "active" : ""}`}
                  onClick={() => handleThemeChange("dark")}
                >
                  🌙 Dark
                </button>
                <button 
                  className={`theme-btn ${theme === "auto" ? "active" : ""}`}
                  onClick={() => handleThemeChange("auto")}
                >
                  🔄 Auto
                </button>
              </div>
              <small style={{ display: "block", marginTop: "8px", color: "#64748B", fontSize: "12px" }}>
                {theme === "auto" ? "Follows system preference" : `${theme.charAt(0).toUpperCase() + theme.slice(1)} mode active`}
              </small>
            </div>
            
            <div className="form-buttons">
              <button className="save-btn">Apply Preferences</button>
            </div>
          </div>
        )}

        {/* Danger Zone (Admin only) */}
        {user.role === "Admin" && (
          <div className="settings-card danger-zone">
            <h3>⚠️ Danger Zone</h3>
            <p style={{ color: "#64748B", marginBottom: "20px" }}>
              These actions are permanent and cannot be undone.
            </p>
            <div className="danger-actions">
              <button className="delete-btn" onClick={handleDeleteAllData}>
                🗑️ Delete All Data
              </button>
              <button className="reset-btn" onClick={handleResetTasks}>
                🔄 Reset All Tasks
              </button>
              <button 
        className="leave-btn" 
        onClick={() => {
          if (window.confirm("⚠️ Are you sure you want to leave the organization? You will lose admin access.")) {
            // Remove current user from employees
            const updatedEmployees = employees.filter(e => e.id !== user.id);
            saveEmployees(updatedEmployees);
            
            // Remove user from users list
            const updatedUsers = users.filter(u => u.id !== user.id);
            saveUsers(updatedUsers);
            
            alert("You have left the organization. Logging out...");
            onLogout();
          }
        }}
      >
        🚪 Leave Organization
      </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}