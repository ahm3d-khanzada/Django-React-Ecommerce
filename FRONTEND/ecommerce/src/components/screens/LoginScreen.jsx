import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import { validEmail, validName, validPassword } from "./RegexScreen";
import { signin } from "../../actions/UserActions";

function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [message, setMessage] = useState("");
  const [show, Changeshow] = useState("fa fa-eye-slash");

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userSignin);
  const { loading, error, userInfo } = userLogin;

  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(signin(email, pass1));

    // Check if there is an error or if the user info is missing
    if (!error && userInfo) {
      setMessage("Signin successful");
      navigate(redirect); // Redirect to the target page or default
    } else {
      setMessage("Invalid credentials. Please try again.");
    }
  };

  const showPassword = () => {
    var x = document.getElementById("pass1");
    // Check if elements exist
    if (x.type === "password") {
      x.type = "text";
      Changeshow(`fa fa-eye`); // Assuming 'changeShow' is defined elsewhere
    } else {
      x.type = "password";
      Changeshow(`fa fa-eye-slash`); // Assuming 'changeShow' is defined elsewhere
    }
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPass1(pass);
  };

  return (
    <Container className="mt-3 ">
      <Row
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Col md={4}></Col>
        <Col md={4}>
          {loading ? (
            <Loader></Loader> // Display loading state if `loading` is true.
          ) : error ? (
            <Message variant="danger">{error}</Message> // Display error message if `error` is true.
          ) : (
            <Card>
              <Card.Header as="h3" className="text-center bg-black text-light">
                Signin
              </Card.Header>
              <Card.Body>
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>
                      <span>
                        <i className="fa-solid fa-envelope"></i>
                      </span>{" "}
                      Email{" "}
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
                      <InputGroup.Checkbox onClick={showPassword} />{" "}
                      <Form.Control
                        placeholder="Enter Password"
                        required
                        type="password"
                        value={pass1}
                        onChange={handlePasswordChange}
                        id="pass1"
                      />
                    </InputGroup>
                  </Form.Group>

                  <br />
                  <div className="d-grid gap-2">
                    <Button className="btn btn-md btn-success" type="submit">
                      Signin
                    </Button>
                  </div>
                </Form>
                <Row className="py-3">
                  <Col>
                    Forget password? 
                    <Link to={"/forgetpassword"}>  Reset Password</Link>
                  </Col>
                </Row>
                <Row className="py-3">
                  <Col>
                    Don't have an account?
                    <Link to={"/signup"}> Signup</Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
        <Col md={4}></Col>
      </Row>
    </Container>
  );
}

export default LoginScreen;
