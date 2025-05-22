import React from "react";

const Footer = () => (
  <footer style={{
    width: "100%",
    background: "#000000",
    color: "#FFD600",
    textAlign: "center",
    padding: "1rem 0",
    fontWeight: 700,
    fontSize: "1rem",
    letterSpacing: "0.04em",
    borderTop: "2px solid #111",
    position: "fixed",
    left: 0,
    bottom: 0,
    zIndex: 100
  }}>
    Made by <a
      href="https://www.linkedin.com/in/vikaskumar20/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#FFD600", textDecoration: "underline", fontWeight: 700 }}
    >Vikas Kumar</a>
  </footer>
);

export default Footer;