import { useState, useEffect } from "react";
import { User, Task } from "./data";
import { getTasks, saveTasks, getEmployees, saveEmployees } from "./storageUtils";
import AddTaskModal from "./AddTaskModal";
import AssignTaskModal from "./AssignTaskModal";
import NotificationsPanel from "./NotificationPanel";
import ProfileDropdown from "./ProfileDropdown";
import AddMemberModal from "./AddMemberModal";
import SearchBar from "./SearchBar";
import Team from "./Team";
import Tasks from "./Task";
import Reports from "./Report";
import Settings from "./Settings";
import "./Dashboard.css";

const getColor = (hours: number) => {
  if (hours > 40) return "#EF4444";
  if (hours >= 20) return "#FACC15";
  return "#22C55E";
};

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [tasks, setTasks] = useState(getTasks());
  const [employees, setEmployees] = useState(getEmployees());
  const [activeSection, setActiveSection] = useState<"dashboard" | "team" | "tasks" | "reports" | "settings">("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [assigningTask, setAssigningTask] = useState<Task | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const canManageTasks = user.role === "Admin" || user.role === "Manager";

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveEmployees(employees);
  }, [employees]);

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Math.max(0, ...tasks.map(t => t.id)) + 1
    };
    setTasks([...tasks, task]);
  };

  const handleAssignTask = (taskId: number, employeeId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(tasks.map(t =>
      t.id === taskId
        ? { ...t, assignedTo: employeeId, status: "inprogress" }
        : t
    ));

    setEmployees(employees.map(emp =>
      emp.id === employeeId
        ? { ...emp, assignedHours: emp.assignedHours + task.hours }
        : emp
    ));
  };

  const handleMoveTask = (taskId: number, newStatus: Task["status"]) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (user.role !== "Admin" && user.role !== "Manager" && task.assignedTo !== user.id) {
      alert("You can only move your own tasks!");
      return;
    }

    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
  };

  // 👉 NEW: DELETE TASK (Admin/Manager only)
  const handleDeleteTask = (taskId: number) => {
    if (!canManageTasks) {
      alert("Only Admin/Manager can delete tasks!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this task?")) {
      const task = tasks.find(t => t.id === taskId);
      
      // If task was assigned, reduce employee hours
      if (task && task.assignedTo) {
        setEmployees(employees.map(emp =>
          emp.id === task.assignedTo
            ? { ...emp, assignedHours: Math.max(0, emp.assignedHours - task.hours) }
            : emp
        ));
      }

      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  // 👉 NEW: DELETE MEMBER (Admin/Manager only)
  const handleDeleteMember = (memberId: number) => {
    if (!canManageTasks) {
      alert("Only Admin/Manager can delete members!");
      return;
    }

    const member = employees.find(e => e.id === memberId);
    if (!member) return;

    

    if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      // Remove member's tasks
      setTasks(tasks.filter(t => t.assignedTo !== memberId));
      setEmployees(employees.filter(e => e.id !== memberId));
    }
  };

  const handleSelectTask = (task: Task) => {
    const assignedEmp = employees.find(e => e.id === task.assignedTo);
    alert(
      `Task: ${task.name}\n` +
      `Status: Completed ✓\n` +
      `Domain: ${task.domain}\n` +
      `Hours: ${task.hours}\n` +
      `Completed by: ${assignedEmp ? assignedEmp.name : "Unassigned"}`
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            {/* Stats Cards */}
            <div className="stats">
              <div className="card">
                <h4>Active Projects</h4>
                <h2>2</h2>
                <small style={{ color: "#22C55E" }}>↑ +5%</small>
              </div>
              <div className="card">
                <h4>Budget Spent</h4>
                <h2>₹45,000</h2>
                <small style={{ color: "#64748B" }}>of ₹1,00,000</small>
              </div>
              <div className="card">
                <h4>Team Efficiency</h4>
                <h2>78%</h2>
                <small style={{ color: "#FACC15" }}>⚠ Needs improvement</small>
              </div>
              <div className="card">
                <h4>Overloaded Members</h4>
                <h2>{employees.filter(e => e.assignedHours > 40).length}</h2>
                <small style={{ color: employees.filter(e => e.assignedHours > 40).length > 0 ? "#EF4444" : "#22C55E" }}>
                  {employees.filter(e => e.assignedHours > 40).length > 0 ? "⚠ Action needed" : "✓ All good"}
                </small>
              </div>
            </div>

            {/* Team Workload Table */}
            <div className="table">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                <h3>Team Workload</h3>
                {canManageTasks && (
                  <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
                    ➕ Add Task
                  </button>
                )}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="workload-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Role</th>
                      <th>Domain</th>
                      <th>Hours</th>
                      <th>Capacity</th>
                      <th>Status</th>
                      {canManageTasks && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id}>
                        <td>
                          <strong>{emp.name}</strong>
                          <span className="role-tag">({emp.role})</span>
                        </td>
                        <td>{emp.role}</td>
                        <td><span className="domain-badge">{emp.domain}</span></td>
                        <td><strong>{emp.assignedHours}</strong>/40 hrs</td>
                        <td>
                          <div className="bar">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${Math.min(emp.assignedHours * 2.5, 100)}%`,
                                background: getColor(emp.assignedHours)
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <span className={emp.assignedHours > 40 ? "status red" : "status green"}>
                            {emp.assignedHours > 40 ? "⚠ Overloaded" : "✓ Active"}
                          </span>
                        </td>
                        {canManageTasks && (
                          <td>
                            <button 
                              className="delete-member-btn"
                              onClick={() => handleDeleteMember(emp.id)}
                              disabled={emp.role === "Admin"}
                            >
                              🗑️
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kanban Board */}
            <div className="kanban">
              {/* TO DO */}
              <div className="column">
                <div className="column-header">
                  <h4>📝 To Do</h4>
                  <span className="count-badge">{tasks.filter(t => t.status === "todo").length}</span>
                </div>
                {tasks.filter(t => t.status === "todo").map(t => {
                  const assignedEmp = employees.find(e => e.id === t.assignedTo);
                  const isMyTask = t.assignedTo === user.id;

                  return (
                    <div key={t.id} className="task">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <strong style={{ flex: 1 }}>{t.name}</strong>
                        {canManageTasks && (
                          <button 
                            className="delete-task-icon"
                            onClick={() => handleDeleteTask(t.id)}
                            title="Delete task"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <p className="task-meta">{t.hours} hrs • {t.domain}</p>
                      
                      {assignedEmp && (
                        <p className="assigned-to">👤 Assigned to {assignedEmp.name}</p>
                      )}

                      <div className="task-footer">
                        <span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span>
                        
                        {canManageTasks && !t.assignedTo && (
                          <button className="assign-btn" onClick={() => setAssigningTask(t)}>
                            Assign
                          </button>
                        )}

                        {isMyTask && (
                          <button className="start-btn" onClick={() => handleMoveTask(t.id, "inprogress")}>
                            ▶ Start
                          </button>
                        )}

                        {canManageTasks && t.assignedTo && (
                          <button className="start-btn" onClick={() => handleMoveTask(t.id, "inprogress")}>
                            ▶ Start
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {tasks.filter(t => t.status === "todo").length === 0 && (
                  <div className="empty-state">No tasks yet</div>
                )}
              </div>

              {/* IN PROGRESS */}
              <div className="column">
                <div className="column-header">
                  <h4>🚀 In Progress</h4>
                  <span className="count-badge">{tasks.filter(t => t.status === "inprogress").length}</span>
                </div>
                {tasks.filter(t => t.status === "inprogress").map(t => {
                  const assignedEmp = employees.find(e => e.id === t.assignedTo);
                  const isMyTask = t.assignedTo === user.id;

                  return (
                    <div key={t.id} className="task">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <strong style={{ flex: 1 }}>{t.name}</strong>
                        {canManageTasks && (
                          <button 
                            className="delete-task-icon"
                            onClick={() => handleDeleteTask(t.id)}
                            title="Delete task"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <p className="task-meta">{t.hours} hrs • {t.domain}</p>
                      {assignedEmp && <p className="assigned-to">👤 {assignedEmp.name}</p>}
                      
                      <div className="task-footer">
                        <span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span>
                        
                        {isMyTask && (
                          <button className="done-btn" onClick={() => handleMoveTask(t.id, "done")}>
                            ✓ Done
                          </button>
                        )}

                        {canManageTasks && (
                          <button className="done-btn" onClick={() => handleMoveTask(t.id, "done")}>
                            ✓ Done
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {tasks.filter(t => t.status === "inprogress").length === 0 && (
                  <div className="empty-state">No active tasks</div>
                )}
              </div>

              {/* DONE */}
              <div className="column">
                <div className="column-header">
                  <h4>✅ Done</h4>
                  <span className="count-badge">{tasks.filter(t => t.status === "done").length}</span>
                </div>
                {tasks.filter(t => t.status === "done").map(t => {
                  const assignedEmp = employees.find(e => e.id === t.assignedTo);
                  return (
                    <div key={t.id} className="task done-task">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <strong style={{ flex: 1 }}>{t.name}</strong>
                        {canManageTasks && (
                          <button 
                            className="delete-task-icon"
                            onClick={() => handleDeleteTask(t.id)}
                            title="Delete task"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <p className="task-meta">{t.hours} hrs • {t.domain}</p>
                      {assignedEmp && <p className="assigned-to">✓ Completed by {assignedEmp.name}</p>}
                      <span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span>
                    </div>
                  );
                })}
                {tasks.filter(t => t.status === "done").length === 0 && (
                  <div className="empty-state">No completed tasks</div>
                )}
              </div>
            </div>
          </>
        );
      
      case "team":
        return (
          <Team 
            user={user} 
            employees={employees}
            onAddMember={() => setShowAddMember(true)}
            onDeleteMember={handleDeleteMember}
          />
        );
      case "tasks":
        return (
          <Tasks 
            user={user} 
            tasks={tasks} // 👈 ADD THIS - Live tasks state
            employees={employees} // 👈 ADD THIS - To show assigned person
            onDeleteTask={handleDeleteTask} // 👈 ADD THIS - Delete functionality
            onMoveTask={handleMoveTask} // 👈 ADD THIS - Move functionality
          />
       );
      case "reports":
        return <Reports user={user} />;
      case "settings":
  return <Settings user={user} onLogout={onLogout} />; // 👈 Pass onLogout
      default:
        return null;
    }
  };

  return (
    <div className={`app ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {/* SIDEBAR */}
      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <h1 className="logo-text">OptiTask</h1>
        <ul>
          <li 
            className={activeSection === "dashboard" ? "active" : ""} 
            onClick={() => {
              setActiveSection("dashboard");
              setIsMobileMenuOpen(false);
            }}
          >
            📊 Dashboard
          </li>
          <li 
            className={activeSection === "team" ? "active" : ""} 
            onClick={() => {
              setActiveSection("team");
              setIsMobileMenuOpen(false);
            }}
          >
            👥 Team
          </li>
          <li 
            className={activeSection === "tasks" ? "active" : ""} 
            onClick={() => {
              setActiveSection("tasks");
              setIsMobileMenuOpen(false);
            }}
          >
            📋 Tasks
          </li>
          <li 
            className={activeSection === "reports" ? "active" : ""} 
            onClick={() => {
              setActiveSection("reports");
              setIsMobileMenuOpen(false);
            }}
          >
            📈 Reports
          </li>
          <li 
            className={activeSection === "settings" ? "active" : ""} 
            onClick={() => {
              setActiveSection("settings");
              setIsMobileMenuOpen(false);
            }}
          >
            ⚙️ Settings
          </li>
        </ul>
        {canManageTasks && (
          <div style={{ padding: "16px", marginTop: "auto" }}>
            <button 
              className="add-member-sidebar-btn"
              onClick={() => {
                setShowAddMember(true);
                setIsMobileMenuOpen(false);
              }}
            >
              ➕ Add Member
            </button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="main">
        {/* TOP BAR */}
        <div className="topbar">
          {/* 🍔 Hamburger Menu (Mobile only) */}
          <button 
            className="mobile-hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </button>

          <SearchBar tasks={tasks} onSelectTask={handleSelectTask} />
          
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "14px", color: "#64748B" }}>
              Welcome, <strong>{user.name}</strong>
              <span className="user-role-badge">({user.role})</span>
            </span>
            
            <div className="icon-btn" onClick={() => setShowNotifications(true)}>
              🔔
              <span className="notification-badge">0</span>
            </div>
            
            <div className="icon-btn" onClick={() => setShowProfile(true)}>
              👤
            </div>
            
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>

        <div className="content-section">
          {renderSection()}
        </div>
      </div>

      {/* MODALS */}
      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onAddTask={handleAddTask}
          userId={user.id}
        />
      )}

      {assigningTask && (
        <AssignTaskModal
          task={assigningTask}
          employees={employees}
          onClose={() => setAssigningTask(null)}
          onAssign={handleAssignTask}
        />
      )}

      {showNotifications && (
        <NotificationsPanel
          user={user}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {showProfile && (
        <ProfileDropdown
          user={user}
          onClose={() => setShowProfile(false)}
          onLogout={onLogout}
        />
      )}

      {showAddMember && (
        <AddMemberModal onClose={() => setShowAddMember(false)} />
      )}
    </div>
  );
}