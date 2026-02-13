import React, { useState } from "react";
import { Task, User, Employee } from "./data";

interface TasksProps {
  user: User;
  tasks: Task[]; // 👈 ADD THIS - Live tasks from Dashboard
  employees: Employee[]; // 👈 ADD THIS - To show assigned person
  onDeleteTask: (taskId: number) => void; // 👈 ADD THIS - Delete functionality
  onMoveTask: (taskId: number, newStatus: Task["status"]) => void; // 👈 ADD THIS - Move functionality
}

export default function Tasks({ 
  user, 
  tasks, 
  employees,
  onDeleteTask,
  onMoveTask 
}: TasksProps) {
  const [filter, setFilter] = useState<"all" | "todo" | "inprogress" | "done">("all");
  
  const filteredTasks: Task[] = tasks.filter((task: Task) => 
    filter === "all" || task.status === filter
  );

  const canManageTasks = user.role === "Admin" || user.role === "Manager";

  return (
    <div className="main">
      <div className="topbar">
        <h2>📋 All Tasks ({tasks.length})</h2>
        <div className="filter-tabs">
          {["all", "todo", "inprogress", "done"].map((status) => (
            <button 
              key={status}
              className={`tab-btn ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status as any)}
            >
              {status === "all" ? "All" : 
               status === "todo" ? "To Do" :
               status === "inprogress" ? "In Progress" : "Done"}
            </button>
          ))}
        </div>
      </div>

      <div className="table">
        <div className="tasks-grid">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <h3>No tasks found</h3>
              <p>Try changing the filter</p>
            </div>
          ) : (
            filteredTasks.map((task: Task) => {
              const assignedEmp = employees.find(e => e.id === task.assignedTo);
              const isMyTask = task.assignedTo === user.id;

              return (
                <div key={task.id} className={`task-card ${task.status}`}>
                  {/* Header with Delete Button */}
                  <div className="task-header">
                    <strong>{task.name}</strong>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span className={`badge ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      {canManageTasks && (
                        <button 
                          className="delete-task-icon"
                          onClick={() => onDeleteTask(task.id)}
                          title="Delete task"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Task Meta */}
                  <p className="task-meta">
                    {task.hours} hrs • {task.domain}
                  </p>

                  {/* Status Badge */}
                  <p className="task-meta">
                    <span className={`status ${
                      task.status === "done" ? "green" : 
                      task.status === "inprogress" ? "yellow" : "red"
                    }`}>
                      {task.status === "todo" ? "📝 To Do" :
                       task.status === "inprogress" ? "🚀 In Progress" : "✅ Done"}
                    </span>
                  </p>

                  {/* Assigned Person */}
                  {assignedEmp && (
                    <p className="assigned-to">
                      👤 {task.status === "done" ? "Completed by" : "Assigned to"} {assignedEmp.name}
                    </p>
                  )}

                  {/* Deadline */}
                  {task.deadline && (
                    <p className="task-deadline">📅 Due: {task.deadline}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="task-actions">
                    {/* TO DO → IN PROGRESS */}
                    {task.status === "todo" && (isMyTask || canManageTasks) && (
                      <button 
                        className="start-btn"
                        onClick={() => onMoveTask(task.id, "inprogress")}
                      >
                        ▶ Start
                      </button>
                    )}

                    {/* IN PROGRESS → DONE */}
                    {task.status === "inprogress" && (isMyTask || canManageTasks) && (
                      <button 
                        className="done-btn"
                        onClick={() => onMoveTask(task.id, "done")}
                      >
                        ✓ Mark Done
                      </button>
                    )}

                    {/* DONE → Show completion */}
                    {task.status === "done" && (
                      <span style={{ color: "#10B981", fontWeight: 600, fontSize: "14px" }}>
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}