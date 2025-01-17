import axios from "axios";

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github.v3+json",
  },
});

let currentToken = "";

export const setGithubToken = (token: string) => {
  currentToken = token;
  if (token) {
    githubApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete githubApi.defaults.headers.common["Authorization"];
  }
};

githubApi.interceptors.request.use(
  (config) => {
    if (currentToken && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

githubApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || "An error occurred";
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }
);

export default githubApi; 