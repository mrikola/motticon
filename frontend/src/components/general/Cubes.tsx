import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../services/ApiService";
import { UserInfoContext } from "../provider/UserInfoProvider";

const Cubes = () => {
  const user = useContext(UserInfoContext);
  const navigate = useNavigate();
  if (user) {
    return (
      <div className="container">
        <div className="row">
          <h1>Cubes</h1>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="card">
              <svg className="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
              <div className="card-body">
                <h5 className="card-title">Cube title 1</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/cube/1" className="btn btn-primary">Go to cube</a>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <svg className="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
              <div className="card-body">
                <h5 className="card-title">Cube title 2</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/cube/2" className="btn btn-primary">Go to cube</a>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <svg className="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
              <div className="card-body">
                <h5 className="card-title">Cube title 3</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/cube/3" className="btn btn-primary">Go to cube</a>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <svg className="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
              <div className="card-body">
                <h5 className="card-title">Cube title 4</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/cube/4" className="btn btn-primary">Go to cube</a>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <svg className="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
              <div className="card-body">
                <h5 className="card-title">Cube title 5</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/cube/5" className="btn btn-primary">Go to cube</a>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <svg className="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
              <div className="card-body">
                <h5 className="card-title">Cube title 6</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/cube/6" className="btn btn-primary">Go to cube</a>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <svg className="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
              <div className="card-body">
                <h5 className="card-title">Cube title 7</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/cube/7" className="btn btn-primary">Go to cube</a>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <svg className="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
              <div className="card-body">
                <h5 className="card-title">Cube title 8</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/cube/8" className="btn btn-primary">Go to cube</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <>no user lul</>;
  }
};

export default Cubes;
