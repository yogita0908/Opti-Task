import { useState, useEffect } from "react";
import { Task } from "./data";
import "./SearchBar.css";

interface SearchBarProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export default function SearchBar({ tasks, onSelectTask }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // 👉 Only show DONE tasks in dropdown
  const doneTasks = tasks.filter(t => t.status === "done");
  
  const filteredTasks = doneTasks.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setShowDropdown(query.length > 0 && filteredTasks.length > 0);
  }, [query, filteredTasks.length]);

  return (
    <div className="search-container">
      <input
        className="search"
        placeholder="🔍 Search completed tasks..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      
      {showDropdown && (
        <div className="search-dropdown">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="search-item"
              onClick={() => {
                onSelectTask(task);
                setQuery("");
                setShowDropdown(false);
              }}
            >
              <div>
                <strong>{task.name}</strong>
                <div style={{ fontSize: "12px", color: "#64748B" }}>
                  {task.domain} • {task.hours} hrs
                </div>
              </div>
              <span className="badge done">✓ Done</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}