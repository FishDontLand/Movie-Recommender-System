import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import homeImg from "../assets/images/preview_homepage.png";
import {blue} from "@material-ui/core/colors";

const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div className="container" style={{"background-color": blue}}>
      <img alt="variety of movies" src={homeImg} />
    </div>
  );
};

export default Home;
