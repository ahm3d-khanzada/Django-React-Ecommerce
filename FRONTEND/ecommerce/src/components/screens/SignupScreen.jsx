// SignupScreen.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Card, InputGroup } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import { validEmail, validName, validPassword } from "./RegexScreen";
import { signup } from "../../actions/UserActions";

function SignupScreen() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState("fa fa-eye-slash");
  const [redirecting, setRedirecting] = useState(false); // Track if redirect is happening

  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [isLongEnough, setIsLongEnough] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const userSignup = useSelector((state) => state.userSignup);
  const { error, loading, userInfo } = userSignup;

  useEffect(() => {
    if (userInfo) {
      if (!redirecting) {
        setMessage("Signup successful! Redirecting to login...");
        setRedirecting(true);
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      }
      
    }
    if (error) {
      setMessage(error); // Display the error message from Redux state
    }
  }, [userInfo, error, redirecting, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    setMessage("");

    if (pass1 !== pass2) {
      setMessage("Passwords do not match");
    } else if (!validName.test(fname)) {
      setMessage("First Name should only contain letters and be a maximum of 12 characters");
    } else if (!validName.test(lname)) {
      setMessage("Last Name should only contain letters and be a maximum of 12 characters");
    } else if (!isLongEnough || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setMessage("Password does not meet the requirements");
    } else {
      dispatch(signup(fname, lname, email, pass1));
    }
  };

  const showPassword = () => {
    const x = document.getElementById("pass1");
    const y = document.getElementById("pass2");

    if (x && y) {
      if (x.type === "password" && y.type === "password") {
        x.type = "text";
        y.type = "text";
        setShow("fa fa-eye"); // Show password
      } else {
        x.type = "password";
        y.type = "password";
        setShow("fa fa-eye-slash"); // Hide password
      }
    }
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPass1(pass);

    setHasUpperCase(/[A-Z]/.test(pass));
    setHasLowerCase(/[a-z]/.test(pass));
    setHasNumber(/\d/.test(pass));
    setHasSpecialChar(/[@$!%*?&]/.test(pass));
    setIsLongEnough(pass.length >= 8);
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col md={4}></Col>
        <Col md={4}>
          <Card>
            <Card.Header as="h3" className="text-center bg-black text-light">
              Signup
            </Card.Header>
            <Card.Body>
              {message && <Message variant='danger'>{message}</Message>}
              {loading && <Loader />}
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="fname">
                  <Form.Label>
                    <span>
                      <i className="fa fa-user"></i>
                    </span>{" "}
                    First Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="lname">
                  <Form.Label>
                    <span>
                      <i className="fa fa-user"></i>
                    </span>{" "}
                    Last Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>
                    <span>
                      <i className="fa-solid fa-envelope"></i>
                    </span>{" "}
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    {" "}
                    <span>
                      <i className={show}></i>
                    </span>
                    Password
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Checkbox onClick={showPassword} />
                    <Form.Control
                      placeholder="Enter Password"
                      required
                      type="password"
                      value={pass1}
                      onChange={handlePasswordChange}
                      id="pass1"
                    />
                  </InputGroup>
                  <div className="password-requirements">
                    <small className={isLongEnough ? "text-success" : "text-danger"}>
                      {isLongEnough ? '✔️' : '❌'} At least 8 characters long
                    </small>
                    <br />
                    <small className={hasUpperCase ? "text-success" : "text-danger"}>
                      {hasUpperCase ? '✔️' : '❌'} At least one uppercase letter
                    </small>
                    <br />
                    <small className={hasLowerCase ? "text-success" : "text-danger"}>
                      {hasLowerCase ? '✔️' : '❌'} At least one lowercase letter
                    </small>
                    <br />
                    <small className={hasNumber ? "text-success" : "text-danger"}>
                      {hasNumber ? '✔️' : '❌'} At least one number
                    </small>
                    <br />
                    <small className={hasSpecialChar ? "text-success" : "text-danger"}>
                      {hasSpecialChar ? '✔️' : '❌'} At least one special character
                    </small>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    {" "}
                    <span>
                      <i className="fa fa-key"></i>
                    </span>{" "}
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    placeholder="Confirm Password"
                    required
                    type="password"
                    value={pass2}
                    onChange={(e) => setPass2(e.target.value)}
                    id="pass2"
                  />
                </Form.Group>
                <Button
                  type="submit"
                  variant="dark"
                  className="w-100"
                >
                  Signup
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center">
              Already have an account?{" "}
              <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                <Button variant="link">Login</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={4}></Col>
      </Row>
    </Container>
  );
}

export default SignupScreen;
