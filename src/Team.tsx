import React from "react";
import { Employee, User } from "./data";

interface TeamProps {
  user: User;
  employees: Employee[];
  onAddMember: () => void;
  onDeleteMember: (memberId: number) => void; // 👈 YEH LINE ADD KARO
}

export default function Team({ 
  user, 
  employees,
  onAddMember,
  onDeleteMember // 👈 YEH PARAMETER ADD KARO
}: TeamProps) {
  const canEditTeam = user.role === "Admin" || user.role === "Manager";
  
  return (
    <div className="main">
      <div className="topbar">
        <h2>👥 Team Members ({employees.length})</h2>
        {canEditTeam && (
          <button 
            className="add-task-btn"
            onClick={onAddMember}
          >
            ➕ Add Member
          </button>
        )}
      </div>

      <div className="table">
        <div style={{ overflowX: "auto" }}>
          <table className="team-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Domain</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp: Employee) => ( 
                <tr key={emp.id}>
                  <td>
                    <strong>{emp.name}</strong>
                    <span className="role-tag">({emp.role})</span>
                  </td>
                  <td>
                    <span className={`role-badge ${emp.role.toLowerCase().replace(' ', '-')}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td>
                    <span className="domain-badge">{emp.domain}</span>
                  </td>
                  <td>
                    <strong style={{ color: emp.assignedHours > 40 ? "#EF4444" : "#22C55E" }}>
                      {emp.assignedHours}/40
                    </strong>
                  </td>
                  <td>
                    <span className={emp.assignedHours > 40 ? "status red" : "status green"}>
                      {emp.assignedHours > 40 ? "⚠ Overloaded" : "✓ Active"}
                    </span>
                  </td>
                  <td>
                    {canEditTeam && (
                      <button 
                        className="delete-member-btn"
                        onClick={() => {
                        if (emp.role === "Admin") {
                          if (window.confirm(`⚠️ Are you sure you want to remove ${emp.name} (Admin)? This cannot be undone.`)) {
                            onDeleteMember(emp.id);
                          }
                        } else {
                            onDeleteMember(emp.id);
                        }
                      }}
                      title="Delete member"
                      >
                      🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#64748B", padding: "40px" }}>
                    No team members yet. Add your first member! 👆
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}