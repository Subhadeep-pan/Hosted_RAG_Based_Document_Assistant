import axios from "axios";

const SESSION_ID_KEY = "session_id";

// Every browser tab/user gets its own random session id, saved in
// localStorage so it survives page refreshes. The backend uses this to
// keep each user's chat history and cache separate.
function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  config.headers["X-Session-Id"] = getSessionId();

  // Only sent if you set VITE_API_KEY in the frontend .env file, to
  // match an API_KEY set on the backend.
  if (import.meta.env.VITE_API_KEY) {
    config.headers["X-Api-Key"] = import.meta.env.VITE_API_KEY;
  }

  return config;
});

export default api;
