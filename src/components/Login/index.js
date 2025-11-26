import { Component } from "react";
import Cookies from "js-cookie";

import { useNavigate } from "react-router-dom";
import "./index.css";

class Login extends Component {
  state = {
    username: "",
    password: "",
    errorMsg: "",
    showError: false,
  };

  componentDidMount() {
    const jwtToken = Cookies.get("jwt_token");
    if (jwtToken !== undefined) {
      this.props.navigate("/");
    }
  }

  onChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  onSubmitSuccess = (jwtToken) => {
    const { username, password } = this.state;
    Cookies.set("jwt_token", jwtToken, { expires: 30 });
    localStorage.setItem("movies_username", username);
    localStorage.setItem("movies_password", password);

    this.props.navigate("/", { replace: true });
  };

  onSubmitFailure = (errorMsg) => {
    this.setState({ errorMsg, showError: true });
  };

  onSubmitForm = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    const userDetails = { username, password };
    const url = "https://apis.ccbp.in/login";
    const options = {
      method: "POST",
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token);
    } else {
      this.onSubmitFailure(data.message);
    }
  };

  render() {
    const { username, password, errorMsg, showError } = this.state;

    return (
      <div className="login-bg">
        <div className="logo-container">
          <img
            src="https://i.postimg.cc/dtyBJHq5/Group-7399.png"
            alt="website logo"
            className="header-logo"
          />
        </div>
        <div className="container">
          <form className="login-form" onSubmit={this.onSubmitForm}>
            <h1 className="login-header">Login</h1>
            <div className="input-group">
              <label htmlFor="username">USERNAME</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={this.onChangeUsername}
                placeholder="Username"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">PASSWORD</label>
              <input
                id="password"
                type="password"
                className="login-password"
                value={password}
                onChange={this.onChangePassword}
                placeholder="Password"
              />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
            {showError && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    );
  }
}

function LoginWithNavigate(props) {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
}

export default LoginWithNavigate;
