import React from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/UserActions";
function Header() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();

  const LogoutHandel = () => {
    dispatch(logout());
  };

  return (
    <>
      <Navbar className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
        <div className="container-fluid">
          {/*yee jo LinkContainer hy yee href ki jaga aye gia hy*/}
          <LinkContainer to="/">
            {/*yee jo Nav.Link hy yee Ancor <a/>  tag ki jaga aye gia hy  ..... yee sab hum iss lia kar rhy han taku SPR achive kar saky*/}
            <Nav.Link className="navbar-brand">A.K</Nav.Link>
          </LinkContainer>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor02"
            aria-controls="navbarColor02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarColor02">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <LinkContainer to="/">
                  <Nav.Link className="nav-link active">
                    <i className="fa-solid fa-house"></i> Home{" "}
                  </Nav.Link>
                </LinkContainer>
              </li>
              <li className="nav-item">
                <LinkContainer to="/cart">
                  <Nav.Link className="nav-link">Cart</Nav.Link>
                </LinkContainer>
              </li>

              {userInfo ? (
                <li className="nav-item dropdown">
                  <LinkContainer to="/">
                    <Nav.Link
                      className="nav-link dropdown-toggle"
                      data-bs-toggle="dropdown"
                      role="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Welcome {userInfo.name}
                    </Nav.Link>
                  </LinkContainer>
                  <div className="dropdown-menu">
                    <Nav.Link className="dropdown-item" onClick={LogoutHandel}>
                      Logout
                    </Nav.Link>
                  </div>
                </li>
              ) : (
                <li className="nav-item dropdown">
                  <LinkContainer to="/signup">
                    <Nav.Link
                      className="nav-link dropdown-toggle"
                      data-bs-toggle="dropdown"
                      role="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      New User
                    </Nav.Link>
                  </LinkContainer>
                  <div className="dropdown-menu">
                    <LinkContainer to="/login">
                      <Nav.Link className="dropdown-item">Login</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/signup">
                      <Nav.Link className="dropdown-item">Signup</Nav.Link>
                    </LinkContainer>
                  </div>
                </li>
              )}
            </ul>
            <form className="d-flex">
              <input
                className="form-control me-sm-2"
                type="search"
                placeholder="Search"
              />
              <button className="btn btn-secondary my-2 my-sm-0" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </Navbar>
    </>
  );
}

export default Header;
