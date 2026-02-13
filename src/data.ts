export interface Task {
  id: number;
  name: string;
  hours: number;
  priority: "High" | "Medium" | "Low";
  status: "todo" | "inprogress" | "done";
  domain: "Frontend" | "Backend" | "UI/UX" | "QA" | "DevOps";
  deadline?: string;
  assignedTo?: number; // employee ID
  createdBy: number;
}

export interface Employee {
  id: number;
  name: string;
  role: "Admin" | "Manager" | "Team Lead" | "Employee";
  domain: "Frontend" | "Backend" | "UI/UX" | "QA" | "DevOps" | "Admin";
  assignedHours: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Manager" | "Team Lead" | "Employee";
}

// 👉 Updated employees with domain info
export const employees: Employee[] = [
  { id: 1, name: "Yogita", role: "Admin", domain: "Admin", assignedHours: 30 },
  { id: 2, name: "Rahul", role: "Employee", domain: "Backend", assignedHours: 10 },
  { id: 3, name: "Priya", role: "Team Lead", domain: "Frontend", assignedHours: 25 },
  { id: 4, name: "Amit", role: "Employee", domain: "UI/UX", assignedHours: 5 },
  { id: 5, name: "Neha", role: "Employee", domain: "QA", assignedHours: 30 }
];

export const tasks: Task[] = [
  { 
    id: 1, 
    name: "Design Login Page", 
    hours: 12, 
    priority: "High", 
    status: "todo",
    domain: "UI/UX",
    deadline: "2026-02-20",
    createdBy: 1
  },
  { 
    id: 2, 
    name: "Build Navbar", 
    hours: 8, 
    priority: "Medium", 
    status: "todo",
    domain: "Frontend",
    createdBy: 1
  },
  { 
    id: 3, 
    name: "Create Payment API", 
    hours: 15, 
    priority: "High", 
    status: "inprogress",
    domain: "Backend",
    assignedTo: 2, // Rahul
    createdBy: 1
  },
  { 
    id: 4, 
    name: "Fix Login Bug", 
    hours: 6, 
    priority: "Low", 
    status: "done",
    domain: "QA",
    assignedTo: 5, // Neha
    createdBy: 1
  }
];

export const users: User[] = [
  { id: 1, name: "Yogita", email: "admin@flux.com", password: "admin123", role: "Admin" },
  { id: 2, name: "Rahul", email: "rahul@flux.com", password: "rahul123", role: "Employee" },
  { id: 3, name: "Priya", email: "priya@flux.com", password: "priya123", role: "Team Lead" },
  { id: 4, name: "Amit", email: "amit@flux.com", password: "amit123", role: "Employee" },
  { id: 5, name: "Neha", email: "neha@flux.com", password: "neha123", role: "Employee" }
];