import { FaGoogle, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./index.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-icons">
      <span className="icon-btn">
        <FaGoogle />
      </span>
      <span className="icon-btn">
        <FaTwitter />
      </span>
      <span className="icon-btn">
        <FaInstagram />
      </span>
      <span className="icon-btn">
        <FaYoutube />
      </span>
    </div>
    <p className="footer-text">Contact us</p>
  </footer>
);

export default Footer;
