import { Outlet, useLocation } from "react-router";
import { Link } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("user") !== null;
  return isLoggedIn && location.pathname !== "/login" ? (
    <>
      <header>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Navbar
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    <i className="bi bi-person-fill"></i> Profile
                  </Link>
                </li>
                <li className="nav-item">

                  <Link className="nav-link" to="/cubes">
                    <i className="bi bi-boxes"></i> Cubes
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  ) : (
    <Outlet />
  );
};

export default Layout;
