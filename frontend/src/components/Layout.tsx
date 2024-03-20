import { Container, Navbar, Nav } from "react-bootstrap";
import {
  BoxArrowRight,
  HouseFill,
  TrophyFill,
  PersonFillCheck,
  BoxFill,
} from "react-bootstrap-icons";
import { Outlet, useLocation } from "react-router";
import { Link, NavLink } from "react-router-dom";
import Footer from "./Footer";
import { UserInfoContext } from "./provider/UserInfoProvider";
import { useContext } from "react";

const Layout = () => {
  const user = useContext(UserInfoContext);
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("user") !== null;
  return isLoggedIn && location.pathname !== "/login" ? (
    <>
      <header>
        <Navbar expand="lg" className="bg-primary">
          <Container fluid>
            <Navbar.Brand>
              <Link className="navbar-brand" to="/">
                MottiCon
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </Navbar.Toggle>
            <Navbar.Collapse id="navbarSupportedContent">
              <Nav className="me-auto">
                <Nav.Item>
                  <NavLink
                    className="nav-link icon-link"
                    aria-current="page"
                    to="/"
                  >
                    <HouseFill />
                    Home
                  </NavLink>
                </Nav.Item>
                {user?.isAdmin && (
                  <Nav.Item>
                    <NavLink className="nav-link icon-link" to="/admin">
                      <PersonFillCheck />
                      Admin
                    </NavLink>
                  </Nav.Item>
                )}
                <Nav.Item>
                  <NavLink className="nav-link icon-link" to="/tournaments">
                    <TrophyFill />
                    Tournaments
                  </NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink className="nav-link icon-link" to="/cubes">
                    <BoxFill />
                    Cubes
                  </NavLink>
                </Nav.Item>
              </Nav>
              <Nav className="flex-row flex-wrap ms-md-auto">
                <div className="vr d-none d-lg-block mx-2"></div>
                <hr className="d-xs d-lg-none w-100" />
                <Nav.Item>
                  <NavLink className="nav-link icon-link" to={"/logout"}>
                    <BoxArrowRight />
                    Log out
                  </NavLink>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <Outlet />
      <Footer />
    </>
  ) : (
    <>
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
