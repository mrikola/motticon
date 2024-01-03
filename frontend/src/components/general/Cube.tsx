import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../services/ApiService";
import { UserInfoContext } from "../provider/UserInfoProvider";
import { useParams } from 'react-router';

const Cubes = (route) => {
  const user = useContext(UserInfoContext);
  const navigate = useNavigate();
  const params= useParams()
  if (user) {
    return (
      <div className="container">
        <div className="row">
          <h1>This is cube: {params.cubeId}</h1>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <h2>Cube Designer: John Doe</h2>
            <a href="https://cubecobra.com/cube/overview/thebteam" target="_blank" className="btn btn-primary">Go to Cube Cobra</a>
          </div>
        </div>
      </div>
    );
  } else {
    return <>no user lul</>;
  }
};

export default Cubes;
