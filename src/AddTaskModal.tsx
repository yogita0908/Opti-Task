import { useState } from "react";
import { Task } from "./data";
import "./AddTaskModal.css";

interface AddTaskModalProps {
  onClose: () => void;
  onAddTask: (task: Omit<Task, "id">) => void;
  userId: number; // who is creating the task
}

export default function AddTaskModal({ onClose, onAddTask, userId }: AddTaskModalProps) {
  const [name, setName] = useState("");
  const [hours, setHours] = useState(8);
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [domain, setDomain] = useState<"Frontend" | "Backend" | "UI/UX" | "QA" | "DevOps">("Frontend");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddTask({
      name,
      hours,
      priority,
      domain,
      deadline,
      status: "todo",
      createdBy: userId
    });
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>➕ Add New Task</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Name *</label>
            <input
              type="text"
              placeholder="e.g., Design Login Page"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Estimated Hours *</label>
              <input
                type="number"
                min="1"
                max="100"
                value={hours}
                onChange={e => setHours(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label>Priority *</label>
              <select value={priority} onChange={e => setPriority(e.target.value as any)}>
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Domain *</label>
              <select value={domain} onChange={e => setDomain(e.target.value as any)}>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="UI/UX">UI/UX</option>
                <option value="QA">QA</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>

            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}