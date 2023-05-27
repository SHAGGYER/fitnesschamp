import axios from "axios";

axios.defaults.headers.Authorization = `Bearer ${
  localStorage.getItem("token") || ""
}`;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;
