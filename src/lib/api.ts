import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const BASE_URL = "https://softyana-tech.vercel.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("auth_token");
      await SecureStore.deleteItemAsync("auth_user");
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (data: { name: string; email: string; password: string; company?: string }) =>
    api.post("/auth/register", data),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
};

// Client
export const clientApi = {
  getProjects: () => api.get("/client/projects"),
  getProject: (id: string) => api.get(`/client/projects/${id}`),
  getInvoices: () => api.get("/client/invoices"),
  getEmiTracker: () => api.get("/client/emi"),
  getTickets: () => api.get("/client/tickets"),
  createTicket: (data: { subject: string; description: string; priority: string }) =>
    api.post("/client/tickets", data),
  getReports: () => api.get("/client/reports"),
  getNotifications: () => api.get("/client/notifications"),
};

// Intern
export const internApi = {
  getTasks: () => api.get("/intern/tasks"),
  completeTask: (id: string) => api.patch(`/intern/tasks/${id}/complete`),
  addTaskComment: (id: string, message: string) =>
    api.post(`/intern/tasks/${id}/comments`, { message }),
  submitStandup: (data: { yesterday: string; today: string; blockers: string }) =>
    api.post("/intern/standup", data),
  getStandups: () => api.get("/intern/standup"),
  getDocuments: () => api.get("/intern/documents"),
};
