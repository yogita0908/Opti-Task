import { Task, Employee, User } from "./data";

const STORAGE_KEYS = {
  TASKS: 'flux_tasks',
  EMPLOYEES: 'flux_employees',
  USERS: 'flux_users'
};

// ========== TASKS ==========
export const getTasks = (): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  return stored ? JSON.parse(stored) : [];
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

// ========== EMPLOYEES ==========
export const getEmployees = (): Employee[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
  return stored ? JSON.parse(stored) : [];
};

export const saveEmployees = (employees: Employee[]) => {
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
};

// ========== USERS ==========
export const getUsers = (): User[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  return stored ? JSON.parse(stored) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// ========== INITIALIZE DATA (First time only) ==========
export const initializeData = (initialTasks: Task[], initialEmployees: Employee[], initialUsers: User[]) => {
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    saveTasks(initialTasks);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
    saveEmployees(initialEmployees);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    saveUsers(initialUsers);
  }
};

// ========== CLEAR ALL DATA (Reset option) ==========
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
  localStorage.removeItem(STORAGE_KEYS.USERS);
};