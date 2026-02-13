import { useState, useEffect } from "react";
import { getTasks, getEmployees } from "./storageUtils";
import { User } from "./data";
import "./NotificationPanel.css";

interface NotificationsPanelProps {
  user: User;
  onClose: () => void;
}

export default function NotificationsPanel({ user, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const tasks = getTasks();
    const employees = getEmployees();
    const notifs: any[] = [];

    // 1. Tasks assigned to user
    tasks
      .filter(t => t.assignedTo === user.id && t.status !== "done")
      .forEach(task => {
        notifs.push({
          id: `task-${task.id}`,
          type: "task",
          message: `You were assigned: "${task.name}"`,
          time: "2 hours ago",
          icon: "📋"
        });
      });

    // 2. Overloaded members (Admin/Manager only)
    if (user.role === "Admin" || user.role === "Manager") {
      employees
        .filter(emp => emp.assignedHours > 40)
        .forEach(emp => {
          notifs.push({
            id: `overload-${emp.id}`,
            type: "warning",
            message: `${emp.name} is overloaded (${emp.assignedHours}/40 hrs)`,
            time: "1 day ago",
            icon: "⚠️"
          });
        });
    }

    // 3. Completed tasks
    tasks
      .filter(t => t.status === "done" && t.assignedTo === user.id)
      .slice(0, 2)
      .forEach(task => {
        notifs.push({
          id: `done-${task.id}`,
          type: "success",
          message: `You completed: "${task.name}"`,
          time: "3 days ago",
          icon: "✅"
        });
      });

    setNotifications(notifs);
  }, [user]);

  return (
    <div className="notifications-overlay" onClick={onClose}>
      <div className="notifications-panel" onClick={e => e.stopPropagation()}>
        <div className="notifications-header">
          <h3>🔔 Notifications</h3>
          <button className="close-notif-btn" onClick={onClose}>✕</button>
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className="notification-item">
                <span className="notif-icon">{notif.icon}</span>
                <div className="notif-content">
                  <p className="notif-message">{notif.message}</p>
                  <span className="notif-time">{notif.time}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="notifications-footer">
          <button className="mark-read-btn">Mark all as read</button>
        </div>
      </div>
    </div>
  );
}