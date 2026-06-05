export type UserRole = "client" | "intern";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  memberSince?: string;
  projectCount?: number;
  // intern fields
  batch?: string;
  internRole?: string;
  startDate?: string;
  endDate?: string;
  skills?: string[];
  linkedin?: string;
}

export interface Project {
  id: string;
  name: string;
  status: "Planning" | "In Progress" | "Testing" | "Live";
  progress: number;
  startDate: string;
  endDate: string;
  team: string[];
  description?: string;
  milestones: Milestone[];
  files?: ProjectFile[];
  updates?: Update[];
}

export interface Milestone {
  id: string;
  title: string;
  status: "completed" | "in_progress" | "pending";
  date?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Update {
  id: string;
  message: string;
  author: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "Paid" | "Pending" | "EMI";
  projectName: string;
  emiSchedule?: EmiInstallment[];
  pdfUrl?: string;
}

export interface EmiInstallment {
  installmentNo: number;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
}

export interface EmiTracker {
  totalCost: number;
  amountPaid: number;
  remainingAmount: number;
  nextEmiDate: string;
  nextEmiAmount: number;
  history: EmiInstallment[];
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  updatedAt: string;
  replies?: TicketReply[];
}

export interface TicketReply {
  id: string;
  message: string;
  author: string;
  isStaff: boolean;
  createdAt: string;
}

export interface MonthlyReport {
  id: string;
  month: string;
  year: number;
  websiteSpeed: number;
  uptime: number;
  seoScore: number;
  pdfUrl?: string;
}

export interface InternTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string;
  message: string;
  author: string;
  createdAt: string;
}

export interface Standup {
  id: string;
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
}

export interface InternDocument {
  type: "offer_letter" | "certificate" | "lor";
  label: string;
  available: boolean;
  pdfUrl?: string;
  verificationCode?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "project" | "invoice" | "emi" | "ticket" | "task";
  read: boolean;
  createdAt: string;
}
