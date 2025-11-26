import { Component } from "react";
import Cookies from "js-cookie";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

class Signup extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    errorMsg: "",
    showError: false,
    showPassword: false,
  };

  componentDidMount() {
    const token = Cookies.get("jwt_token");
    if (token !== undefined) {
      this.props.navigate("/");
    }
  }

  onChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  onChangeEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  onChangeConfirmPassword = (event) => {
    this.setState({ confirmPassword: event.target.value });
  };

  onClickShowPassword = () => {
    this.setState({ showPassword: true });
  };

  onClickHidePassword = () => {
    this.setState({ showPassword: false });
  };

  onSubmitFailure = (errorMsg) => {
    this.setState({ errorMsg, showError: true });
  };

  onSubmitForm = async (event) => {
    event.preventDefault();
    const { username, password, email, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      this.onSubmitFailure("Passwords do not match");
      return;
    }
    const userDetails = { username, email, password };
    const url = "http://localhost:5000/auth/signup";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      this.props.navigate("/login", { replace: true });
    } else {
      this.onSubmitFailure(data.message);
    }
  };

  render() {
    const {
      username,
      email,
      password,
      confirmPassword,
      showPassword,
      errorMsg,
      showError,
    } = this.state;

    return (
      <div className="signup-bg">
        <div className="logo-container">
          <img
            src="https://i.postimg.cc/dtyBJHq5/Group-7399.png"
            alt="website logo"
            className="signup-logo"
          />
        </div>
        <div className="container">
          <form className="signup-form" onSubmit={this.onSubmitForm}>
            <h1 className="signup-header">Sign Up</h1>
            <div className="input-group">
              <label htmlFor="username">USERNAME</label>
              <input
                id="username"
                type="text"
                className="input"
                value={username}
                onChange={this.onChangeUsername}
                placeholder="Username"
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">EMAIL</label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={this.onChangeEmail}
                placeholder="Email"
              />
            </div>
            <div className="input-password-group">
              <label htmlFor="password">PASSWORD</label>
              <div className="password-input-container">
                <input
                  id="password"
                  className="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={this.onChangePassword}
                  placeholder="Password"
                />
                {showPassword ? (
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={this.onClickHidePassword}
                  >
                    <LuEye />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={this.onClickShowPassword}
                  >
                    <LuEyeClosed />
                  </button>
                )}
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
              <input
                id="confirmPassword"
                type="password"
                className="input"
                value={confirmPassword}
                onChange={this.onChangeConfirmPassword}
                placeholder="Confirm Password"
              />
            </div>
            <p className="info-txt">
              Already have an account? <Link to="/login">Login</Link>
            </p>
            <button type="submit" className="signup-btn">
              Sign Up
            </button>
            {showError && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    );
  }
}

function SignupWithNavigate(props) {
  const navigate = useNavigate();
  return <Signup {...props} navigate={navigate} />;
}

export default SignupWithNavigate;
