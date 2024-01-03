import { Container, Navbar, Nav } from "react-bootstrap";
import { Boxes, PersonFill } from "react-bootstrap-icons";
import { Outlet, useLocation } from "react-router";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("user") !== null;
  return isLoggedIn && location.pathname !== "/login" ? (
    <>
      <header>
        <Navbar expand="lg">
          <Container fluid>
            <Navbar.Brand>
              <Link className="navbar-brand" to="/">
                Navbar
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
                  <Link className="nav-link active" aria-current="page" to="/">
                    Home
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link className="nav-link" to="/profile">
                    <PersonFill />
                    Profile
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link className="nav-link" to="/cubes">
                    <Boxes />
                    Cubes
                  </Link>
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
