// SignupPage.js
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";

const Register = () => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('user')){
      navigate('/');
    }
  }, [navigate]);



  const [values, setValues] = useState({
    name : "",
    email : "",
    password : "",

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
  }

  const handleChange = (e) => {
    setValues({...values , [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {name, email, password} = values;

    setLoading(true);

    try {
      const {data} = await axios.post(registerAPI, {
        name,
        email,
        password
      });

      if(data.success === true){
        delete data.user.password;
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        setLoading(false);
        navigate("/");
      }
      else{
        if(data.message && data.message.toLowerCase().includes("already")) {
          alert("Email already exists, please login.");
        } else {
          toast.error(data.message, toastOptions);
        }
        setLoading(false);
      }
    } catch (err) {
      if(err.response && err.response.data && err.response.data.message && err.response.data.message.toLowerCase().includes("already")) {
        alert("Email already exists, please login.");
      } else {
        toast.error("Registration failed.", toastOptions);
      }
      setLoading(false);
    }
  };

  return (
    <>
    <div style={{ position: 'relative', overflow: 'hidden' }}>
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
    <h2 className="text-center" style={{color: "#111", fontWeight: 900, marginBottom: "0.5rem", fontSize: "2.2rem"}}>Register Page</h2>
    <h1 className="text-center" style={{color: "#ffb400", fontWeight: 900, letterSpacing: "0.08em", fontSize: "1.3rem"}}>
      Join Us!
    </h1>
    
    <Col md={{ span: 6, offset: 3 }}>
          <Form>
            <Form.Group controlId="formBasicName" className="mt-3" >
              <Form.Label style={{color: "#111"}}>Name</Form.Label>
              <Form.Control type="text"  name="name" placeholder="Full name" value={values.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formBasicEmail" className="mt-3">
              <Form.Label style={{color: "#111"}}>Email address</Form.Label>
              <Form.Control type="email"  name="email" placeholder="Enter email" value={values.email} onChange={handleChange}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mt-3">
              <Form.Label style={{color: "#111"}}>Password</Form.Label>
              <Form.Control type="password"  name="password" placeholder="Password" value={values.password} onChange={handleChange} />
            </Form.Group>
            <div style={{width: "100%", display: "flex" , alignItems:"center", justifyContent:"center", flexDirection: "column"}} className="mt-4">
              {/* <Link to="/forgotPassword" style={{color: "#111", textDecoration: "underline"}}>Forgot Password?</Link> */}

              <Button
                  type="submit"
                  className=" text-center mt-3 btnStyle"
                  onClick={!loading ? handleSubmit : null}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Signup"}
                </Button>

              <p className="mt-3" style={{color: "#9d9494"}}>Already have an account? <Link to="/login" style={{color: "#111", textDecoration: "underline"}}>Login</Link></p>
            </div>
          </Form>
        </Col>
  </Row>
  <ToastContainer />
</Container>
    </div>
    </>
  )
}

export default Register