import axios from "axios";

function getBaseApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl) {
    return "/api";
  }
  // In production (e.g. on Vercel), if env points to localhost:8000, fallback to same-origin /api
  if (typeof window !== "undefined") {
    if (envUrl.includes("localhost:8000") && window.location.hostname !== "localhost") {
      return "/api";
    }
  }
  return envUrl;
}

export const api = axios.create({
  baseURL: getBaseApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Dynamically ensure the baseURL is up to date with environment
  config.baseURL = getBaseApiUrl();
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("flowzint_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      // Clear token only if on a protected page
      if (window.location.pathname.startsWith("/dashboard")) {
        localStorage.removeItem("flowzint_token");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  signup: (email: string, password: string, full_name: string) =>
    api.post("/auth/signup", { email, password, full_name }),
  login: (email: string, password: string) =>
    api.post("/auth/login", new URLSearchParams({ username: email, password }), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }),
  google: (data: { email: string; full_name?: string; google_id?: string; avatar_url?: string; credential?: string }) =>
    api.post("/auth/google", data),
  demo: () => api.post("/auth/demo", {}),
  me: () => api.get("/auth/me"),
};

export const resumeApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  list: () => api.get("/resume/mine"),
};

export const interviewApi = {
  generate: (role: string, difficulty: string, categories: string[], resume_id?: number) =>
    api.post("/interview/generate", { role, difficulty, categories, resume_id }),
  evaluate: (session_id: number, answer_text: string, question_index: number) =>
    api.post("/interview/evaluate", { session_id, answer_text, question_index }),
  history: () => api.get("/interview/history"),
};

export const chatApi = {
  sendMessage: (session_id: string, role: string, content: string) =>
    api.post("/chat/message", { session_id, role, content }),
  getSession: (session_id: string) => api.get(`/chat/session/${session_id}`),
};

export const analyticsApi = {
  getSummary: () => api.get("/analytics/summary"),
};
