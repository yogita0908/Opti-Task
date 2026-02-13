import React, { useState } from "react";
import { tasks, employees, User } from "./data";

interface ReportsProps {
  user: User;
}

export default function Reports({ user }: ReportsProps) {
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month");
  
  const stats = {
    totalTasks: tasks.length,
    completed: tasks.filter(t => t.status === "done").length,
    avgCompletion: tasks.length > 0 ? 
      (tasks.filter(t => t.status === "done").length / tasks.length * 100).toFixed(1) : "0",
    topPerformer: employees.reduce((top, emp) => 
      emp.assignedHours > top.assignedHours ? emp : top
    )
  };

  const canViewReports = user.role === "Admin" || user.role === "Manager" || user.role === "Team Lead";

  if (!canViewReports) {
    return (
      <div className="main">
        <div className="empty-state">
          <h3>🔒 Access Denied</h3>
          <p>Reports are available for Admin, Manager, and Team Lead roles only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="topbar">
        <h2>📈 Reports - {period.toUpperCase()}</h2>
        <select 
          className="period-selector"
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      <div className="stats-grid">
        <div className="report-card">
          <h4>Total Tasks</h4>
          <h2>{stats.totalTasks}</h2>
          <small>{stats.completed} completed</small>
        </div>
        <div className="report-card highlight">
          <h4>Completion Rate</h4>
          <h2>{stats.avgCompletion}%</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${stats.avgCompletion}%` }}
            />
          </div>
        </div>
        <div className="report-card">
          <h4>Top Performer</h4>
          <h2>{stats.topPerformer.name}</h2>
          <small>{stats.topPerformer.domain} • {stats.topPerformer.assignedHours}h</small>
        </div>
      </div>

      <div className="table">
        <h3>Task Completion by Domain</h3>
        <table className="reports-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Total</th>
              <th>Done</th>
              <th>Pending</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {["Frontend", "Backend", "UI/UX", "QA", "DevOps"].map(domain => {
              const domainTasks = tasks.filter(t => t.domain === domain);
              const done = domainTasks.filter(t => t.status === "done").length;
              return (
                <tr key={domain}>
                  <td><span className="domain-badge">{domain}</span></td>
                  <td>{domainTasks.length}</td>
                  <td>{done}</td>
                  <td>{domainTasks.length - done}</td>
                  <td>
                    <span className="completion-rate">
                      {domainTasks.length ? Math.round(done/domainTasks.length * 100) : 0}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
