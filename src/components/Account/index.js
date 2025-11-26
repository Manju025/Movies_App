import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import "./index.css";

const Account = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("movies_username") || "";
  const password = localStorage.getItem("movies_password") || "";
  const masked = "*".repeat(password.length || 8);

  const onClickLogout = () => {
    Cookies.remove("jwt_token");
    localStorage.removeItem("movies_username");
    localStorage.removeItem("movies_password");
    navigate("/login");
  };

  return (
    <>
      <Header />
      <div className="account-bg">
        <h1 className="account-heading">Account</h1>
        <hr />
        <div className="account-row">
          <p className="label">Member ship</p>
          <div>
            <p className="value">{username}</p>
            <div className="account-row">
              <p className="label p">Password</p>
              <p className="value">{masked}</p>
            </div>
          </div>
        </div>
        <hr />
        <div className="account-row">
          <p className="label">Plan Details</p>
          <div className="plan-container">
            <p className="value">Premium</p>
            <p className="span-p">Ultra HD</p>
          </div>
        </div>
        <hr />
        <button type="button" className="logout-btn" onClick={onClickLogout}>
          Logout
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Account;
