import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || "https://morning-temple-77648-10e1a6020960.herokuapp.com",
});

export default api;