import { useState } from "react";
import { Employee } from "./data";
import { getEmployees, saveEmployees } from "./storageUtils";
import "./AddTaskModal.css";

interface AddMemberModalProps {
  onClose: () => void;
}

export default function AddMemberModal({ onClose }: AddMemberModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"Employee" | "Team Lead" | "Manager">("Employee");
  const [domain, setDomain] = useState<"Frontend" | "Backend" | "UI/UX" | "QA" | "DevOps">("Frontend");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const employees = getEmployees();
    const newMember: Employee = {
      id: Math.max(0, ...employees.map(e => e.id)) + 1,
      name,
      role,
      domain,
      assignedHours: 0
    };

    saveEmployees([...employees, newMember]);
    alert(`✓ ${name} added successfully!`);
    onClose();
    window.location.reload(); // Refresh to show new member
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>👥 Add New Team Member</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              placeholder="e.g., John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Role *</label>
              <select value={role} onChange={e => setRole(e.target.value as any)}>
                <option value="Employee">Employee</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

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
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}