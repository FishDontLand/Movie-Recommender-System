import axios from "axios";
import authHeader from "./auth-header";
import Helpers from "../helpers"; 
import AuthService from "./auth.service";

const API_URL = "/api/use/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const saveFavorite = (movieInfo) => {
    let data = {
    };
  return axios.post(API_URL + "placeholder", data, {
    headers: authHeader(),
  });
}

const UserService =  {
  getPublicContent, saveFavorite,
};

export default UserService; 
