// LoginPage.js
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = values;

    setLoading(true);

    try {
      const { data } = await axios.post(loginAPI, {
        email,
        password,
      });

      if (data.success === true) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
        toast.success(data.message, toastOptions);
        setLoading(false);
      } else {
        alert("Either email or password is wrong.");
        setLoading(false);
      }
    } catch (err) {
      alert("Either email or password is wrong.");
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <Container
        className="mt-5"
        style={{
          position: "relative",
          zIndex: "2 !important",
          background: "#fff",
          borderRadius: "24px",
          boxShadow: "none",
          padding: "2.5rem 2.5rem 2rem 2.5rem",
          maxWidth: "65vw", // Wider
          minWidth: "350px",
          border: "2px solid #FFD600",
          color: "#111",
        }}
      >
        <Row>
          <Col>
          <h2 className="text-center" style={{color: "#111", fontWeight: 900, marginBottom: "0.5rem", fontSize: "2.2rem"}}>Login Page</h2>
<h1 className="text-center mt-2 mb-3" style={{color: "#ffb400", fontWeight: 900, letterSpacing: "0.08em", fontSize: "1.3rem"}}>
  <br />
  Welcome Back!
</h1>
            <h2
              className="text-white text-center mb-4"
              style={{ fontWeight: 700, fontSize: "1.5rem" }}
            >
              Login
            </h2>
            <Form>
              <Form.Group controlId="formBasicEmail" className="mt-3">
                <Form.Label style={{color: "#111"}}>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label style={{color: "#111"}}>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                />
              </Form.Group>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                className="mt-4"
              >
                <Button
                  type="submit"
                  className=" text-center mt-3 btnStyle"
                  onClick={!loading ? handleSubmit : null}
                  disabled={loading}
                >
                  {loading ? "Signin…" : "Login"}
                </Button>

                <p className="mt-3" style={{ color: "#9d9494" }}>
                  Don't Have an Account?{" "}
                  <Link to="/register" style={{color: "#111", textDecoration: "underline"}}>Register</Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Login;
