import { User } from "./data";
import "./ProfileDropdown.css";

interface ProfileDropdownProps {
  user: User;
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileDropdown({ user, onClose, onLogout }: ProfileDropdownProps) {
  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-dropdown" onClick={e => e.stopPropagation()}>
        <div className="profile-header">
          <div className="profile-avatar">{user.name.charAt(0)}</div>
          <div className="profile-info-small">
            <strong>{user.name}</strong>
            <span className="role-small">{user.role}</span>
          </div>
        </div>

        <div className="profile-menu">
          <div className="profile-menu-item">
            <span>📧</span> {user.email}
          </div>
          <div className="profile-menu-item clickable">
            <span>⚙️</span> Settings
          </div>
          <div className="profile-menu-item clickable">
            <span>❓</span> Help & Support
          </div>
          <div className="profile-menu-divider"></div>
          <div className="profile-menu-item clickable danger" onClick={onLogout}>
            <span>🚪</span> Logout
          </div>
        </div>
      </div>
    </div>
  );
}