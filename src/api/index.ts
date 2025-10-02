import axios from "axios";

export const nestServerPath = "/api";
//export const nestServerPath = "http://localhost:3000/api";

export const fileServerPath = "/static";
//export const fileServerPath = "http://localhost:3000/static";


export async function getNewAccessToken() {
  const response = await fetch(`${nestServerPath}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Не удалось обновить токен");
  }
  const data = await response.json();
  // Бэкенд присылает в ответе { access_token: ... }
  return data.access_token;
}

export const appAPI = axios.create({
  baseURL: nestServerPath,
  withCredentials: true,
});

appAPI.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await getNewAccessToken();
        localStorage.setItem("access_token", newToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (e) {
        // Обработка если refresh не сработал (вылогинить пользователя)
      }
    }
    return Promise.reject(error);
  },
);

appAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
