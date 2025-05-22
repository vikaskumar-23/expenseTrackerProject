import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import './style.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const goLogin = () => navigate('/login');
  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" variant="dark" className="app-navbar">
      <Navbar.Brand href="/" className="app-title">
        Expense Tracker
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
              <span style={{
                color: "#FFD600",
                fontWeight: "bold",
                fontSize: "1.15rem",
                background: "#111",
                borderRadius: "16px",
                padding: "0.5rem 1.5rem",
                border: "2px solid #ffe066",
                marginRight: "0.5rem",
                display: "inline-block"
              }}>
                {user.name}
              </span>
              <Button
                variant="outline-light"
                onClick={logout}
                className="logout-btn"
                style={{
                  background: "#FFD600",
                  color: "#111",
                  border: "none",
                  borderRadius: "16px",
                  fontWeight: 700
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="outline-light" onClick={goLogin}>
              Login
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;