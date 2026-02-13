import { useState } from "react";
import { Task, Employee } from "./data";  // 👈 Added Employee import
import "./AddTaskModal.css";

interface AssignTaskModalProps {
  task: Task;
  employees: Employee[];  // 👈 LIVE employees from Dashboard
  onClose: () => void;
  onAssign: (taskId: number, employeeId: number) => void;
}

export default function AssignTaskModal({ 
  task, 
  employees,  // 👈 Now receives live state
  onClose, 
  onAssign 
}: AssignTaskModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  // 👉 Sort employees: Free → Moderate → Overloaded (LIVE data)
  const sortedEmployees = [...employees]
    .filter(emp => emp.role !== "Admin") // Don't assign to Admin
    .sort((a, b) => a.assignedHours - b.assignedHours);

  const getEmployeeStatus = (hours: number) => {
    if (hours > 40) return { text: "Overloaded", color: "#EF4444", icon: "❌" };
    if (hours >= 20) return { text: "Moderate", color: "#FACC15", icon: "⚠️" };
    return { text: "Available", color: "#22C55E", icon: "✅" };
  };

  const handleAssign = () => {
    if (selectedEmployee) {
      onAssign(task.id, selectedEmployee);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>👥 Assign Task</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: "24px" }}>
          <div className="task-info">
            <h4>{task.name}</h4>
            <p style={{ color: "#64748B", fontSize: "14px" }}>
              {task.hours} hours • {task.domain} • {task.priority} Priority
            </p>
          </div>

          <div className="employee-list">
            <label style={{ display: "block", marginBottom: "12px", fontWeight: 600 }}>
              Select Team Member:
            </label>
            
            {sortedEmployees.length === 0 ? (
              <p style={{ color: "#64748B", fontStyle: "italic" }}>
                No available team members
              </p>
            ) : (
              sortedEmployees.map(emp => {
                const status = getEmployeeStatus(emp.assignedHours);
                const willOverload = emp.assignedHours + task.hours > 40;
                
                return (
                  <div
                    key={emp.id}
                    className={`employee-option ${selectedEmployee === emp.id ? "selected" : ""}`}
                    onClick={() => setSelectedEmployee(emp.id)}
                  >
                    <div>
                      <strong>{emp.name}</strong>
                      <span className="role-badge">({emp.role})</span>
                      <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
                        {emp.domain} • {emp.assignedHours}/40 hrs
                      </div>
                    </div>
                    
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: status.color, fontSize: "14px", fontWeight: 600 }}>
                        {status.icon} {status.text}
                      </div>
                      {willOverload && (
                        <div style={{ fontSize: "11px", color: "#EF4444", marginTop: "4px" }}>
                          ⚠️ Will be {emp.assignedHours + task.hours}/40 hrs
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="modal-actions">
            <button onClick={onClose} className="btn-cancel">Cancel</button>
            <button 
              onClick={handleAssign} 
              className="btn-submit"
              disabled={!selectedEmployee}
            >
              Assign Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
