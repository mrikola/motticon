import { Container, Navbar, Nav } from "react-bootstrap";
import {
  Boxes,
  PersonFill,
  ListOl,
  BoxArrowRight,
  HouseFill,
  TrophyFill,
} from "react-bootstrap-icons";
import { Outlet, useLocation } from "react-router";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
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
                  <Link className="nav-link active" aria-current="page" to="/">
                    <HouseFill />
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
                  <Link className="nav-link" to="/roundOngoing">
                    <TrophyFill />
                    Tournament
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link className="nav-link" to="/cubes">
                    <Boxes />
                    Cubes
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link className="nav-link" to="/standings">
                    <ListOl />
                    Standings
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link className="nav-link" to="/players/1">
                    <PersonFill />
                    Public Profile
                  </Link>
                </Nav.Item>
              </Nav>
              <Nav className="flex-row flex-wrap ms-md-auto">
                <div className="vr d-none d-lg-block"></div>
                <hr className="d-xs d-lg-none w-100" />
                <Nav.Item>
                  <Link className="nav-link" to={"/logout"}>
                    <BoxArrowRight />
                    Log out
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
