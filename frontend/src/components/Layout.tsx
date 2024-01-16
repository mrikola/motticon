import { Container, Navbar, Nav } from "react-bootstrap";
import {
  PersonFill,
  BoxArrowRight,
  HouseFill,
  TrophyFill,
  PersonFillCheck,
} from "react-bootstrap-icons";
import { Outlet, useLocation } from "react-router";
import { Link } from "react-router-dom";
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
                  <Link className="nav-link active" aria-current="page" to="/">
                    <HouseFill />
                    Home
                  </Link>
                </Nav.Item>
                {user?.isAdmin && (
                  <Nav.Item>
                    <Link className="nav-link" to="/admin">
                      <PersonFillCheck />
                      Admin
                    </Link>
                  </Nav.Item>
                )}

                <Nav.Item>
                  <Link className="nav-link" to="/tournaments">
                    <TrophyFill />
                    Tournaments
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
