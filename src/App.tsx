import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import { User, tasks as initialTasks, employees as initialEmployees, users as initialUsers } from "./data";
import { initializeData } from "./storageUtils";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  // 👉 Initialize localStorage on first load
  useEffect(() => {
    initializeData(initialTasks, initialEmployees, initialUsers);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleRegister = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // If logged in → show Dashboard
  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  // If not logged in → show Login or Register
  return showRegister ? (
    <Register
      onRegister={handleRegister}
      onSwitchToLogin={() => setShowRegister(false)}
    />
  ) : (
    <Login
      onLogin={handleLogin}
      onSwitchToRegister={() => setShowRegister(true)}
    />
  );
}

export default App;