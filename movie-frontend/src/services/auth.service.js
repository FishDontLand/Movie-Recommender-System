import axios from "axios";
import config from "../config.json";

// const API_URL = "/api/auth/";
const API_URL = "http://localhost:8080/api/auth/"

const register = (username, email, password) => {
  return axios.post(API_URL + "register", { username, email, password });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "login", { username, password })
    .then((response) => {
      if (response.data.sessionId) {
          let user = {
              'displayName': response.data.displayName,
              'sessionId': response.data.sessionId
          }
        localStorage.setItem("user", JSON.stringify(user));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService; 