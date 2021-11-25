import React, { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "./styles/App.css";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import AppHeader from "./components/AppHeader";
import PlayersPage from "./components/PlayersPage";
import MovieSearchPage from "./components/MovieSearchPage";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          <AppHeader />
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              <button type="button" className="btn btn-primary">
                Home
              </button>
            </Link>
          </li>

          {currentUser && (
            <li className="nav-item">
              <Link to={"/movieSearchPage"} className="nav-link">
                <button type="button" className="btn btn-primary">
                  movieSearchPage
                </button>
              </Link>
            </li>

          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav justify-content-end">
            <li className="nav-item">
              <Link to={"/myFavorite"}>
                <h5 id="welcomeMessage" className="nav-link">
                  Welcome, {currentUser.displayName}, check out your fav here!
                </h5>
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                <button
                  type="button"
                  className="btn btn-secondary my-2 my-sm-0"
                >
                  Log Out
                </button>
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                <button type="button" className="btn btn-primary">
                  Register

                </button>
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                <button type="button" className="btn btn-primary">
                  Login
                </button>
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/home"]} component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/movieSearchPage" component={MovieSearchPage}/>
          <Route path="/myFavorite" component={MovieSearchPage}/>
        </Switch>
      </div>
    </div>
  );
};

export default App;
