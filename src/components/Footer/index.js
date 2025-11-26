import {
  FaGoogle,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import "./index.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-icons">
      <a
        href="mailto:manjundhar1701@gmail.com"
        className="icon-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGoogle />
      </a>

      <Link to="https://x.com/ManjundharM" className="icon-btn">
        <FaTwitter />
      </Link>
      <Link
        to="https://www.instagram.com/_manju.smartz0_/#"
        className="icon-btn"
      >
        <FaInstagram />
      </Link>
      <Link
        to="https://www.linkedin.com/in/manjundhar-adagiri/"
        className="icon-btn"
      >
        <FaLinkedin />
      </Link>
      <Link to="https://github.com/Manju025" className="icon-btn">
        <FaGithub />
      </Link>
    </div>
    <p className="footer-text">Contact us</p>
  </footer>
);

export default Footer;
